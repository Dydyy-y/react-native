import { useEffect, useRef, useCallback } from 'react';
import { POLLING_INTERVAL_MS } from '../utils/constants';

/**
 * Hook générique de polling HTTP.
 * Exécute un callback à intervalle régulier (30s par défaut).
 * Respecte le rate limit API de 20 req/min.
 *
 * @param callback - Fonction async à exécuter périodiquement
 * @param interval - Intervalle en ms (minimum 30000, défaut POLLING_INTERVAL_MS)
 * @param enabled - Active/désactive le polling dynamiquement
 */
export const usePolling = (
  callback: () => Promise<void>,
  interval: number = POLLING_INTERVAL_MS,
  enabled: boolean = true,
): void => {
  // Ref pour toujours avoir la dernière version du callback sans relancer l'effet
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const safeInterval = Math.max(interval, POLLING_INTERVAL_MS);

  const tick = useCallback(async () => {
    try {
      await callbackRef.current();
    } catch {
      // Les erreurs sont gérées par le callback lui-même
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Appel immédiat au montage
    tick();

    const timer = setInterval(tick, safeInterval);

    return () => clearInterval(timer);
  }, [enabled, safeInterval, tick]);
};
