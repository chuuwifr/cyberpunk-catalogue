import { EquipmentItem } from './gearLogic.ts';

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
}

export interface GitHubGistFile {
  filename: string;
  type?: string;
  language?: string;
  raw_url: string;
  size: number;
  content?: string;
}

export interface GitHubGist {
  id: string;
  description: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  public: boolean;
  files: Record<string, GitHubGistFile>;
}

export interface GistSyncResult {
  success: boolean;
  gist?: GitHubGist;
  error?: string;
}

const STORAGE_TOKEN_KEY = 'tech_compendium_github_token';
const STORAGE_USER_KEY = 'tech_compendium_github_user';
const STORAGE_LAST_GIST_KEY = 'tech_compendium_last_gist_id';

/**
 * Retrieve saved GitHub access token from localStorage
 */
export function getSavedGitHubToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_TOKEN_KEY);
  } catch {
    return null;
  }
}

/**
 * Save GitHub access token
 */
export function saveGitHubToken(token: string): void {
  try {
    localStorage.setItem(STORAGE_TOKEN_KEY, token.trim());
  } catch {
    // ignore
  }
}

/**
 * Remove GitHub credentials
 */
export function clearGitHubAuth(): void {
  try {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    localStorage.removeItem(STORAGE_LAST_GIST_KEY);
  } catch {
    // ignore
  }
}

/**
 * Get saved GitHub user
 */
export function getSavedGitHubUser(): GitHubUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Save GitHub user profile
 */
export function saveGitHubUser(user: GitHubUser): void {
  try {
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
}

/**
 * Get last synchronized Gist ID
 */
export function getLastSyncGistId(): string | null {
  try {
    return localStorage.getItem(STORAGE_LAST_GIST_KEY);
  } catch {
    return null;
  }
}

export function saveLastSyncGistId(gistId: string): void {
  try {
    localStorage.setItem(STORAGE_LAST_GIST_KEY, gistId);
  } catch {
    // ignore
  }
}

/**
 * Fetch with optional GitHub authentication
 */
async function fetchGitHubApi(endpoint: string, token?: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/vnd.github.v3+json');
  if (token) {
    headers.set('Authorization', `Bearer ${token.trim()}`);
  }

  // Try direct fetch or fallback to server proxy if CORS triggers
  const url = endpoint.startsWith('http') ? endpoint : `https://api.github.com${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  try {
    const res = await fetch(url, { ...options, headers });
    return res;
  } catch (err: any) {
    // Only attempt local server proxy if not on a pure static host like github.io
    const isStaticHost = typeof window !== 'undefined' && (
      window.location.hostname.endsWith('github.io') ||
      window.location.hostname.endsWith('pages.dev') ||
      window.location.protocol === 'file:'
    );
    if (!isStaticHost) {
      try {
        const proxyUrl = `/api/github/proxy?url=${encodeURIComponent(url)}`;
        return await fetch(proxyUrl, { ...options, headers });
      } catch {
        // Fall through
      }
    }
    throw new Error(`Erreur réseau GitHub : ${err?.message || 'Connexion impossible'}`);
  }
}

/**
 * Validate token and fetch current user profile
 */
export async function fetchCurrentGitHubUser(token: string): Promise<GitHubUser> {
  const res = await fetchGitHubApi('/user', token);
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Échec d'authentification GitHub (${res.status}): ${errBody || 'Token invalide ou expiré'}`);
  }
  const user = (await res.json()) as GitHubUser;
  saveGitHubUser(user);
  return user;
}

/**
 * List user's gists
 */
export async function fetchUserGists(token: string): Promise<GitHubGist[]> {
  const res = await fetchGitHubApi('/gists?per_page=50', token);
  if (!res.ok) {
    throw new Error(`Impossible de récupérer les Gists (${res.status})`);
  }
  const gists = (await res.json()) as GitHubGist[];
  // Sort with loadout gists first
  return gists;
}

/**
 * Filter gists that contain Tech Compendium loadouts
 */
export function filterCompendiumGists(gists: GitHubGist[]): GitHubGist[] {
  return gists.filter((g) => {
    const desc = (g.description || '').toLowerCase();
    const filenames = Object.keys(g.files || {}).map((f) => f.toLowerCase());
    return (
      desc.includes('cyberpunk') ||
      desc.includes('compendium') ||
      desc.includes('loadout') ||
      filenames.some((f) => f.includes('loadout') || f.includes('compendium') || f.includes('cyberpunk'))
    );
  });
}

/**
 * Export loadout / equipment to a GitHub Gist
 */
export async function exportToGist(
  token: string,
  options: {
    title: string;
    description?: string;
    isPublic: boolean;
    items: EquipmentItem[];
    existingGistId?: string;
  }
): Promise<GitHubGist> {
  const { title, description, isPublic, items, existingGistId } = options;

  const jsonContent = JSON.stringify(
    {
      compendiumVersion: '2.0',
      system: 'Cyberpunk RED & Interface Zéro 2.0 (SWADE)',
      exportedAt: new Date().toISOString(),
      itemCount: items.length,
      title: title || 'Netrunner Loadout',
      items,
    },
    null,
    2
  );

  // Generate a formatted Markdown preview for GitHub Gist viewing
  const mdContent = `# ⚡ TECH COMPENDIUM // ${title}
> **Sauvegarde Cyberpunk RED & Savage Worlds Interface Zéro 2.0**
> Générée le ${new Date().toLocaleDateString('fr-FR')} - ${items.length} équipement(s)

## 📋 Inventaire du Paquetage

| Nom | Catégorie | Rareté | Prix RED (€$) | Prix IZ (c$) | Poids |
| :--- | :--- | :--- | :---: | :---: | :---: |
${items
  .slice(0, 100)
  .map(
    (i) =>
      `| **${i.name}** | ${i.categoryLabel} | ${i.rarityLabel} | ${i.red.priceEb.toLocaleString('fr-FR')} €$ | ${i.iz.priceCredits.toLocaleString('fr-FR')} c$ | ${i.iz.weightKg} kg |`
  )
  .join('\n')}

---
*Synchronisé avec Tech Compendium - Night City & Malmart 2090 Uplink.*
`;

  const files: Record<string, { content: string }> = {
    'tech-compendium-loadout.json': { content: jsonContent },
    'README.md': { content: mdContent },
  };

  const gistPayload = {
    description: description || `Tech Compendium Backup: ${title} (${items.length} matériels)`,
    public: isPublic,
    files,
  };

  let endpoint = '/gists';
  let method = 'POST';

  if (existingGistId) {
    endpoint = `/gists/${existingGistId}`;
    method = 'PATCH';
  }

  const res = await fetchGitHubApi(endpoint, token, {
    method,
    body: JSON.stringify(gistPayload),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Erreur lors de la création/mise à jour du Gist (${res.status}): ${errText}`);
  }

  const createdGist = (await res.json()) as GitHubGist;
  saveLastSyncGistId(createdGist.id);
  return createdGist;
}

/**
 * Import equipment from a Gist ID or Gist URL
 */
export async function importFromGist(
  gistIdOrUrl: string,
  token?: string
): Promise<{ items: EquipmentItem[]; gist: GitHubGist; filename: string }> {
  // Extract ID if a full URL was provided
  let gistId = gistIdOrUrl.trim();
  const match = gistId.match(/gist\.github\.com\/([^/]+\/)?([a-f0-9]+)/i);
  if (match && match[2]) {
    gistId = match[2];
  }

  const res = await fetchGitHubApi(`/gists/${gistId}`, token);
  if (!res.ok) {
    throw new Error(`Gist introuvable ou inaccessible (${res.status}). Vérifiez l'identifiant.`);
  }

  const gist = (await res.json()) as GitHubGist;
  if (!gist.files || Object.keys(gist.files).length === 0) {
    throw new Error('Ce Gist ne contient aucun fichier.');
  }

  // Look for compendium json file, or any .json file
  let targetFile: GitHubGistFile | undefined;
  for (const [name, file] of Object.entries(gist.files)) {
    if (name.toLowerCase() === 'tech-compendium-loadout.json' || name.toLowerCase().includes('compendium')) {
      targetFile = file;
      break;
    }
  }

  if (!targetFile) {
    for (const [name, file] of Object.entries(gist.files)) {
      if (name.toLowerCase().endsWith('.json')) {
        targetFile = file;
        break;
      }
    }
  }

  if (!targetFile) {
    throw new Error('Aucun fichier .json contenant des équipements n’a été détecté dans ce Gist.');
  }

  let content = targetFile.content;
  if (!content && targetFile.raw_url) {
    const rawRes = await fetch(targetFile.raw_url);
    if (!rawRes.ok) {
      throw new Error(`Impossible de télécharger le contenu brut du fichier (${rawRes.status})`);
    }
    content = await rawRes.text();
  }

  if (!content) {
    throw new Error('Le contenu du fichier est vide.');
  }

  const parsed = JSON.parse(content);
  let items: EquipmentItem[] = [];

  if (Array.isArray(parsed)) {
    items = parsed;
  } else if (parsed.items && Array.isArray(parsed.items)) {
    items = parsed.items;
  } else {
    throw new Error('Le format du JSON importé ne contient pas de liste d’équipements valide.');
  }

  saveLastSyncGistId(gist.id);
  return { items, gist, filename: targetFile.filename };
}

/**
 * Import directly from raw GitHub URL
 */
export async function importFromRawGitHubUrl(url: string, token?: string): Promise<EquipmentItem[]> {
  const headers = new Headers();
  if (token) {
    headers.set('Authorization', `Bearer ${token.trim()}`);
  }
  const res = await fetch(url.trim(), { headers });
  if (!res.ok) {
    throw new Error(`Erreur de téléchargement GitHub (${res.status})`);
  }
  const parsed = await res.json();
  if (Array.isArray(parsed)) {
    return parsed;
  } else if (parsed.items && Array.isArray(parsed.items)) {
    return parsed.items;
  }
  throw new Error('Format de fichier JSON non reconnu.');
}
