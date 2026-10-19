import { useLocation, useNavigate } from "react-router-dom";

const CLEAN_ROUTES: Record<string, Record<string, string>> = {
  "/buy": { type: "property", tab: "buy" },
  "/sold": { type: "property", tab: "sold" },
  "/rent": { type: "property", tab: "rent" },
  "/builders": { type: "builder" },
  "/agents": { type: "builder", tab: "agents" },
  "/professionals": { type: "trader" },
  "/commercials": { type: "commercial" },
  "/auctions": { type: "auction" },
  "/auction": { type: "auction" },
};

const matchesRoute = (params: URLSearchParams, routeParams: Record<string, string>) => {
  const keys = Object.keys(routeParams);
  return keys.length === [...params.keys()].length && keys.every((key) => params.get(key) === routeParams[key]);
};

export const useResultSearchParams = (): [URLSearchParams, (next: URLSearchParams) => void] => {
  const location = useLocation();
  const navigate = useNavigate();
  const routeParams = CLEAN_ROUTES[location.pathname];
  const searchParams = new URLSearchParams(location.search);

  if (routeParams) {
    Object.entries(routeParams).forEach(([key, value]) => {
      if (!searchParams.has(key)) searchParams.set(key, value);
    });
  }

  const setSearchParams = (next: URLSearchParams) => {
    const cleanPath = routeParams && matchesRoute(next, routeParams) ? location.pathname : "/result";
    navigate({ pathname: cleanPath, search: cleanPath === "/result" && next.toString() ? `?${next.toString()}` : "" });
  };

  return [searchParams, setSearchParams];
};
