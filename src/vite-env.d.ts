/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_SUPABASE_URL: string;
	readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
	readonly VITE_CLIPBOARD_TTL_HOURS?: string;
	readonly VITE_POINTER_GIST_ID: string;
	readonly VITE_POINTER_GIST_OWNER: string;
}
