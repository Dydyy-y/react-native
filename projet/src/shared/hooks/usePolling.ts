import { useEffect, useRef, useCallback, useState } from 'react';
import { POLLING_INTERVAL_MS } from '../utils/constants';

/** Nombre max d'echecs consecutifs avant d'arreter le polling */
const MAX_CONSECUTIVE_ERRORS = 10;

/**
 * Hook generique de polling HTTP.
 * Execute un callback a intervalle regulier (30s par defaut).
 * Respecte le rate limit API de 20 req/min.
 * Arrete le polling apres MAX_CONSECUTIVE_ERRORS echecs consecutifs.
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

  const tick = useCallback(async () => {
    // Arreter si trop d'echecs consecutifs
    if (consecutiveErrorsRef.current >= MAX_CONSECUTIVE_ERRORS) return;
    try {
      await callbackRef.current();
      consecutiveErrorsRef.current = 0;
      setConsecutiveErrors(0);
    } catch {
      consecutiveErrorsRef.current += 1;
      setConsecutiveErrors(consecutiveErrorsRef.current);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      consecutiveErrorsRef.current = 0;
      setConsecutiveErrors(0);
      return;
    }

    // Appel immediat au montage
    tick();

    const timer = setInterval(tick, safeInterval);

    return () => clearInterval(timer);
  }, [enabled, safeInterval, tick]);

  return { consecutiveErrors };
};
