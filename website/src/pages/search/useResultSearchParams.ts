import { useLocation, useNavigate } from "react-router-dom";

const CLEAN_ROUTES: Record<string, Record<string, string>> = {
  "/buy": { type: "property", intent: "buy" },
  "/sell": { type: "property", intent: "sell" },
  "/rent": { type: "property", intent: "rent" },
  "/builders": { type: "builder" },
  "/agents": { type: "builder", tab: "agents" },
  "/professionals": { type: "trader" },
  "/commercials": { type: "comercial" },
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

  if (routeParams && !location.search) {
    Object.entries(routeParams).forEach(([key, value]) => searchParams.set(key, value));
  }

  const setSearchParams = (next: URLSearchParams) => {
    const cleanPath = routeParams && matchesRoute(next, routeParams) ? location.pathname : "/result";
    navigate({ pathname: cleanPath, search: cleanPath === "/result" && next.toString() ? `?${next.toString()}` : "" });
  };

  return [searchParams, setSearchParams];
};
