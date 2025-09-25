/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_BILLING_PRICE_ID?: string;
  readonly VITE_BILLING_SUCCESS_URL?: string;
  readonly VITE_BILLING_CANCEL_URL?: string;
  readonly VITE_PAYMENT_LINK_URL?: string; // removed soon
  readonly VITE_OAUTH_REDIRECT_URL?: string;
  readonly VITE_HF_TOKEN?: string;
  readonly VITE_HF_RMBG_MODEL?: string; // default: briaai/RMBG-1.4
  readonly VITE_ANALYTICS_ENABLED?: string; // 'true' to enable
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


