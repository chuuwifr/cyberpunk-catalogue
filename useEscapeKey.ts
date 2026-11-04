import { useEffect, useRef } from 'react';

type CloseHandlerRef = { current: () => void };

// Pile des modals ouverts : seul celui du dessus réagit à Échap,
// ce qui évite de fermer d'un coup une fiche + le formulaire d'édition ouvert par-dessus.
const openModals: CloseHandlerRef[] = [];

function handleKeyDown(e: KeyboardEvent) {
  if (e.key !== 'Escape' || e.defaultPrevented) return;
  const top = openModals[openModals.length - 1];
  if (top) {
    e.preventDefault();
    top.current();
  }
}

/**
 * Ferme le modal courant avec la touche Échap tant qu'il est ouvert.
 * À appeler avant tout `return null` conditionnel du composant.
 */
export function useEscapeKey(isOpen: boolean, onClose: () => void): void {
  const handlerRef = useRef<() => void>(onClose);
  handlerRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    const entry: CloseHandlerRef = handlerRef;
    openModals.push(entry);
    if (openModals.length === 1) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      const index = openModals.indexOf(entry);
      if (index >= 0) openModals.splice(index, 1);
      if (openModals.length === 0) {
        window.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [isOpen]);
}
