import React, { useState, useEffect } from 'react';
import {
  Github,
  Key,
  Upload,
  Download,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  LogOut,
  X,
  FileCode,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  GitHubUser,
  GitHubGist,
  getSavedGitHubToken,
  getSavedGitHubUser,
  saveGitHubToken,
  saveGitHubUser,
  clearGitHubAuth,
  fetchCurrentGitHubUser,
  fetchUserGists,
  filterCompendiumGists,
  exportToGist,
  importFromGist,
  importFromRawGitHubUrl,
  getLastSyncGistId,
} from '../utils/githubService.ts';
import { EquipmentItem } from '../utils/gearLogic.ts';
import { playCyberClick, playCyberSelect, playCyberFavorite } from '../utils/audio.ts';
import { useEscapeKey } from '../utils/useEscapeKey.ts';

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentItems: EquipmentItem[];
  onImportItems: (newItems: EquipmentItem[], sourceLabel: string) => void;
  currentUser: GitHubUser | null;
  onUserChange: (user: GitHubUser | null) => void;
}

export const GitHubModal: React.FC<GitHubModalProps> = ({
  isOpen,
  onClose,
  currentItems,
  onImportItems,
  currentUser,
  onUserChange,
}) => {
  useEscapeKey(isOpen, onClose);

  const [tokenInput, setTokenInput] = useState('');
  const [authToken, setAuthToken] = useState<string | null>(getSavedGitHubToken());
  const [activeTab, setActiveTab] = useState<'sync' | 'auth' | 'import'>('sync');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Sync state
  const [gistTitle, setGistTitle] = useState('Cyberpunk RED & SWADE Compendium - Loadout');
  const [gistDescription, setGistDescription] = useState('Sauvegarde Netrunner pour Tech Compendium 2090');
  const [isPublicGist, setIsPublicGist] = useState(false);
  const [lastExportedGist, setLastExportedGist] = useState<GitHubGist | null>(null);
  const [userGists, setUserGists] = useState<GitHubGist[]>([]);
  const [loadingGists, setLoadingGists] = useState(false);

  // Import state
  const [importInput, setImportInput] = useState('');

  // OAuth server state
  const [oauthConfigured, setOauthConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    if (isOpen) {
      const savedToken = getSavedGitHubToken();
      setAuthToken(savedToken);
      if (savedToken && !currentUser) {
        verifyToken(savedToken, false);
      }
      checkOauthStatus();
      if (savedToken) {
        loadUserGists(savedToken);
      }
    }
  }, [isOpen]);

  const checkOauthStatus = async () => {
    try {
      const res = await fetch('/api/auth/github/url');
      if (res.ok) {
        const data = await res.json();
        setOauthConfigured(Boolean(data.configured));
      }
    } catch {
      setOauthConfigured(false);
    }
  };

  const handleOAuthConnect = async () => {
    playCyberClick();
    setLoading(true);
    setStatusMessage({ type: 'info', text: 'Initialisation de l’uplink OAuth GitHub...' });

    try {
      const res = await fetch('/api/auth/github/url');
      if (!res.ok) {
        throw new Error('Erreur lors de la récupération de l’URL OAuth');
      }
      const data = await res.json();

      if (!data.url) {
        throw new Error('URL d’autorisation invalide');
      }

      // Open OAuth provider URL directly in popup
      const width = 600;
      const height = 750;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const authWindow = window.open(
        data.url,
        'github_oauth_popup',
        `width=${width},height=${height},top=${top},left=${left},status=yes,scrollbars=yes`
      );

      if (!authWindow) {
        setStatusMessage({
          type: 'error',
          text: 'Le bloqueur de fenêtres pop-up a intercepté l’ouverture. Autorisez les pop-ups pour continuer.',
        });
        setLoading(false);
        return;
      }

      setStatusMessage({
        type: 'info',
        text: 'Fenêtre d’authentification GitHub ouverte. Veuillez vous identifier dans la fenêtre pop-up.',
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Échec de connexion OAuth. Vous pouvez utiliser un Token PAT à la place.',
      });
      setLoading(false);
    }
  };

  const verifyToken = async (token: string, notify = true) => {
    setLoading(true);
    try {
      const user = await fetchCurrentGitHubUser(token);
      saveGitHubToken(token);
      setAuthToken(token);
      onUserChange(user);
      if (notify) {
        playCyberFavorite();
        setStatusMessage({
          type: 'success',
          text: `Connexion GitHub établie avec succès ! Identifiant Netrunner : @${user.login}`,
        });
      }
      loadUserGists(token);
    } catch (err: any) {
      if (notify) {
        setStatusMessage({
          type: 'error',
          text: err?.message || 'Token invalide ou permissions insuffisantes.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSavePat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    verifyToken(tokenInput.trim(), true);
  };

  const handleDisconnect = () => {
    playCyberClick();
    clearGitHubAuth();
    setAuthToken(null);
    onUserChange(null);
    setUserGists([]);
    setLastExportedGist(null);
    setStatusMessage({
      type: 'info',
      text: 'Session GitHub déconnectée. Uplink désactivé.',
    });
  };

  const loadUserGists = async (token: string) => {
    setLoadingGists(true);
    try {
      const gists = await fetchUserGists(token);
      setUserGists(gists);
    } catch {
      // ignore
    } finally {
      setLoadingGists(false);
    }
  };

  const handleExportToGist = async (useExisting = false) => {
    if (!authToken) {
      setActiveTab('auth');
      setStatusMessage({ type: 'error', text: 'Veuillez d’abord connecter votre compte GitHub.' });
      return;
    }

    playCyberClick();
    setLoading(true);
    setStatusMessage({ type: 'info', text: 'Compilation des données et envoi vers GitHub Gist...' });

    try {
      const existingId = useExisting ? getLastSyncGistId() || undefined : undefined;
      const gist = await exportToGist(authToken, {
        title: gistTitle || 'Netrunner Loadout',
        description: gistDescription,
        isPublic: isPublicGist,
        items: currentItems,
        existingGistId: existingId,
      });

      playCyberFavorite();
      setLastExportedGist(gist);
      setStatusMessage({
        type: 'success',
        text: `Paquetage synchronisé sur GitHub Gist avec succès (${currentItems.length} équipements) !`,
      });
      loadUserGists(authToken);
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Échec de l’export Gist.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImportGistById = async (gistIdOrUrl: string) => {
    playCyberClick();
    setLoading(true);
    setStatusMessage({ type: 'info', text: 'Téléchargement et vérification du Gist...' });

    try {
      const { items, gist, filename } = await importFromGist(gistIdOrUrl, authToken || undefined);
      playCyberFavorite();
      onImportItems(items, `Gist ${gist.id.substring(0, 7)} (${filename})`);
      setStatusMessage({
        type: 'success',
        text: `${items.length} équipements importés avec succès depuis le Gist !`,
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Impossible d’importer depuis ce Gist.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImportManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importInput.trim()) return;

    const input = importInput.trim();
    if (input.includes('raw.githubusercontent.com') || (input.startsWith('http') && input.endsWith('.json'))) {
      setLoading(true);
      setStatusMessage({ type: 'info', text: 'Téléchargement direct depuis GitHub Raw...' });
      try {
        const items = await importFromRawGitHubUrl(input, authToken || undefined);
        playCyberFavorite();
        onImportItems(items, 'GitHub Raw Repository');
        setStatusMessage({
          type: 'success',
          text: `${items.length} équipements importés depuis GitHub !`,
        });
        setImportInput('');
      } catch (err: any) {
        setStatusMessage({
          type: 'error',
          text: err?.message || 'Erreur lors de la lecture du fichier JSON distant.',
        });
      } finally {
        setLoading(false);
      }
    } else {
      await handleImportGistById(input);
      setImportInput('');
    }
  };

  if (!isOpen) return null;

  const compendiumGists = filterCompendiumGists(userGists);
  const otherGists = userGists.filter((g) => !compendiumGists.includes(g));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="GitHub Uplink : synchronisation Gist et import"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#0b0e14] border-2 border-cyan-500/80 rounded-lg shadow-[0_0_35px_rgba(0,240,255,0.25)] overflow-hidden font-mono text-cyan-100">
        {/* Header Terminal */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#05070b] border-b border-cyan-500/40">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded bg-cyan-950/80 border border-cyan-400 text-cyan-300">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-wider text-cyan-300 font-['Orbitron',sans-serif]">
                  GITHUB UPLINK // PROTOCOLE DE SYNCHRONISATION
                </h2>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                  authToken ? 'bg-emerald-950 border border-emerald-500 text-emerald-400' : 'bg-red-950 border border-red-500 text-red-400'
                }`}>
                  {authToken ? 'CONNECTÉ' : 'HORS LIGNE'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Sauvegarde Gist, partage de paquetages Netrunner et importation de répertoires
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playCyberClick();
              onClose();
            }}
            className="p-1.5 rounded text-zinc-400 hover:text-cyan-300 hover:bg-cyan-950/50 transition-colors"
            aria-label="Fermer la fenêtre GitHub"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-cyan-900/60 bg-zinc-950/70 text-xs px-5 pt-2 gap-2">
          <button
            onClick={() => {
              playCyberSelect();
              setActiveTab('sync');
            }}
            className={`px-4 py-2 font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'sync'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-zinc-400 hover:text-cyan-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Synchroniser Gist ({currentItems.length} items)
          </button>

          <button
            onClick={() => {
              playCyberSelect();
              setActiveTab('import');
            }}
            className={`px-4 py-2 font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'import'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-zinc-400 hover:text-cyan-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Importer depuis GitHub
          </button>

          <button
            onClick={() => {
              playCyberSelect();
              setActiveTab('auth');
            }}
            className={`px-4 py-2 font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'auth'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-zinc-400 hover:text-cyan-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            Compte &amp; Accès {currentUser ? `(@${currentUser.login})` : ''}
          </button>
        </div>

        {/* Status / Alert Bar */}
        {statusMessage && (
          <div
            className={`px-5 py-2.5 text-xs flex items-center justify-between border-b ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                : statusMessage.type === 'error'
                ? 'bg-red-950/80 border-red-500/60 text-red-300'
                : 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : statusMessage.type === 'error' ? (
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              ) : (
                <RefreshCw className="w-4 h-4 shrink-0 animate-spin text-cyan-400" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-zinc-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: SYNC TO GIST */}
          {activeTab === 'sync' && (
            <div className="space-y-5">
              {!authToken ? (
                <div className="p-4 bg-amber-950/30 border border-amber-600/50 rounded-lg flex items-start gap-3 text-amber-300">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">Authentification Requise</h4>
                    <p className="mt-1 text-zinc-300">
                      Pour exporter automatiquement votre paquetage sous forme de Gist GitHub (avec fichier JSON et README Markdown formaté), connectez votre compte via OAuth ou Token PAT.
                    </p>
                    <button
                      onClick={() => {
                        playCyberClick();
                        setActiveTab('auth');
                      }}
                      className="mt-3 px-3 py-1.5 bg-amber-500 text-black font-bold rounded hover:bg-amber-400 transition-colors"
                    >
                      Aller à l’écran de connexion
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Current Active User pill */}
                  {currentUser && (
                    <div className="flex items-center justify-between p-3 bg-zinc-900/80 border border-cyan-800/40 rounded">
                      <div className="flex items-center gap-3">
                        <img
                          src={currentUser.avatar_url}
                          alt={currentUser.login}
                          className="w-8 h-8 rounded-full border border-cyan-400"
                        />
                        <div>
                          <span className="font-bold text-cyan-300">@{currentUser.login}</span>
                          <span className="text-zinc-400 ml-2">({currentUser.name || 'Netrunner'})</span>
                          <div className="text-[11px] text-zinc-500">
                            {currentUser.public_gists} gists publics • {currentUser.public_repos} dépôts
                          </div>
                        </div>
                      </div>
                      <a
                        href={currentUser.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-cyan-400 hover:text-cyan-200 underline text-[11px]"
                      >
                        Voir profil GitHub <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {/* Export Form */}
                  <div className="p-4 bg-zinc-950/70 border border-cyan-900/60 rounded-lg space-y-4">
                    <h3 className="font-bold text-cyan-300 flex items-center gap-2 text-sm">
                      <Upload className="w-4 h-4 text-cyan-400" />
                      Exporter le Matériel Actuel vers un GitHub Gist
                    </h3>

                    <div>
                      <label className="block text-zinc-400 mb-1">Titre du Gist / Paquetage :</label>
                      <input
                        type="text"
                        value={gistTitle}
                        onChange={(e) => setGistTitle(e.target.value)}
                        className="w-full bg-zinc-900 border border-cyan-800/60 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400"
                        placeholder="Ex: Loadout Netrunner Solo v2"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1">Description (optionnelle) :</label>
                      <input
                        type="text"
                        value={gistDescription}
                        onChange={(e) => setGistDescription(e.target.value)}
                        className="w-full bg-zinc-900 border border-cyan-800/60 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400"
                        placeholder="Description du paquetage ou contexte de la mission..."
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isPublicGist"
                        checked={isPublicGist}
                        onChange={(e) => setIsPublicGist(e.target.checked)}
                        className="rounded bg-zinc-900 border-cyan-700 text-cyan-500 focus:ring-0 w-4 h-4"
                      />
                      <label htmlFor="isPublicGist" className="text-zinc-300 cursor-pointer">
                        Gist Public (décocher pour un Gist Secret/Privé, accessible uniquement par lien)
                      </label>
                    </div>

                    <div className="pt-2 flex flex-wrap gap-3">
                      <button
                        onClick={() => handleExportToGist(false)}
                        disabled={loading}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold rounded hover:from-cyan-400 hover:to-blue-500 flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)] disabled:opacity-50"
                      >
                        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        Sauvegarder dans un Nouveau Gist ({currentItems.length} items)
                      </button>

                      {getLastSyncGistId() && (
                        <button
                          onClick={() => handleExportToGist(true)}
                          disabled={loading}
                          className="px-4 py-2 bg-zinc-900 border border-cyan-600 text-cyan-300 font-bold rounded hover:bg-cyan-950/60 flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Mettre à jour le dernier Gist ({getLastSyncGistId()?.substring(0, 7)})
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Last exported gist alert */}
                  {lastExportedGist && (
                    <div className="p-4 bg-emerald-950/40 border border-emerald-500/70 rounded-lg flex items-center justify-between">
                      <div>
                        <div className="text-emerald-400 font-bold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> Gist GitHub Enregistré
                        </div>
                        <div className="text-zinc-300 text-[11px] mt-1">
                          ID: {lastExportedGist.id} • Fichiers: <code className="text-cyan-300">tech-compendium-loadout.json</code> et <code className="text-cyan-300">README.md</code>
                        </div>
                      </div>
                      <a
                        href={lastExportedGist.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-emerald-600 text-black font-bold rounded hover:bg-emerald-500 flex items-center gap-1.5 transition-colors"
                      >
                        Consulter sur GitHub <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                  {/* Existing compendium gists list */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-cyan-300 flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-cyan-400" />
                        Vos Gists de Matériel Compendium ({compendiumGists.length})
                      </h4>
                      <button
                        onClick={() => authToken && loadUserGists(authToken)}
                        disabled={loadingGists}
                        className="text-zinc-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
                      >
                        <RefreshCw className={`w-3 h-3 ${loadingGists ? 'animate-spin' : ''}`} /> Rafraîchir
                      </button>
                    </div>

                    {loadingGists ? (
                      <div className="text-zinc-500 text-center py-4">Chargement des Gists GitHub...</div>
                    ) : compendiumGists.length === 0 ? (
                      <div className="p-4 bg-zinc-950 border border-zinc-800 rounded text-center text-zinc-500">
                        Aucun Gist de matériel détecté pour l’instant. Cliquez sur le bouton d’export ci-dessus pour créer votre première sauvegarde !
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {compendiumGists.map((g) => (
                          <div
                            key={g.id}
                            className="p-3 bg-zinc-950 border border-zinc-800 hover:border-cyan-700/60 rounded flex items-center justify-between gap-3 transition-colors"
                          >
                            <div className="overflow-hidden">
                              <div className="font-bold text-cyan-300 truncate">
                                {g.description || 'Gist sans description'}
                              </div>
                              <div className="text-[11px] text-zinc-500">
                                {new Date(g.updated_at).toLocaleDateString('fr-FR')} • {Object.keys(g.files).join(', ')}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => handleImportGistById(g.id)}
                                disabled={loading}
                                className="px-2.5 py-1 bg-cyan-950 border border-cyan-500/60 text-cyan-300 hover:bg-cyan-900 rounded font-bold text-[11px] flex items-center gap-1"
                              >
                                <Download className="w-3 h-3" /> Charger
                              </button>
                              <a
                                href={g.html_url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 text-zinc-400 hover:text-cyan-300"
                                title="Ouvrir dans GitHub"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: IMPORT FROM GIST / REPOSITORY */}
          {activeTab === 'import' && (
            <div className="space-y-5">
              <div className="p-4 bg-zinc-950/70 border border-cyan-900/60 rounded-lg space-y-4">
                <h3 className="font-bold text-cyan-300 flex items-center gap-2 text-sm">
                  <Download className="w-4 h-4 text-cyan-400" />
                  Importer du Matériel depuis n’importe quel Gist ou URL GitHub
                </h3>
                <p className="text-zinc-400">
                  Collez un identifiant Gist (ex: <code className="text-cyan-300">d3b07384...</code>), une URL de Gist publique, ou une URL brute de dépôt GitHub (ex: <code className="text-cyan-300">https://raw.githubusercontent.com/.../equipment.json</code>).
                </p>

                <form onSubmit={handleImportManual} className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={importInput}
                      onChange={(e) => setImportInput(e.target.value)}
                      placeholder="https://gist.github.com/... ou identifiant de Gist ou URL raw.githubusercontent.com"
                      className="flex-1 bg-zinc-900 border border-cyan-800/60 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="submit"
                      disabled={loading || !importInput.trim()}
                      className="px-4 py-2 bg-cyan-500 text-black font-bold rounded hover:bg-cyan-400 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                    >
                      {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      Importer
                    </button>
                  </div>
                </form>
              </div>

              {/* Other gists if user is connected */}
              {authToken && otherGists.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-zinc-400 text-xs">
                    Autres Gists de votre compte ({otherGists.length})
                  </h4>
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {otherGists.slice(0, 10).map((g) => (
                      <div
                        key={g.id}
                        className="p-2.5 bg-zinc-950 border border-zinc-800 rounded flex items-center justify-between text-xs"
                      >
                        <span className="truncate max-w-sm text-zinc-300">{g.description || g.id}</span>
                        <button
                          onClick={() => handleImportGistById(g.id)}
                          disabled={loading}
                          className="px-2 py-0.5 bg-zinc-800 hover:bg-cyan-900 text-cyan-300 border border-zinc-700 rounded text-[11px]"
                        >
                          Tester l’import
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AUTHENTICATION / TOKEN / OAUTH */}
          {activeTab === 'auth' && (
            <div className="space-y-6">
              {/* If already connected */}
              {authToken && currentUser ? (
                <div className="p-5 bg-zinc-950/90 border border-emerald-500/60 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={currentUser.avatar_url}
                        alt={currentUser.login}
                        className="w-12 h-12 rounded-full border-2 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-emerald-300 text-sm">@{currentUser.login}</h3>
                          <span className="px-1.5 py-0.5 bg-emerald-950 border border-emerald-500/50 text-emerald-400 text-[10px] rounded font-mono">
                            SESSION ACTIVE
                          </span>
                        </div>
                        <p className="text-zinc-400 text-xs mt-0.5">{currentUser.bio || currentUser.name || 'Netrunner connecté'}</p>
                      </div>
                    </div>

                    <button
                      onClick={handleDisconnect}
                      className="px-3 py-1.5 bg-red-950 border border-red-500 text-red-300 hover:bg-red-900 rounded font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Déconnecter
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-center text-xs">
                    <div className="p-2 bg-zinc-900 border border-zinc-800 rounded">
                      <div className="text-zinc-500 text-[10px]">GISTS PUBLICS</div>
                      <div className="text-base font-bold text-cyan-400">{currentUser.public_gists}</div>
                    </div>
                    <div className="p-2 bg-zinc-900 border border-zinc-800 rounded">
                      <div className="text-zinc-500 text-[10px]">DÉPÔTS PUBLICS</div>
                      <div className="text-base font-bold text-cyan-400">{currentUser.public_repos}</div>
                    </div>
                    <div className="p-2 bg-zinc-900 border border-zinc-800 rounded col-span-2 sm:col-span-1">
                      <div className="text-zinc-500 text-[10px]">ID GITHUB</div>
                      <div className="text-base font-bold text-zinc-300">#{currentUser.id}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Method 1: OAuth 1-Click Popup */}
                  <div className="p-5 bg-zinc-950/90 border border-cyan-800/60 rounded-lg flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        Option 1 : Connexion 1-Click (OAuth)
                      </div>
                      <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                        Authentification via la fenêtre de connexion officielle GitHub. Ouvre la page d’autorisation GitHub directement dans un pop-up sécurisé.
                      </p>

                      {typeof window !== 'undefined' && window.location.hostname.endsWith('github.io') ? (
                        <div className="mt-3 p-2 bg-cyan-950/40 border border-cyan-500/50 rounded text-[11px] text-cyan-300">
                          🌐 <strong>Environnement GitHub Pages actif</strong> : Sur GitHub Pages (hébergement statique), utilisez l’<strong>Option 2 (Token PAT)</strong> ci-contre. Elle fonctionne à 100% directement depuis votre navigateur pour sauvegarder et charger vos Gists.
                        </div>
                      ) : oauthConfigured === false ? (
                        <div className="mt-3 p-2 bg-zinc-900 border border-zinc-700 rounded text-[11px] text-zinc-400">
                          ℹ️ Si vous n’avez pas configuré les variables d’environnement OAuth (<code className="text-cyan-300">GITHUB_CLIENT_ID</code>), utilisez simplement l’Option 2 (Token Personnel) à droite : elle fonctionne instantanément sans aucune configuration serveur !
                        </div>
                      ) : null}
                    </div>

                    <button
                      onClick={handleOAuthConnect}
                      disabled={loading}
                      className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold rounded hover:from-cyan-400 hover:to-blue-500 flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)] disabled:opacity-50"
                    >
                      <Github className="w-4 h-4" />
                      {loading ? 'Connexion en cours...' : 'Se connecter avec GitHub (OAuth)'}
                    </button>
                  </div>

                  {/* Method 2: Personal Access Token (PAT) - 100% works without server OAuth configuration */}
                  <div className="p-5 bg-zinc-950/90 border border-cyan-800/60 rounded-lg space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                        <Key className="w-4 h-4 text-cyan-400" />
                        Option 2 : Token Personnel (PAT)
                      </div>
                      <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                        Fonctionne immédiatement sans créer d’application OAuth sur GitHub. Générez un token GitHub classique ou fine-grained avec la permission <code className="text-cyan-300">gist</code>.
                      </p>
                    </div>

                    <form onSubmit={handleSavePat} className="space-y-3">
                      <div>
                        <input
                          type="password"
                          value={tokenInput}
                          onChange={(e) => setTokenInput(e.target.value)}
                          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                          className="w-full bg-zinc-900 border border-cyan-800/60 rounded px-3 py-2 text-cyan-100 text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <a
                          href="https://github.com/settings/tokens/new?scopes=gist,read:user&description=Tech+Compendium+Cyberpunk"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          Créer un token sur GitHub <ExternalLink className="w-3 h-3" />
                        </a>
                        <button
                          type="submit"
                          disabled={loading || !tokenInput.trim()}
                          className="px-3 py-1.5 bg-cyan-500 text-black font-bold rounded hover:bg-cyan-400 text-xs disabled:opacity-50 transition-colors"
                        >
                          Activer l’Uplink
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Instructions and callback info */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded text-[11px] space-y-2 text-zinc-400">
                <div className="font-bold text-zinc-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" /> Configuration OAuth GitHub pour les développeurs
                </div>
                <p>
                  Si vous préférez enregistrer une application OAuth officielle dans les <a href="https://github.com/settings/developers" target="_blank" rel="noreferrer" className="text-cyan-400 underline">Paramètres Développeur GitHub</a>, utilisez l’URL de rappel suivante :
                </p>
                <div className="p-2 bg-zinc-950 border border-zinc-700 rounded font-mono text-cyan-300 select-all break-all">
                  https://ais-dev-mvckpvegv2cejjwzxcfqdw-512189669415.europe-west3.run.app/auth/github/callback
                </div>
                <p className="text-zinc-500">
                  Et pour l'URL partagée : <code className="text-zinc-400">https://ais-pre-mvckpvegv2cejjwzxcfqdw-512189669415.europe-west3.run.app/auth/github/callback</code>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-5 py-3 bg-[#05070b] border-t border-cyan-900/40 flex items-center justify-between text-[11px] text-zinc-500">
          <span>Tech Compendium v2.0 // GitHub Uplink Protocol</span>
          <button
            onClick={() => {
              playCyberClick();
              onClose();
            }}
            className="px-3 py-1 bg-zinc-900 border border-zinc-700 hover:border-cyan-500 text-zinc-300 hover:text-cyan-300 rounded font-bold transition-colors"
          >
            Fermer le Terminal
          </button>
        </div>
      </div>
    </div>
  );
};
