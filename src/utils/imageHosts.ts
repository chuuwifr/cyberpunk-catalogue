/**
 * Domaines dont les images (Cyberpunk Wiki / Fandom) peuvent passer par le proxy d'images.
 * Sert à la fois côté client (getSafeImageUrl) et côté serveur (/api/proxy-image),
 * pour que le proxy ne puisse pas être détourné vers une URL arbitraire (SSRF).
 */
const PROXYABLE_DOMAINS = ['wikia.nocookie.net', 'fandom.com'];

export function isProxyableImageUrl(raw: string | undefined): boolean {
  if (!raw) return false;
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:') return false;
    const host = url.hostname.toLowerCase();
    return PROXYABLE_DOMAINS.some((domain) => host === domain || host.endsWith(`.${domain}`));
  } catch {
    return false;
  }
}

/** Échappe une chaîne avant de l'insérer dans du HTML renvoyé par le serveur. */
export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** JSON.stringify sûr à injecter dans un bloc <script> (neutralise `</script>` et `<!--`). */
export function jsonForInlineScript(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
