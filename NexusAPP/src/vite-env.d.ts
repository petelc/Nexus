/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_SIGNALR_HUB_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_DESCRIPTION: string;
  readonly VITE_ENABLE_COLLABORATION: string;
  readonly VITE_ENABLE_DIAGRAMS: string;
  readonly VITE_ENABLE_PUBLIC_SNIPPETS: string;
  readonly VITE_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
