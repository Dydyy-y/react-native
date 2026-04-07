import { useEffect, useRef, useCallback, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { POLLING_INTERVAL_MS } from '../utils/constants';

/** Nombre max d'echecs consecutifs avant d'arreter le polling */
const MAX_CONSECUTIVE_ERRORS = 10;

/**
 * Hook generique de polling HTTP.
 * Execute un callback a intervalle regulier (30s par defaut).
 * Respecte le rate limit API de 20 req/min.
 * Arrete le polling apres MAX_CONSECUTIVE_ERRORS echecs consecutifs.
 * Pause automatiquement quand l'app passe en arriere-plan (economie batterie).
 * Protege contre les appels concurrents (reseau lent).
 *
 * @param callback - Fonction async a executer periodiquement
 * @param interval - Intervalle en ms (minimum 30000, defaut POLLING_INTERVAL_MS)
 * @param enabled - Active/desactive le polling dynamiquement
 * @returns consecutiveErrors - nombre d'echecs consecutifs (0 = tout va bien)
 */
export const usePolling = (
  callback: () => Promise<void>,
  interval: number = POLLING_INTERVAL_MS,
  enabled: boolean = true,
): { consecutiveErrors: number } => {
  // Ref pour toujours avoir la derniere version du callback sans relancer l'effet
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const safeInterval = Math.max(interval, POLLING_INTERVAL_MS);

  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const consecutiveErrorsRef = useRef(0);

  // Protection contre les appels concurrents (reseau lent > 30s)
  const isRunningRef = useRef(false);

  // Suivi de l'etat de l'app (foreground/background)
  const appActiveRef = useRef(AppState.currentState === 'active');

  const tick = useCallback(async () => {
    // Ne pas executer si en arriere-plan ou deja en cours
    if (!appActiveRef.current) return;
    if (isRunningRef.current) return;
    if (consecutiveErrorsRef.current >= MAX_CONSECUTIVE_ERRORS) return;

    isRunningRef.current = true;
    try {
      await callbackRef.current();
      consecutiveErrorsRef.current = 0;
      setConsecutiveErrors(0);
    } catch {
      consecutiveErrorsRef.current += 1;
      setConsecutiveErrors(consecutiveErrorsRef.current);
    } finally {
      isRunningRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      consecutiveErrorsRef.current = 0;
      setConsecutiveErrors(0);
      return;
    }

    // Gestion AppState : pause en background, reprise en foreground
    const handleAppState = (nextState: AppStateStatus) => {
      const wasActive = appActiveRef.current;
      appActiveRef.current = nextState === 'active';
      // Reprendre immediatement au retour en foreground
      if (!wasActive && appActiveRef.current) {
        tick();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppState);

    // Appel immediat au montage (seulement si foreground)
    tick();

    const timer = setInterval(tick, safeInterval);

    return () => {
      clearInterval(timer);
      subscription.remove();
    };
  }, [enabled, safeInterval, tick]);

  return { consecutiveErrors };
};
