/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Endpoint do Formspree, ex.: https://formspree.io/f/xxxxxxx */
  readonly VITE_FORMSPREE_ENDPOINT?: string
  /** Número de WhatsApp no formato internacional, apenas dígitos (ex.: 351912345678) */
  readonly VITE_WHATSAPP_NUMBER?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
