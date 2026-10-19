export interface NavVisibilityRules {
  belowMd: string[];
  belowLg: string[];
  always: string[];
}

export interface BottomNavVisibilityRules {
  // Routes where bottom navigation should be hidden in PWA / mobile app
  hiddenRoutes: string[];
  // Optional: routes hidden on all screens if used elsewhere
  always?: string[];
}

export const NAV_VISIBILITY_CONFIG: NavVisibilityRules = {
  belowMd: [
    "/profile/",

    "/property/",
    "/auction/",
    "/builder/",
    "/builder-project/",
    "/agent/",
    "/service/",

    // Utility & static pages
    "/notification",
    "/help-support",
    "/help",
    "/company-details",
    "/terms",
    "/privacy-policy",
    "/enquiries",
    "/saved",
  ],

  belowLg: [
    // Add any routes where tablet should also hide top navbar, e.g.:
    // '/search-filters',
  ],

  // Hidden on ALL screen sizes (mobile, tablet, and desktop)
  always: [
    // Add any routes where top navbar should never appear, e.g.:
    // '/checkout',
  ],
};

export const BOTTOM_NAV_CONFIG: BottomNavVisibilityRules = {
  hiddenRoutes: [
    "/checkout",
    "/profile/",

    "/property/",
    "/auction/",
    "/builder/",
    "/builder-project/",
    "/agent/",
    "/service/",
  ],
  always: [],
};

export const HIDE_NAV_BELOW_MD = NAV_VISIBILITY_CONFIG.belowMd;
export const HIDE_BOTTOM_NAV_ROUTES = BOTTOM_NAV_CONFIG.hiddenRoutes;

function matchesRoute(pathname: string, routeList: string[]): boolean {
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";

  return routeList.some((route) => {
    if (route.endsWith("/")) {
      return pathname.startsWith(route);
    }
    const normalizedRoute = route.replace(/\/+$/, "") || "/";
    return (
      normalizedPath === normalizedRoute ||
      pathname.startsWith(`${normalizedRoute}/`)
    );
  });
}

/**
 * Top Navbar visibility helper
 */
export function getNavbarVisibilityClass(pathname: string): string {
  if (matchesRoute(pathname, NAV_VISIBILITY_CONFIG.always)) {
    return "hidden";
  }
  if (matchesRoute(pathname, NAV_VISIBILITY_CONFIG.belowLg)) {
    return "hidden lg:block";
  }
  if (matchesRoute(pathname, NAV_VISIBILITY_CONFIG.belowMd)) {
    return "hidden md:block";
  }
  return "";
}

export function isNavbarHiddenBelowMd(pathname: string): boolean {
  return (
    matchesRoute(pathname, NAV_VISIBILITY_CONFIG.always) ||
    matchesRoute(pathname, NAV_VISIBILITY_CONFIG.belowLg) ||
    matchesRoute(pathname, NAV_VISIBILITY_CONFIG.belowMd)
  );
}

/**
 * Bottom Navigation visibility helper for PWA / Mobile App
 */
export function isBottomNavHidden(pathname: string): boolean {
  return (
    matchesRoute(pathname, BOTTOM_NAV_CONFIG.hiddenRoutes) ||
    (BOTTOM_NAV_CONFIG.always
      ? matchesRoute(pathname, BOTTOM_NAV_CONFIG.always)
      : false)
  );
}
