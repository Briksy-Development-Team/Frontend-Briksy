import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import type { QueryParams } from "..//entity-list/EntityList";

type FetchFn = (params: QueryParams) => void;

export const useEntityTable = (fetchFn: FetchFn) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);

  const [params, setParams] = useState<QueryParams>({
    page: 1,
    per_page: 10,
    search: "",
    filters: {},
    sort: "",
    direction: "asc",
  });

  useEffect(() => {
    setParams((prev) => ({ ...prev, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch]);

  useEffect(() => {
    fetchFn(params);
  }, [params]);

  const handleParamsChange = (next: QueryParams) => {
    if (next.search !== params.search) {
      setSearch(next.search);
      return;
    }
    setParams(next);
  };

  return { params, handleParamsChange };
};
