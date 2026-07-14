// Client-side CAPTCHA helpers — Cloudflare Turnstile.
// AuthCard.astro imports this generic interface; swapping providers swaps this file.

/** Whether the user must solve a challenge before the form will submit. */
export const captchaRequired = true;

/** Read the current CAPTCHA token from the token field Turnstile injects into the form. */
export function getCaptchaToken(): string {
  const field = document.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]');
  return field?.value ?? '';
}

/** Reset the widget so a fresh challenge is required (e.g. after a failed submit). */
export function resetCaptcha(): void {
  const turnstile = (window as any).turnstile;
  if (turnstile && typeof turnstile.reset === 'function') {
    turnstile.reset();
  }
}
