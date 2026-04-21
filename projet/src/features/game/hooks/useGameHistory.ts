import { useEffect, useState, useCallback, useRef } from 'react';
import { getGameHistory, getGameStats } from '../services/gameService';
import { GameHistoryEntry, GameStats } from '../types/game.types';
import { getErrorMessage } from '../../../shared/utils/errorHandler';

/**
 * Hook pagine pour l'historique des parties.
 * Charge la premiere page au montage, puis loadMore() pour la pagination infinie.
 */
export const useGameHistory = () => {
  const [entries, setEntries] = useState<GameHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPage = useCallback(async (p: number) => {
    try {
      if (p === 1) setLoading(true);
      else setLoadingMore(true);
      const data = await getGameHistory(p);
      if (p === 1) {
        setEntries(data.data ?? []);
      } else {
        setEntries((prev) => [...prev, ...(data.data ?? [])]);
      }
      setLastPage(data.last_page);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (page < lastPage && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPage(nextPage);
    }
  }, [page, lastPage, loadingMore, fetchPage]);

  const retry = useCallback(() => {
    fetchPage(1);
  }, [fetchPage]);

  return { entries, loading, error, loadingMore, loadMore, retry };
};

/**
 * Charge les stats d'une partie selectionnee dans l'historique.
 * lastRequestIdRef gere les race conditions : si le joueur clique vite
 * sur plusieurs parties, seule la reponse de la derniere requete est prise en compte.
 */
export const useGameDetail = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [stats, setStats] = useState<GameStats | null>(null);
  const [loading, setLoading] = useState(false);
  const lastRequestIdRef = useRef(0);

  const select = useCallback(async (entry: GameHistoryEntry) => {
    if (selectedId === entry.id) {
      setSelectedId(null);
      setStats(null);
      return;
    }
    const requestId = ++lastRequestIdRef.current;
    setSelectedId(entry.id);
    setStats(null);
    setLoading(true);
    try {
      const data = await getGameStats(entry.id);
      if (requestId !== lastRequestIdRef.current) return;
      setStats(data);
    } catch {
      if (requestId !== lastRequestIdRef.current) return;
      setStats(null);
    } finally {
      if (requestId === lastRequestIdRef.current) {
        setLoading(false);
      }
    }
  }, [selectedId]);

  return { selectedId, stats, loading, select };
};
