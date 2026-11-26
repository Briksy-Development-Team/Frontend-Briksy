import { useEffect, useState } from "react";
import { useEntityTable } from "./useEntityTable";
import { fetchListingPage } from "./useListingSummary";
import type { QueryParams } from "../entity-list/types";

export function useServerListing<T>(endpoint: string | undefined, initialParams?: Partial<QueryParams>, revision?: number) {
  const { params, handleParamsChange, setParams } = useEntityTable(() => undefined, initialParams);
  const [result, setResult] = useState<{ rows: T[]; total: number }>({ rows: [], total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(endpoint));
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (!endpoint) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetchListingPage<T>(endpoint, params, controller.signal)
      .then((page) => {
        if (!controller.signal.aborted) setResult(page);
      })
      .catch(() => {
        if (!controller.signal.aborted) setError("Unable to load records.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [endpoint, params, refresh, revision]);

  return { ...result, params, handleParamsChange, setParams, error, loading, reload: () => setRefresh((value) => value + 1) };
}
