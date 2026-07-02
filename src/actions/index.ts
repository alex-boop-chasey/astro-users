import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';
import { getSupabase } from '../lib/supabase';

async function verifyTurnstile(token: string, remoteIp: string | null) {
  const secretKey = import.meta.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    throw new ActionError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Cloudflare Turnstile secret key is not configured.'
    });
  }

  const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
  const formData = new URLSearchParams();
  formData.append('secret', secretKey);
  formData.append('response', token);
  if (remoteIp) {
    formData.append('remoteip', remoteIp);
  }

  try {
    const res = await fetch(verifyUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const data = await res.json() as { success: boolean; 'error-codes'?: string[] };
    if (!data.success) {
      throw new ActionError({
        code: 'BAD_REQUEST',
        message: 'Security verification failed. Please check the Turnstile widget and try again.'
      });
    }
  } catch (err: any) {
    if (err instanceof ActionError) throw err;
    throw new ActionError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Error validating security CAPTCHA: ' + err.message
    });
  }
}

export const server = {
  signUp: defineAction({
    accept: 'json',
    input: z.object({
      name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
      email: z.string().email({ message: 'Invalid email address.' }),
      password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
      turnstileToken: z.string().min(1, { message: 'Please complete the Turnstile challenge.' }),
    }),
    handler: async (input, context) => {
      const clientIp = context.request.headers.get('cf-connecting-ip') || context.request.headers.get('x-real-ip');
      
      // 1. Verify Cloudflare Turnstile token
      await verifyTurnstile(input.turnstileToken, clientIp);

      // 2. Sign up user via Supabase SSR client
      const supabase = getSupabase(context.request, context.cookies);
      const siteUrl = import.meta.env.PUBLIC_SITE_URL || import.meta.env.SITE_URL;
      const emailRedirectTo = siteUrl
        ? `${siteUrl.replace(/\/$/, '')}/dashboard`
        : `${new URL(context.request.url).origin}/dashboard`;

      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            name: input.name,
          },
          emailRedirectTo,
        },
      });

      if (error) {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: error.message,
        });
      }

      // Check if user is auto-confirmed or requires confirmation
      const session = data.session;
      const user = data.user;
      
      return {
        success: true,
        message: session 
          ? 'Registration successful! You are now logged in.' 
          : 'Registration successful! Please check your email to confirm your account.',
        user,
        hasSession: !!session
      };
    },
  }),

  signIn: defineAction({
    accept: 'json',
    input: z.object({
      email: z.string().email({ message: 'Invalid email address.' }),
      password: z.string().min(1, { message: 'Password is required.' }),
      turnstileToken: z.string().min(1, { message: 'Please complete the Turnstile challenge.' }),
    }),
    handler: async (input, context) => {
      const clientIp = context.request.headers.get('cf-connecting-ip') || context.request.headers.get('x-real-ip');

      // 1. Verify Cloudflare Turnstile token
      await verifyTurnstile(input.turnstileToken, clientIp);

      // 2. Authenticate user via Supabase SSR client
      const supabase = getSupabase(context.request, context.cookies);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      if (error) {
        throw new ActionError({
          code: 'UNAUTHORIZED',
          message: error.message,
        });
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
      };
    },
  }),

  signOut: defineAction({
    accept: 'json',
    handler: async (_input, context) => {
      const supabase = getSupabase(context.request, context.cookies);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }

      return { success: true };
    },
  }),
};
