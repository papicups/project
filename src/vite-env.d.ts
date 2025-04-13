/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string
  readonly EMAIL_USER: string
  readonly EMAIL_PASS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
