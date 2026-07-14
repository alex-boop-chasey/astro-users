/**
 * Server-side CAPTCHA verification — no CAPTCHA provider.
 * The auth actions call this generic `verifyCaptcha`; with no provider configured
 * it is a no-op that always passes. The honeypot field in AuthCard.astro still
 * blocks basic bots. Add a provider later by re-running the installer with
 * `--captcha cloudflare` or `--captcha google`.
 */
export async function verifyCaptcha(_token: string | undefined, _remoteIp: string | null): Promise<void> {
  // Intentionally empty: no CAPTCHA configured.
}
