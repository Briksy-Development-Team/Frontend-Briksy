/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_API_URL?: string
  readonly VITE_MAP_PROVIDER?: string
  readonly VITE_GOOGLE_MAPS_API_KEY?: string
  readonly VITE_MAPBOX_TOKEN?: string
}

interface Window {
  google?: any
}

declare const google: any
