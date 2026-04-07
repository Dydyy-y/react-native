import { useEffect, useState } from 'react';
import { getGameStats } from '../services/gameService';
import { GameStats } from '../types/game.types';
import { getErrorMessage } from '../../../shared/utils/errorHandler';

/**
 * Hook de récupération des stats de fin de partie.
 * Conforme à la consigne : les requêtes de récupération doivent être sous forme de hooks.
 */
export const useGameStats = (sessionId: number | undefined) => {
  const [data, setData] = useState<GameStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;

    const fetch = async () => {
      try {
        setLoading(true);
        const stats = await getGameStats(sessionId);
        if (!cancelled) setData(stats);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, [sessionId]);

  return { data, loading, error };
};
