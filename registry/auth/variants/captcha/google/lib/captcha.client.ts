// Client-side CAPTCHA helpers — Google reCAPTCHA v2 (checkbox).
// AuthCard.astro imports this generic interface; swapping providers swaps this file.

/** Whether the user must solve a challenge before the form will submit. */
export const captchaRequired = true;

/** Read the current CAPTCHA token from the token field reCAPTCHA injects into the form. */
export function getCaptchaToken(): string {
  const field = document.querySelector<HTMLTextAreaElement>('[name="g-recaptcha-response"]');
  return field?.value ?? '';
}

/** Reset the widget so a fresh challenge is required (e.g. after a failed submit). */
export function resetCaptcha(): void {
  const grecaptcha = (window as any).grecaptcha;
  if (grecaptcha && typeof grecaptcha.reset === 'function') {
    grecaptcha.reset();
  }
}
