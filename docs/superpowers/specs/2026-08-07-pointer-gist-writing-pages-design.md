# Pointer Gist — Writing Pages Design

**Date:** 2026-08-07  
**Status:** Approved

---

## Problem

`Analog.tsx` and `Bannjan.tsx` need to fetch and display content from their respective GitHub gists. However, when a gist's visibility is toggled in the Notes editor (`EditNoteTabPanel` / `github.service.ts`), the implementation must delete the old gist and create a new one (GitHub's PATCH API does not support changing the `public` field). This generates a new gist ID, so the IDs cannot be hardcoded in the page components.

---

## Solution Overview

A single public "pointer gist" (`7d48f1881df7e46bf6e0425b50666131`) acts as a stable registry that maps page keys to their current gist IDs. The pointer gist stores one file (`PointerGistIDs`) in JSON format. Writing pages look up their ID from the pointer gist at load time. When a tracked gist is recreated due to a visibility change, the service automatically updates the pointer gist with the new ID.

---

## Pointer Gist File Format

`PointerGistIDs` stores a JSON object mapping page keys to gist IDs:

```json
{
  "Analog": "efa92ac12875415bc2a0fa63ccb246b1",
  "Bannjan": "fb7e16ee5a0d62137828276c9db217d3"
}
```

The current `Key:"id"` format must be migrated to JSON before the feature is used. This can be done programmatically during the first pointer-gist PATCH or as a one-time manual edit.

---

## Architecture

### New service functions — `github.service.ts`

**`fetchPointerGistIds(): Promise<Record<string, string>>`**
- Fetches the pointer gist (`7d48f1881df7e46bf6e0425b50666131`) unauthenticated via plain `fetch` (public gist, no token needed)
- Reads the `PointerGistIDs` file content and parses it as JSON
- Returns the key→id map (e.g. `{ Analog: "...", Bannjan: "..." }`)

**`fetchPublicGistFiles(gistId: string): Promise<Array<{ filename: string; content: string }>>`**
- Fetches any public gist by ID unauthenticated
- Returns files as a sorted array of `{ filename, content }`

**`updatePointerGistId(token: string, oldId: string, newId: string): Promise<void>`**
- Fetches the pointer gist (authenticated, to allow PATCH)
- Parses the `PointerGistIDs` JSON
- Scans all values; if `oldId` is found, replaces it with `newId`
- If no match is found, returns early — this gist is not tracked
- PATCHes the pointer gist file with the updated JSON
- On failure: logs a warning and swallows the error — the visibility change already succeeded and must not be rolled back

### Pointer gist constant

The pointer gist ID (`7d48f1881df7e46bf6e0425b50666131`) is stored as a named constant in `github.service.ts` (or a shared constants file).

### Visibility-change integration — `github.service.ts`

After every delete+create in `saveNote` and `updateNote`, call:

```ts
await updatePointerGistId(token, oldGist.id, newGist.id).catch((err) =>
  console.warn('Failed to update pointer gist:', err)
);
```

### New hook — `src/hooks/usePointerGistContent.ts`

```ts
const { files, loading, error } = usePointerGistContent('Analog');
// files: Array<{ filename: string; content: string }>
```

On mount:
1. Calls `fetchPointerGistIds()` to get the key→id map
2. Looks up `pageKey` (e.g. `'Analog'`) — sets `error` if key is missing
3. Calls `fetchPublicGistFiles(id)` to retrieve the files
4. Returns `{ files, loading, error }`

No auth token required. Runs once on mount.

---

## Writing Pages

### `Analog/Analog.tsx` and `Bannjan/Bannjan.tsx`

Both pages follow the same pattern:

1. Hardcoded page key constant (e.g. `const PAGE_KEY = 'Analog'`)
2. Call `usePointerGistContent(PAGE_KEY)`
3. While loading: render `CircularProgress` (MUI)
4. On error: render inline error message
5. On success: render `JsonSection` with dynamically-built items:

```tsx
items={[
  { kind: 'image-text', header: { titleText: 'Analog' }, content: [] },
  ...files.map(file => ({
    kind: 'image-text' as const,
    header: { titleText: file.filename.replace(/\.txt$/i, '') },
    content: file.content.split('\n'),
    contentBackground: colours.primary,
  })),
]}
```

No background image. Each file's content is split on `\n` into lines; empty lines render as spacers (existing `TextList` behaviour).

### Old stub — `analog/analog.tsx`

The lowercase `analog/analog.tsx` stub is superseded by `Analog/Analog.tsx`. It will be deleted during implementation.

---

## Error Handling

| Scenario | Behaviour |
|---|---|
| Pointer gist fetch fails | `error` set in hook; page shows error message |
| Page key not in pointer gist | `error` set in hook; page shows error message |
| Content gist fetch fails | `error` set in hook; page shows error message |
| Pointer gist update fails (post visibility change) | Warning logged; error swallowed; user sees no disruption |

---

## Files Changed / Created

| File | Change |
|---|---|
| `src/services/github.service.ts` | Add `fetchPointerGistIds`, `fetchPublicGistFiles`, `updatePointerGistId`; call `updatePointerGistId` in `saveNote` and `updateNote` delete+create paths |
| `src/hooks/usePointerGistContent.ts` | New hook |
| `src/pages/Writing/Analog/Analog.tsx` | Replace stub with dynamic implementation |
| `src/pages/Writing/Bannjan/Bannjan.tsx` | Replace stub with dynamic implementation |
| `src/pages/Writing/analog/analog.tsx` | Delete (superseded) |
