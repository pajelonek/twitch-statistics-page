/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_RESOURCE_URL: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }