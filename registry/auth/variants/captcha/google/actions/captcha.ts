import { ActionError } from 'astro:actions';

/**
 * Server-side CAPTCHA verification — Google reCAPTCHA v2 (checkbox).
 * The auth actions call this generic `verifyCaptcha`; swapping providers swaps this file.
 * Throws an ActionError when verification fails so the action reports a clean error.
 */
export async function verifyCaptcha(token: string | undefined, remoteIp: string | null): Promise<void> {
  const secretKey = import.meta.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    throw new ActionError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Google reCAPTCHA secret key is not configured.',
    });
  }

  if (!token) {
    throw new ActionError({
      code: 'BAD_REQUEST',
      message: 'Please complete the security challenge.',
    });
  }

  const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
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
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const data = (await res.json()) as { success: boolean; 'error-codes'?: string[] };
    if (!data.success) {
      throw new ActionError({
        code: 'BAD_REQUEST',
        message: 'Security verification failed. Please try the challenge again.',
      });
    }
  } catch (err: any) {
    if (err instanceof ActionError) throw err;
    throw new ActionError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Error validating CAPTCHA: ' + err.message,
    });
  }
}
