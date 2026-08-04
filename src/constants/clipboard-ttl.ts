/** Keep in sync with `ttl` in supabase/clipboard-ttl.sql */
const CLIPBOARD_TTL_HOURS = Number(import.meta.env.VITE_CLIPBOARD_TTL_HOURS ?? 1);

const CLIPBOARD_TTL_MS = CLIPBOARD_TTL_HOURS * 60 * 60 * 1000;

export { CLIPBOARD_TTL_HOURS, CLIPBOARD_TTL_MS };
