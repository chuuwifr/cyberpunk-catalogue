import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  EquipmentItem,
  GearCategory,
  GearRarity,
  FilterOptions,
  filterEquipment,
  sortEquipment,
  mergeEquipmentList,
  deduplicateAndMergeEquipment,
} from './utils/gearLogic.ts';
import { EQUIPMENT_DATABASE } from './data/equipmentData.ts';
import { CyberHeader } from './components/CyberHeader.tsx';
import { CategoryFilters } from './components/CategoryFilters.tsx';
import { RarityFilterBar } from './components/RarityFilterBar.tsx';
import { EquipmentCard } from './components/EquipmentCard.tsx';
import { EquipmentDetailModal } from './components/EquipmentDetailModal.tsx';
import { FavoritesDrawer } from './components/FavoritesDrawer.tsx';
import { CompareModal } from './components/CompareModal.tsx';
import { DiceRollerModal } from './components/DiceRollerModal.tsx';
import { RulesGuideModal } from './components/RulesGuideModal.tsx';
import { AddEquipmentModal } from './components/AddEquipmentModal.tsx';
import { GitHubModal } from './components/GitHubModal.tsx';
import { toggleAudio, isAudioEnabled, playCyberClick } from './utils/audio.ts';
import {
  GitHubUser,
  getSavedGitHubUser,
  saveGitHubUser,
  saveGitHubToken,
} from './utils/githubService.ts';
import {
  HelpCircle,
  Dices,
  Layers,
  Star,
  Search,
  RotateCcw,
  ShieldAlert,
  Terminal,
  Cpu,
  Sparkles,
  Download,
  Upload,
  PlusCircle,
  CheckCircle2,
  Database,
  GitMerge,
  Github
} from 'lucide-react';

const STORAGE_FAVORITES_KEY = 'tech_compendium_favs';
const STORAGE_SOUND_KEY = 'tech_compendium_sound';
const STORAGE_CRT_KEY = 'tech_compendium_crt';
const STORAGE_CUSTOM_KEY = 'tech_compendium_custom_items';

export default function App() {
  // Filters state
  const [filters, setFilters] = useState<FilterOptions>({
    query: '',
    category: 'all',
    rarity: 'all',
    manufacturer: 'all',
    onlyFavorites: false,
  });

  const [sortBy, setSortBy] = useState<
    'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'rarity-desc' | 'weight-desc'
  >('rarity-desc');

  const [ruleSystem, setRuleSystem] = useState<'both' | 'red' | 'iz'>('both');

  // Favorites state with localStorage
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FAVORITES_KEY) || localStorage.getItem('netrunner_compendium_favs');
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
    // Default starter favorites for player
    return new Set(['malorian-3516', 'sandevistan-dynalar', 'rs-bulwark-riot']);
  });

  // Custom equipment created by player
  const [customItems, setCustomItems] = useState<EquipmentItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_KEY) || localStorage.getItem('netrunner_compendium_custom_items');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Save custom items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CUSTOM_KEY, JSON.stringify(customItems));
    } catch {
      // ignore
    }
  }, [customItems]);

  // Combined equipment database
  const allEquipment = useMemo(() => {
    return mergeEquipmentList(EQUIPMENT_DATABASE, customItems);
  }, [customItems]);

  // Comparison state (up to 2 items)
  const [comparedItemIds, setComparedItemIds] = useState<string[]>([]);

  // Modals state
  const [selectedDetailItem, setSelectedDetailItem] = useState<EquipmentItem | null>(null);
  const [isFavoritesDrawerOpen, setIsFavoritesDrawerOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isDiceRollerOpen, setIsDiceRollerOpen] = useState(false);
  const [dicePresetItem, setDicePresetItem] = useState<EquipmentItem | null>(null);
  const [isRulesGuideOpen, setIsRulesGuideOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<EquipmentItem | null>(null);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [githubUser, setGithubUser] = useState<GitHubUser | null>(() => getSavedGitHubUser());

  // Notification feedback
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const notificationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Annule le minuteur précédent pour qu'un toast récent ne soit pas masqué par l'ancien
  const showNotification = (msg: string) => {
    setFeedbackMessage(msg);
    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current);
    }
    notificationTimerRef.current = setTimeout(() => {
      setFeedbackMessage(null);
      notificationTimerRef.current = null;
    }, 4500);
  };

  useEffect(() => {
    return () => {
      if (notificationTimerRef.current) {
        clearTimeout(notificationTimerRef.current);
      }
    };
  }, []);

  // OAuth postMessage listener for GitHub Uplink popup
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      const origin = event.origin;
      // Allow localhost and Cloud Run preview domains
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' || event.data?.type === 'GITHUB_AUTH_SUCCESS') {
        if (event.data.token) {
          saveGitHubToken(event.data.token);
        }
        if (event.data.user) {
          saveGitHubUser(event.data.user);
          setGithubUser(event.data.user);
        }
        showNotification(`Uplink GitHub validé : @${event.data.user?.login || 'Netrunner'}`);
      }
    };
    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, []);

  const handleImportFromGitHub = (newItems: EquipmentItem[], sourceLabel: string) => {
    if (!newItems || newItems.length === 0) return;
    setCustomItems((prev) => {
      return mergeEquipmentList(prev, newItems);
    });
    showNotification(`${newItems.length} matériels synchronisés depuis ${sourceLabel}`);
  };

  // Settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_SOUND_KEY) === 'true';
  });

  const [scanlinesEnabled, setScanlinesEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_CRT_KEY);
    return saved === null ? true : saved === 'true';
  });

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(Array.from(favoriteIds)));
    } catch {
      // ignore
    }
  }, [favoriteIds]);

  // Save sound setting
  useEffect(() => {
    toggleAudio(soundEnabled);
    localStorage.setItem(STORAGE_SOUND_KEY, String(soundEnabled));
  }, [soundEnabled]);

  // Save CRT setting
  useEffect(() => {
    localStorage.setItem(STORAGE_CRT_KEY, String(scanlinesEnabled));
  }, [scanlinesEnabled]);

  // Global keyboard shortcut ('/' to focus search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;

      // Ne pas voler la frappe d'un champ de saisie (INPUT, TEXTAREA, SELECT, contentEditable)
      const active = document.activeElement as HTMLElement | null;
      const tag = active?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || active?.isContentEditable) return;

      // Ne pas déplacer le focus derrière un modal ouvert
      if (document.querySelector('[role="dialog"]')) return;

      const searchInput = document.querySelector<HTMLInputElement>('input[data-search-input]');
      if (searchInput) {
        e.preventDefault();
        searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Unique manufacturers list
  const manufacturers = useMemo(() => {
    const set = new Set<string>();
    allEquipment.forEach((item) => set.add(item.manufacturer));
    return Array.from(set).sort();
  }, [allEquipment]);

  // Filtered and sorted equipment
  const filteredEquipment = useMemo(() => {
    const filtered = filterEquipment(allEquipment, filters, favoriteIds);
    return sortEquipment(filtered, sortBy);
  }, [allEquipment, filters, favoriteIds, sortBy]);

  // Favorite items objects
  const favoriteItems = useMemo(() => {
    return allEquipment.filter((item) => favoriteIds.has(item.id));
  }, [allEquipment, favoriteIds]);

  // Compared items objects
  const comparedItems = useMemo(() => {
    return allEquipment.filter((item) => comparedItemIds.includes(item.id));
  }, [allEquipment, comparedItemIds]);

  // Custom equipment CRUD handlers
  const handleSaveEquipment = (item: EquipmentItem) => {
    setCustomItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.id === item.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = { ...item, isCustom: true };
        return updated;
      }
      return [{ ...item, isCustom: true }, ...prev];
    });
    if (selectedDetailItem?.id === item.id) {
      setSelectedDetailItem({ ...item, isCustom: true });
    }
    showNotification(`Équipement "${item.name}" sauvegardé avec succès dans votre base locale.`);
  };

  const handleDeleteEquipment = (id: string) => {
    const toDelete = allEquipment.find((i) => i.id === id);
    setCustomItems((prev) => prev.filter((i) => i.id !== id));
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setComparedItemIds((prev) => prev.filter((i) => i !== id));
    if (selectedDetailItem?.id === id) {
      setSelectedDetailItem(null);
    }
    showNotification(`Équipement "${toDelete?.name || id}" supprimé de votre base.`);
  };

  const handleEditEquipment = (item: EquipmentItem) => {
    setEditingEquipment(item);
    setIsAddModalOpen(true);
  };

  const handleDuplicateEquipment = (item: EquipmentItem) => {
    const duplicated: EquipmentItem = {
      ...item,
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: `${item.name} (Modifié)`,
      isCustom: true,
      manufacturer: `${item.manufacturer} Custom`,
    };
    setEditingEquipment(duplicated);
    setIsAddModalOpen(true);
  };

  const handleExportCustomGear = () => {
    try {
      const exportData = {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        totalItems: customItems.length,
        items: customItems,
      };
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `tech_compendium_materiel_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showNotification(`Exportation réussie de ${customItems.length} équipement(s) personnalisé(s).`);
    } catch {
      showNotification("Erreur lors de l'exportation du fichier JSON.");
    }
  };

  const handleImportCustomGear = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const importedItems: EquipmentItem[] = Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed?.items)
          ? parsed.items
          : [];
        if (importedItems.length === 0) {
          showNotification('Aucun équipement valide trouvé dans le fichier JSON.');
          return;
        }
        setCustomItems((prev) => {
          const map = new Map<string, EquipmentItem>();
          prev.forEach((i) => map.set(i.id, i));
          importedItems.forEach((i) => {
            if (i && i.name) {
              const itemWithFlag = { ...i, isCustom: true };
              map.set(itemWithFlag.id || `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, itemWithFlag);
            }
          });
          return Array.from(map.values());
        });
        showNotification(`${importedItems.length} équipement(s) importé(s) et sauvegardé(s) dans votre catalogue !`);
      } catch {
        showNotification('Fichier JSON corrompu ou format incompatible.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleMergeDuplicates = () => {
    playCyberClick();
    // `allEquipment` est déjà dédoublonné à l'affichage : l'analyser ne trouvera jamais rien.
    // Les doublons à nettoyer sont ceux stockés dans les créations personnalisées.
    const result = deduplicateAndMergeEquipment(customItems);
    if (result.mergedCount > 0) {
      setCustomItems(result.deduplicated);
      showNotification(`Fusion effectuée : ${result.mergedCount} doublon(s) résolu(s) et fusionné(s) avec succès !`);
    } else {
      showNotification(`Scan anti-doublon complet : 0 doublon détecté. Les ${allEquipment.length} matériels du compendium sont tous uniques.`);
    }
  };

  // Handlers
  const handleToggleFavorite = (id: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleClearFavorites = () => {
    setFavoriteIds(new Set());
  };

  const handleToggleCompare = (item: EquipmentItem) => {
    setComparedItemIds((prev) => {
      if (prev.includes(item.id)) {
        return prev.filter((id) => id !== item.id);
      }
      if (prev.length >= 2) {
        // replace second item
        return [prev[0], item.id];
      }
      return [...prev, item.id];
    });
  };

  const handleRemoveFromCompare = (id: string) => {
    setComparedItemIds((prev) => prev.filter((item) => item !== id));
  };

  const handleOpenDiceWithPreset = (item: EquipmentItem) => {
    setDicePresetItem(item);
    setIsDiceRollerOpen(true);
  };

  const handleResetFilters = () => {
    setFilters({
      query: '',
      category: 'all',
      rarity: 'all',
      manufacturer: 'all',
      onlyFavorites: false,
    });
  };

  return (
    <div className="min-h-screen bg-[#06080e] text-zinc-100 cyber-grid-bg relative flex flex-col font-mono selection:bg-cyan-500 selection:text-black">
      {/* Optional CRT Scanlines */}
      {scanlinesEnabled && <div className="scanlines-overlay" />}

      {/* Notification Toast */}
      {feedbackMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-16 right-4 z-50 max-w-md bg-zinc-950/95 border border-cyan-400 rounded p-3 shadow-[0_0_20px_rgba(0,240,255,0.3)] text-xs text-cyan-200 flex items-center gap-2.5"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Cyber Header */}
      <CyberHeader
        searchQuery={filters.query || ''}
        onSearchChange={(q) => setFilters((prev) => ({ ...prev, query: q }))}
        favoritesCount={favoriteIds.size}
        onOpenFavorites={() => setIsFavoritesDrawerOpen(true)}
        isFavoritesActive={Boolean(filters.onlyFavorites)}
        onToggleFavoritesMode={() => setFilters((prev) => ({ ...prev, onlyFavorites: !prev.onlyFavorites }))}
        compareCount={comparedItemIds.length}
        onOpenCompare={() => setIsCompareModalOpen(true)}
        onOpenDiceRoller={() => {
          setDicePresetItem(null);
          setIsDiceRollerOpen(true);
        }}
        onOpenAddEquipment={() => {
          setEditingEquipment(null);
          setIsAddModalOpen(true);
        }}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        scanlinesEnabled={scanlinesEnabled}
        onToggleScanlines={() => setScanlinesEnabled((prev) => !prev)}
        ruleSystem={ruleSystem}
        onRuleSystemChange={setRuleSystem}
        githubUser={githubUser}
        onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
      />

      {/* Database / Backup HUD Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2 w-full flex items-center justify-between gap-3 flex-wrap bg-[#080d16]/80 border-b border-cyan-950 text-xs">
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-zinc-400">Base active:</span>
          <span className="text-cyan-300 font-bold">{allEquipment.length} matériels</span>
          {customItems.length > 0 && (
            <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold text-[11px]">
              {customItems.length} créé{customItems.length > 1 ? 's' : ''} par vous
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Export JSON Button */}
          <button
            onClick={() => {
              playCyberClick();
              handleExportCustomGear();
            }}
            disabled={customItems.length === 0}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono border transition-all ${
              customItems.length > 0
                ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-cyan-400 hover:text-cyan-300'
                : 'bg-zinc-950/60 border-zinc-800 text-zinc-600 cursor-not-allowed'
            }`}
            title="Télécharger une sauvegarde JSON de vos armes et équipements créés"
          >
            <Download className="w-3 h-3 text-cyan-400" />
            <span>Sauvegarde JSON</span>
          </button>

          {/* Import JSON Button */}
          <label
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono border bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-cyan-400 hover:text-cyan-300 transition-all cursor-pointer"
            title="Restaurer ou importer des armes et équipements depuis un fichier JSON"
          >
            <Upload className="w-3 h-3 text-cyan-400" />
            <span>Importer JSON</span>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleImportCustomGear}
              className="hidden"
            />
          </label>

          {/* Merge Duplicates Button */}
          <button
            onClick={handleMergeDuplicates}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono border bg-purple-950/40 border-purple-500/50 text-purple-300 hover:bg-purple-900/50 hover:border-purple-400 transition-all shadow-[0_0_8px_rgba(168,85,247,0.15)]"
            title="Analyser et fusionner les doublons dans le compendium"
          >
            <GitMerge className="w-3 h-3 text-purple-400" />
            <span>Fusionner Doublons</span>
          </button>

          {/* GitHub Gist Sync Button */}
          <button
            onClick={() => {
              playCyberClick();
              setIsGitHubModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono border bg-cyan-950/40 border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/50 hover:border-cyan-400 transition-all shadow-[0_0_8px_rgba(0,240,255,0.15)]"
            title="Synchroniser avec GitHub Gist ou importer un dépôt distant"
          >
            <Github className="w-3 h-3 text-cyan-400" />
            <span>Gist Sync</span>
          </button>

          {/* Add Gear shortcut button */}
          <button
            onClick={() => {
              playCyberClick();
              setEditingEquipment(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-mono font-bold bg-cyan-500/20 border border-cyan-400 text-cyan-300 hover:bg-cyan-500/30 transition-all shadow-[0_0_8px_rgba(0,240,255,0.2)]"
          >
            <PlusCircle className="w-3 h-3 text-cyan-400" />
            <span>+ Créer Arme/Matériel</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <CategoryFilters
        selectedCategory={filters.category || 'all'}
        onSelectCategory={(cat) => setFilters((prev) => ({ ...prev, category: cat }))}
        items={allEquipment}
      />

      {/* Rarity & Controls Bar */}
      <RarityFilterBar
        filters={filters}
        onFilterChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
        onResetFilters={handleResetFilters}
        manufacturers={manufacturers}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalFiltered={filteredEquipment.length}
        totalOverall={allEquipment.length}
      />

      {/* Active Filter Tags Bar (if any filter is on) */}
      {(filters.query || filters.category !== 'all' || filters.rarity !== 'all' || filters.manufacturer !== 'all' || filters.onlyFavorites) && (
        <div className="max-w-7xl mx-auto px-4 py-1.5 w-full flex items-center gap-2 flex-wrap text-[11px]">
          <span className="text-zinc-500">Filtres actifs:</span>
          {filters.query && (
            <span className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/50 text-cyan-300 flex items-center gap-1">
              Recherche: "{filters.query}"
              <button
                onClick={() => setFilters((prev) => ({ ...prev, query: '' }))}
                className="hover:text-white"
                aria-label="Supprimer le filtre de recherche"
              >
                ×
              </button>
            </span>
          )}
          {filters.category && filters.category !== 'all' && (
            <span className="px-2 py-0.5 rounded bg-blue-950/70 border border-blue-500/50 text-blue-300 flex items-center gap-1">
              Type: {filters.category}
              <button
                onClick={() => setFilters((prev) => ({ ...prev, category: 'all' }))}
                className="hover:text-white"
                aria-label="Supprimer le filtre de catégorie"
              >
                ×
              </button>
            </span>
          )}
          {filters.rarity && filters.rarity !== 'all' && (
            <span className="px-2 py-0.5 rounded bg-purple-950/70 border border-purple-500/50 text-purple-300 flex items-center gap-1">
              Rareté: {filters.rarity}
              <button
                onClick={() => setFilters((prev) => ({ ...prev, rarity: 'all' }))}
                className="hover:text-white"
                aria-label="Supprimer le filtre de rareté"
              >
                ×
              </button>
            </span>
          )}
          {filters.manufacturer && filters.manufacturer !== 'all' && (
            <span className="px-2 py-0.5 rounded bg-amber-950/70 border border-amber-500/50 text-amber-300 flex items-center gap-1">
              Corpo: {filters.manufacturer}
              <button
                onClick={() => setFilters((prev) => ({ ...prev, manufacturer: 'all' }))}
                className="hover:text-white"
                aria-label="Supprimer le filtre de fabricant"
              >
                ×
              </button>
            </span>
          )}
          {filters.onlyFavorites && (
            <span className="px-2 py-0.5 rounded bg-amber-950/70 border border-amber-400 text-amber-300 flex items-center gap-1 font-bold">
              ★ Mode Favoris uniquement
              <button
                onClick={() => setFilters((prev) => ({ ...prev, onlyFavorites: false }))}
                className="hover:text-white"
                aria-label="Désactiver le filtre favoris uniquement"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}

      {/* Main Grid View */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        {filteredEquipment.length === 0 ? (
          <div className="my-16 p-8 bg-zinc-950/80 border border-zinc-800 rounded text-center flex flex-col items-center justify-center max-w-lg mx-auto">
            <ShieldAlert className="w-12 h-12 text-zinc-600 mb-3" />
            <h3 className="text-base font-bold text-zinc-200 uppercase tracking-wider">
              Aucun équipement ne correspond à votre requête
            </h3>
            <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
              Modifiez vos critères de recherche, élargissez la sélection de rareté ou désactivez le filtre corporatiste pour afficher plus de matériel.
            </p>
            <div className="mt-5 flex items-center gap-3 flex-wrap justify-center">
              <button
                onClick={() => {
                  playCyberClick();
                  handleResetFilters();
                }}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-black font-bold text-xs rounded transition-all shadow-[0_0_15px_rgba(0,240,255,0.25)] flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Réinitialiser les filtres</span>
              </button>
              <button
                onClick={() => {
                  playCyberClick();
                  setEditingEquipment(null);
                  setIsAddModalOpen(true);
                }}
                className="px-4 py-2 bg-zinc-900 border border-amber-500/60 hover:bg-amber-950/40 text-amber-300 font-bold text-xs rounded transition-all flex items-center gap-2"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Créer ce matériel</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredEquipment.map((item) => (
              <EquipmentCard
                key={item.id}
                item={item}
                isFavorite={favoriteIds.has(item.id)}
                onToggleFavorite={handleToggleFavorite}
                isCompared={comparedItemIds.includes(item.id)}
                onToggleCompare={handleToggleCompare}
                onSelectDetails={setSelectedDetailItem}
                ruleSystem={ruleSystem}
                onEditCustom={handleEditEquipment}
                onDeleteCustom={handleDeleteEquipment}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Bottom HUD / Compare Tray (if items compared) */}
      {comparedItemIds.length > 0 && (
        <aside
          aria-label="Barre de comparaison rapide"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#070a12]/95 border border-cyan-400/80 rounded-full px-5 py-2.5 shadow-[0_0_25px_rgba(0,240,255,0.3)] backdrop-blur-md flex items-center gap-4 text-xs font-mono"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400 animate-bounce" />
            <span className="text-zinc-300">
              <strong className="text-cyan-300">{comparedItemIds.length}</strong> / 2 matériel{comparedItemIds.length > 1 ? 's' : ''} à comparer
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playCyberClick();
                setIsCompareModalOpen(true);
              }}
              className="px-3 py-1 bg-cyan-400 hover:bg-cyan-300 text-black font-bold rounded-full transition-all"
            >
              Ouvrir la Comparaison
            </button>
            <button
              onClick={() => {
                playCyberClick();
                setComparedItemIds([]);
              }}
              className="text-zinc-500 hover:text-red-400 text-xs px-2"
              title="Vider la sélection de comparaison"
            >
              Vider
            </button>
          </div>
        </aside>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-cyan-950 bg-[#05070a] py-6 px-4 text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>TECH COMPENDIUM // Night City &amp; Malmart 2090 Catalogue Hybride</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                playCyberClick();
                setIsRulesGuideOpen(true);
              }}
              className="text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Guide des Règles &amp; Conversions JDR</span>
            </button>
            <span className="text-zinc-700">|</span>
            <span>Appuyez sur <kbd className="px-1.5 py-0.5 bg-zinc-800 text-zinc-300 rounded text-[10px] border border-zinc-700">/</kbd> pour chercher</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <EquipmentDetailModal
        item={selectedDetailItem}
        onClose={() => setSelectedDetailItem(null)}
        isFavorite={selectedDetailItem ? favoriteIds.has(selectedDetailItem.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onOpenDiceWithPreset={handleOpenDiceWithPreset}
        isCompared={selectedDetailItem ? comparedItemIds.includes(selectedDetailItem.id) : false}
        onToggleCompare={handleToggleCompare}
        onEditEquipment={handleEditEquipment}
        onDeleteEquipment={handleDeleteEquipment}
        onDuplicateEquipment={handleDuplicateEquipment}
      />

      <FavoritesDrawer
        isOpen={isFavoritesDrawerOpen}
        onClose={() => setIsFavoritesDrawerOpen(false)}
        favorites={favoriteItems}
        onRemoveFavorite={handleToggleFavorite}
        onClearAll={handleClearFavorites}
        onSelectDetails={(item) => {
          setSelectedDetailItem(item);
          setIsFavoritesDrawerOpen(false);
        }}
      />

      <CompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        comparedItems={comparedItems}
        onRemoveFromCompare={handleRemoveFromCompare}
      />

      <DiceRollerModal
        isOpen={isDiceRollerOpen}
        onClose={() => setIsDiceRollerOpen(false)}
        presetItem={dicePresetItem}
      />

      <RulesGuideModal
        isOpen={isRulesGuideOpen}
        onClose={() => setIsRulesGuideOpen(false)}
      />

      <AddEquipmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSaveEquipment={handleSaveEquipment}
        editingItem={editingEquipment}
      />

      <GitHubModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        currentItems={favoriteItems.length > 0 ? favoriteItems : allEquipment}
        onImportItems={handleImportFromGitHub}
        currentUser={githubUser}
        onUserChange={setGithubUser}
      />
    </div>
  );
}
