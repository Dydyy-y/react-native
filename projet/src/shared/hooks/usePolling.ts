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
  // On stocke le callback dans une ref pour que l'intervalle utilise
  // toujours la version la plus recente sans avoir a relancer le setInterval
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const safeInterval = Math.max(interval, POLLING_INTERVAL_MS);

  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const consecutiveErrorsRef = useRef(0);

  // Si le reseau est lent (requete > 30s), on evite de lancer un 2e appel
  const isRunningRef = useRef(false);

  // Pause le polling quand l'app est en arriere-plan (economie batterie + quota API)
  const appActiveRef = useRef(AppState.currentState === 'active');

  // Execution d'un tick : verifie les gardes puis appelle le callback
  const tick = useCallback(async () => {
    if (!appActiveRef.current) return;   // app en arriere-plan
    if (isRunningRef.current) return;    // requete precedente toujours en cours
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

    // Quand l'app revient au premier plan, on relance un tick immediatement
    // pour rattraper le retard accumule en arriere-plan
    const handleAppState = (nextState: AppStateStatus) => {
      const wasActive = appActiveRef.current;
      appActiveRef.current = nextState === 'active';
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
