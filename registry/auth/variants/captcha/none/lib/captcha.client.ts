// Client-side CAPTCHA helpers — no CAPTCHA provider.
// AuthCard.astro imports this generic interface; the honeypot field still applies.

/** No challenge is required, so the form never blocks on a CAPTCHA token. */
export const captchaRequired = false;

/** No provider — there is no token to read. */
export function getCaptchaToken(): string {
  return '';
}

/** No provider — nothing to reset. */
export function resetCaptcha(): void {}
