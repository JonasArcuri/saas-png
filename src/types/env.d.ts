/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_BILLING_PRICE_ID?: string;
  readonly VITE_BILLING_SUCCESS_URL?: string;
  readonly VITE_BILLING_CANCEL_URL?: string;
  readonly VITE_PAYMENT_LINK_URL?: string; // removed soon
  readonly VITE_OAUTH_REDIRECT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


