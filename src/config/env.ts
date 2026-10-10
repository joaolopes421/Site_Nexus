// O mesmo código corre em Vite (import.meta.env) e no shell Next.js usado pela preview do v0 (process.env).
const viteEnv = (import.meta as ImportMeta & { env?: Partial<ImportMetaEnv> }).env
const hasProcess = typeof process !== 'undefined'

export const env = {
  isDev: viteEnv?.DEV ?? (hasProcess && process.env.NODE_ENV !== 'production'),
  formspreeEndpoint:
    viteEnv?.VITE_FORMSPREE_ENDPOINT ?? (hasProcess ? process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT : undefined),
  whatsappNumber:
    viteEnv?.VITE_WHATSAPP_NUMBER ?? (hasProcess ? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER : undefined),
}
