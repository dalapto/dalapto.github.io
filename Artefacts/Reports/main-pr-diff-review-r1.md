## PR Review: main (whole codebase) + uncommitted changes — Round 1

- **Generated:** 2026-11-18 09:52 UTC
- **Branch:** main
- **Round:** 1
- **Scope:** whole codebase on `main` (tracked `src/` + `scripts/`) + uncommitted changes
- **Reviewed up to:** 8a7bdbaf478707e93b28daa9ca15f5dd1e24e652
- **Files changed:** 156 tracked source files (~15.6k lines) reviewed; uncommitted: 1 modified (+9/-0), 16 untracked
- **Commits:** 160 commits on main (no branch diff — main matches origin/main, all feature branches merged)
- **Domains reviewed:** quality, observability, resilience, security, architecture
- **Platform overlay:** none (React 18 + TypeScript + Vite SPA on GitHub Pages; .NET-specific checks not applied)
- **Risk level:** HIGH
- **Verdict:** Merge after fixes

*Finding IDs: `R{round}-F{number}` — e.g. `R1-F2` is finding 2 from round 1. IDs stay the same in later rounds and in the remediation report.*

### Summary

The codebase is in reasonable shape for a personal site: strict TypeScript, no `any`, no `dangerouslySetInnerHTML`, consistent `cancelled` flags in async effects, and careful object-URL revocation. The most important problems are in the owner-only tools: the Clipboard drops unsaved edits whenever the browser tab regains focus and can leave its row pointing at deleted files, and its access control depends entirely on Supabase RLS/storage policies that aren't in the repo. The build's `tsc` step type-checks nothing because of a tsconfig glob bug, and 87 type errors have built up as a result. Resilience and code quality had the most findings. Verdict is "Merge after fixes" because the only blocking item (R1-F1) is a small configuration fix.

### Findings at a Glance

| ID | Finding | Severity | Fix scope | Category |
|----|---------|----------|-----------|----------|
| R1-F1 | Clipboard security relies on unversioned Supabase RLS; open sign-up reachable | HIGH | S | Must fix |
| R1-F2 | `tsc` in build checks no app files (`include: "src*"`) — 87 hidden errors | HIGH | M | Should fix |
| R1-F3 | Clipboard reloads on tab refocus, discarding unsaved edits | HIGH | S | Should fix |
| R1-F4 | Clipboard save deletes old files before the row is saved (non-atomic) | HIGH | M | Should fix |
| R1-F5 | Failed hidden-flag read defaults to hidden → next save unpublishes article | MEDIUM | S | Should fix |
| R1-F6 | Stored GitHub token deleted on any error, incl. network/rate-limit | MEDIUM | S | Should fix |
| R1-F7 | Pointer gist read-modify-write with no concurrency control; ~12 serial calls per save | MEDIUM | L | Should fix |
| R1-F8 | Pointer-gist sync failures swallowed; delete leaves permanent dangling entry | MEDIUM | M | Should fix |
| R1-F9 | Private clipboard files stored in public buckets with non-expiring URLs | MEDIUM | M | Should fix |
| R1-F10 | `SmartLink` renders gist URLs without a scheme allow-list (`javascript:`) | MEDIUM | S | Should fix |
| R1-F11 | GitHub PAT in localStorage and no Content-Security-Policy | MEDIUM | S | Should fix |
| R1-F12 | No ErrorBoundary or global error capture — a render throw blanks the site | MEDIUM | S | Should fix |
| R1-F13 | `WritingPagesContext` downloads every article image app-wide before nav renders | MEDIUM | S | Should fix |
| R1-F14 | Swallowed catches, duplicated/unlabelled logging, leftover debug logs | MEDIUM | S | Should fix |
| R1-F15 | Owner-only tools shipped in the public bundle (no code-splitting) | MEDIUM | S | Should fix |
| R1-F16 | `BackgroundContext` value not memoised — whole route tree re-renders on scroll | MEDIUM | S | Should fix |
| R1-F17 | Edit note panel refetches (possibly stale) data after every save | MEDIUM | S | Should fix |
| R1-F18 | Oversized components and duplicated Create/Edit/upload logic | MEDIUM | L | Should fix |
| R1-F19 | Generic components/utils depend on the Supabase data layer | MEDIUM | M | Should fix |
| R1-F20 | `github.service.ts` is a 1113-line god module with hardcoded gist config | MEDIUM | M | Should fix |
| R1-F21 | No automated tests | MEDIUM | M | Should fix |
| R1-F22 | No fetch timeout/retry/rate-limit handling; unhandled `getSession` rejection | LOW | S | Consider |
| R1-F23 | "Hidden" articles are only hidden in the UI | LOW | M | Consider |
| R1-F24 | Uploads have no size cap/type allow-list; unsandboxed iframe preview | LOW | S | Consider |
| R1-F25 | Duplicate `/writing` route metadata; route registries can drift | LOW | S | Consider |
| R1-F26 | Two design-token sources (`colours.ts` vs `tokens.ts`) | LOW | M | Consider |
| R1-F27 | Dead code, plus 16 stale untracked files resurrected from before the refactor | LOW | S | Consider |
| R1-F28 | Suppressed/worked-around hook dependencies | LOW | S | Consider |
| R1-F29 | Copy and auth-prompt defects in note/clipboard panels | LOW | S | Consider |

### Must Fix (blocking)

#### R1-F1 — Clipboard access control relies on unversioned Supabase policies; open sign-up reachable

| | |
|---|---|
| **Severity** | HIGH |
| **Domain** | security |
| **Fix scope** | S |
| **Location** | `src/context/SupabaseContext.tsx:60-70`, `src/services/clipboard.service.ts:9-15`, `src/utils/clipboard-helpers.ts:13-24`, `supabase/` (empty) |

**Problem:** The only thing protecting the clipboard table and storage buckets is Supabase RLS and storage policies, and none of them are in the repo, so they can't be reviewed. `signUp` is wired in the context, and Supabase allows sign-up by default, so anyone with the public publishable key can create an account via `/auth/v1/signup` even though the UI hides the option. The clipboard row is a single fixed ID with no `user_id` column, so policies can't be scoped to an owner per row.

**Impact:** If the policies grant the generic `authenticated` role, any stranger can sign up and then read, overwrite or delete the owner's clipboard text, images and files. *Unverified:* the result depends on dashboard settings outside the repo.

**Fix:**
- Disable sign-ups in the Supabase dashboard (Auth → Providers → Email → "Allow new users to sign up").
- Restrict the `clipboard` table and `clipboard-images`/`clipboard-files` storage policies to the owner's `auth.uid()`, not `authenticated`.
- Commit the policies as migrations under `supabase/migrations/` so they're versioned and reviewable.
- Remove the unused `signUpWithPassword` from `SupabaseContext`.

---

### Should Fix

#### R1-F2 — Build type-check is a no-op; 87 type errors have accumulated

| | |
|---|---|
| **Severity** | HIGH |
| **Domain** | quality, architecture |
| **Fix scope** | M |
| **Location** | `tsconfig.json:28`, `package.json:9,11` |

**Problem:** `"include": ["src*", "src/vite-env.d.ts"]` — the glob `src*` matches nothing under `src/`, so `tsc -p . --listFilesOnly` lists only `src/vite-env.d.ts`. The `tsc &&` step in `build`/`deploy` therefore never type-checks the app. Type-checking `src/` with the same options gives 87 errors:
- 62 × TS6133 unused declarations (e.g. `CoverLetterGenerator` import `routes.ts:16`, `copyrightText` `FooterBar.tsx:26`)
- 10 × TS1205 type re-exports with `isolatedModules` (`MenuPopper.tsx:170`, `ToolbarList.tsx:92`, `TooltipLink.tsx:53`)
- 7 × TS5097 `.tsx` extension imports (`JsonSection.tsx:2-6`)
- 6 × TS2550 `Error.cause` with `lib: ES2020` (`getErrorMessage.ts:7,42`)
- 2 × implicit any (`getErrorMessage.ts:29,43`)

**Impact:** Type regressions ship silently. The "strict" setting gives a false sense of safety.

**Fix:**
```json
"include": ["src", "scripts"]
```
Then bump `lib` to `ES2022` (for `Error.cause`), switch to `export type { … }`, drop the `.tsx` import extensions, and clear the unused declarations until `npx tsc --noEmit -p .` passes.

---

#### R1-F3 — Clipboard reloads on tab refocus, discarding unsaved edits

| | |
|---|---|
| **Severity** | HIGH |
| **Domain** | quality |
| **Fix scope** | S |
| **Location** | `src/pages/Home/Clipboard/useClipboard.ts:272-279`, `src/context/SupabaseContext.tsx:33-38,82-91` |

**Problem:** The load effect depends on `user` (`session?.user`). In the installed `@supabase/auth-js` 2.109.0, when the browser tab becomes visible again (`_onVisibilityChanged` → `_recoverAndRefresh`), the client emits `SIGNED_IN` with a session read fresh from storage. It also emits on every `TOKEN_REFRESHED`. Each event produces a new `user` object, so `loadClipboard()` runs again and calls `setTextContent(server)` and replaces the loaded images and files.

**Impact:** Switching to another browser tab while editing the clipboard silently throws away unsaved text, image and file changes.

**Fix:** Key the effect on `user?.id` instead of `user`. Skip overwriting local state when there are unsaved changes (`textContent !== savedTextContent`, or pending image/file revisions). Memoise the `SupabaseProvider` value.

---

#### R1-F4 — Clipboard save deletes old files before the row is saved

| | |
|---|---|
| **Severity** | HIGH |
| **Domain** | quality, resilience |
| **Fix scope** | M |
| **Location** | `src/supabase/supabase-utils.ts:93-131`, `src/pages/Home/Clipboard/useClipboard.ts:144-163,179-240`, `src/services/clipboard.service.ts:11-15` |

**Problem:** `syncStorageFiles` uploads new files one at a time (`await` in a `for` loop) and then calls `removeFromBucket` for the old ones. Only after that does `saveClipboardRow` upsert the row. The removal set is diffed against local `savedImageFilenames`/`savedFileFilenames`, which can be stale:
- A save queued while logged out (`withSave` → `pendingSaveRef`) captures those as `null`. It runs in `flushPendingSave` at the same time as the initial `loadClipboard`, so old objects are never removed.
- The table holds a single fixed row with last-write-wins semantics, so two devices can orphan or overwrite each other's files.

**Impact:** If the upsert fails, the stored clipboard points at deleted files and the new uploads are orphaned. Storage also leaks over time.

**Fix:** Upload the new files, then upsert the row, and only then delete the old files (best-effort, logged). Compute the removal set from a fresh server read, not local state. Upload in parallel with `Promise.all`. Read state through a ref (or re-read it) when flushing a deferred save.

---

#### R1-F5 — A failed hidden-flag read defaults to "hidden", so the next save unpublishes the article

| | |
|---|---|
| **Severity** | MEDIUM |
| **Domain** | resilience, quality |
| **Fix scope** | S |
| **Location** | `src/pages/Home/Notes/EditNoteTabPanel.tsx:136-155,376-383`, `src/pages/Home/Notes/CreateNoteTabPanel.tsx:97-104,235-250` |

**Problem:** `fetchPointerGistEntryByFolderName(...).catch(() => { setIsHidden(true); setCommittedIsHidden(true); })`. A transient failure of the public raw-gist fetch sets both the draft and the "committed" hidden flag to `true`. The next save then passes `isHidden` to `reconcilePointerGist`/`registerPointerGistEntry`.

**Impact:** A live article is silently unpublished by an unrelated text edit, and no warning is shown.

**Fix:** Read through the authenticated API (`fetchPointerGistEntriesAuth`). On failure, leave the hidden state unknown, show a warning toast, and block saving (or omit `hidden` from the write) until the state is known.

---

#### R1-F6 — Stored GitHub token is deleted on any error

| | |
|---|---|
| **Severity** | MEDIUM |
| **Domain** | resilience, quality |
| **Fix scope** | S |
| **Location** | `src/context/GitHubContext.tsx:36-43` |

**Problem:** `fetchGitHubUser(stored).catch(() => { localStorage.removeItem(TOKEN_KEY); setGitHubToken(null); })` treats any failure (offline, 5xx, rate-limit 403) as an invalid token.

**Impact:** A network blip on page load logs the owner out and they have to paste the PAT again.

**Fix:** Clear the token only on a 401 (have `githubFetch` expose the status). For other errors, keep the token and surface a "couldn't verify GitHub session" warning.

---

#### R1-F7 — Pointer gist read-modify-write has no concurrency control; each save makes many serial calls

| | |
|---|---|
| **Severity** | MEDIUM |
| **Domain** | resilience, quality |
| **Fix scope** | L |
| **Location** | `src/services/github.service.ts:453-482,500-548,561-663,677-772,903-1062`; `src/pages/Home/Notes/CreateNoteTabPanel.tsx:230-251`; `src/pages/Home/Notes/EditNoteTabPanel.tsx:358-384` |

**Problem:** Each pointer operation reads the whole `PointerGistIDs.json`, makes awaited calls, then PATCHes the whole file back, with no version or `updated_at` check. A single Create save chains:
- `saveNote`
- `registerPointerGistEntry`
- `reconcilePointerGist` (which deletes orphan images with `await` in a loop)
- `syncArticlePageImage`

That's up to 4 full pointer PATCHes and more than 12 serial requests, with no rollback if a later step fails.

**Impact:** Overlapping saves (two tabs or devices, or a double submit) lose each other's hidden, order or image changes. A failure partway through leaves partial state, for example a section duplicated across two gists after a move.

**Fix:** Do a single pointer write per user action: compute all the changes, then re-read the pointer just before the PATCH and compare `updated_at` (retry or abort on mismatch). Serialise pointer writes behind a module-level promise queue. Run the orphan-image deletes in parallel.

---

#### R1-F8 — Pointer-gist sync failures are swallowed; a failed delete leaves a dangling entry that never heals

| | |
|---|---|
| **Severity** | MEDIUM |
| **Domain** | resilience, observability |
| **Fix scope** | M |
| **Location** | `src/services/github.service.ts:942,968,973,1003,1053,1077-1079,1086,1094-1096`, `src/services/github.service.ts:643-647`, `src/pages/Home/Notes/EditNoteTabPanel.tsx:454-458` |

**Problem:** `await deleteGist(...); await removePointerGistEntry(...).catch(err => console.warn(...))`, and the caller then shows a "Deleted … successfully" toast. `reconcilePointerGist` deliberately keeps entries whose gist is missing (`if (!gist) { updated[key] = entry; continue; }`), so the dangling entry is never cleaned up.

**Impact:** A non-hidden dangling entry stays in the public Writing nav and its page 404s. The owner is told the delete succeeded.

**Fix:** Return a `{ warnings }` result from these service functions and show a warning toast. In reconcile, drop entries whose gist returns 404 (as opposed to a fetch error).

---

#### R1-F9 — Private clipboard files are stored in public buckets

| | |
|---|---|
| **Severity** | MEDIUM |
| **Domain** | security |
| **Fix scope** | M |
| **Location** | `src/supabase/supabase-utils.ts:43-57,69-71,133-136`, `src/utils/clipboard-helpers.ts:30-43` |

**Problem:** `getStoragePublicUrl` uses `getPublicUrl`, which only works for public buckets. Object reads on public buckets bypass RLS. Filenames are `clipboard-${Date.now()}-${index}-${safeName}`, so they're guessable and the URLs never expire.

**Impact:** Anyone who has, or guesses, a URL can fetch personal clipboard images and files indefinitely.

**Fix:** Make `clipboard-images` and `clipboard-files` private and serve them with `createSignedUrl(path, 3600)`.

---

#### R1-F10 — `SmartLink` renders gist-sourced URLs without a scheme allow-list

| | |
|---|---|
| **Severity** | MEDIUM |
| **Domain** | security |
| **Fix scope** | S |
| **Location** | `src/components/display/FormattedText/FormattedText.tsx:22-27`, `src/components/display/SmartLink/SmartLink.tsx:10-12,22-30`, `src/pages/Writing/ArticlePage.tsx:64-69`, `src/components/display/TextList/TextList.tsx:41,51` |

**Problem:** `const [label, href, img] = inner.split(sigil)` is passed straight to `<a href={href} target='_blank'>` for any value not starting with `/`. Gist text such as `<@x@javascript:...>` produces a link that runs script when clicked. React 18 only logs a warning for this.

**Impact:** Anyone who gains gist write access (for example via a leaked PAT, see R1-F11) can plant stored XSS on the public site.

**Fix:** In `SmartLink`, only allow `http:`, `https:`, `mailto:` and relative `/` URLs. Render anything else as plain text.

---

#### R1-F11 — GitHub PAT stored in localStorage with no Content-Security-Policy

| | |
|---|---|
| **Severity** | MEDIUM |
| **Domain** | security |
| **Fix scope** | S |
| **Location** | `src/context/GitHubContext.tsx:12,31,59`, `index.html` |

**Problem:** The PAT (gist scope) is kept in `localStorage` indefinitely. `index.html` has no CSP `<meta>`, and GitHub Pages can't send CSP headers.

**Impact:** Any script injection (a compromised dependency, or R1-F10) can steal a token with write access to every gist, including the pointer gist.

**Fix:**
- Add a meta CSP: `default-src 'self'; script-src 'self'; connect-src 'self' https://api.github.com https://gist.githubusercontent.com https://<project>.supabase.co; img-src 'self' blob: data: https:`.
- Use a fine-grained PAT with an expiry. Consider `sessionStorage`.

---

#### R1-F12 — No ErrorBoundary or global error capture

| | |
|---|---|
| **Severity** | MEDIUM |
| **Domain** | resilience, observability |
| **Fix scope** | S |
| **Location** | `src/main.tsx:10-20`, `src/App.tsx:159-176` |

**Problem:** There's no `ErrorBoundary`, `componentDidCatch` or `errorElement` anywhere, and no `window.onerror` or `unhandledrejection` hook. All errors go only to the console or a toast.

**Impact:** A render-time throw (for example from malformed gist data) unmounts the whole tree and blanks the public portfolio. Failures for visitors are invisible to the owner.

**Fix:** Wrap the routes in an error boundary with a fallback page. Optionally, send uncaught errors to a free sink (Sentry free tier, or an insert into a Supabase `client_errors` table).

---

#### R1-F13 — `WritingPagesContext` eagerly downloads every article image before the nav renders

| | |
|---|---|
| **Severity** | MEDIUM |
| **Domain** | architecture, resilience, quality |
| **Fix scope** | S |
| **Location** | `src/context/WritingPagesContext.tsx:59-100`, `src/App.tsx:167-169`, `src/pages/Home/Notes/Notes.tsx:71` |

**Problem:** On every app load, `refreshWritingPages` awaits `Promise.all(createArticlePageImageObjectUrl(entry))` for every article before calling `setEntries(fetched)`. The fetches have no timeout. It runs again after each note save, with no request-id guard against overlapping refreshes.

**Impact:** Every visitor, including those on About or YouthWork, downloads all article header images. The Writing nav stays empty until the slowest one finishes. An older refresh can overwrite a newer one.

**Fix:** Call `setEntries` straight after the pointer read and load images lazily (only on Writing pages, or per article). Add a request counter so only the latest refresh commits.

---

#### R1-F14 — Swallowed catches, duplicated/unlabelled logging, leftover debug logs

| | |
|---|---|
| **Severity** | MEDIUM |
| **Domain** | observability, quality |
| **Fix scope** | S |
| **Location** | see list |

**Problem:** Several catch blocks return "no data" with no log, so failures look like empty results. Elsewhere, errors are logged twice, the first time with no context label.
- Silent: `github.service.ts:117-119,820-822` (`catch { return undefined; }`), `usePageImageField.ts:152-159`, `EditNoteTabPanel.tsx:244-246,505-507`, `CreateNoteTabPanel.tsx:102-104`, `FileUpload.tsx:180-190`, `useTextClipboard.ts:10,21`.
- Double-logged: `console.error(error); showToast(msg, ERROR, error)` in `useClipboard.ts:81,137`, `Notes.tsx:52,73`, `EditNoteTabPanel.tsx:263,325,413,462,529`, `CreateNoteTabPanel.tsx:197,262` and the auth modals. `ToastProvider.tsx:53` already calls `logErrorDetails`, and `reportError` is never used.
- Debug: 3 × `console.log` in `AuthRequestContext.tsx:27-31`.

**Impact:** Root causes such as R1-F5 and broken page images are hard to diagnose, and production consoles are noisy.

**Fix:** Log at least `logErrorDetails(err, '<operation>')` in each silent catch. Remove the bare `console.error` calls that come before error toasts. Delete the debug logs.

---

#### R1-F15 — Owner-only tools ship in the public bundle

| | |
|---|---|
| **Severity** | MEDIUM |
| **Domain** | architecture |
| **Fix scope** | S |
| **Location** | `src/routes.ts:4,7,16,63,70` |

**Problem:** `Clipboard`, `Notes` (more than 1,300 lines of editor) and `CoverLetterGenerator` are imported eagerly. There's no `React.lazy`, `Suspense` or dynamic `import()` anywhere in `src/`.

**Impact:** Every portfolio visitor downloads the admin tooling and its gist/Supabase write paths.

**Fix:** `const Notes = lazy(() => import('./pages/Home/Notes/Notes'))` (and the same for the other two), rendered inside `<Suspense>`.

---

#### R1-F16 — `BackgroundContext` value isn't memoised, so the whole route tree re-renders on scroll

| | |
|---|---|
| **Severity** | MEDIUM |
| **Domain** | architecture |
| **Fix scope** | S |
| **Location** | `src/context/BackgroundContext.tsx:161`, `src/App.tsx:85,166` |

**Problem:** `value={{ background, setBackground, registerScrollElement, unregisterScrollElement }}` is a new object on every render, and `background` changes with scroll and hover. `AppInner` uses `useBackground()` only for `setBackground`, yet it builds every `<Route>`.

**Impact:** Each background change re-renders the whole routed page.

**Fix:** Split the context into a stable setters context (memoised) and a separate `background` state context, and have `AppInner` consume only the setters.

---

#### R1-F17 — Edit note panel refetches (possibly stale) data after every save

| | |
|---|---|
| **Severity** | MEDIUM |
| **Domain** | quality |
| **Fix scope** | S |
| **Location** | `src/pages/Home/Notes/EditNoteTabPanel.tsx:169,214-274,390-392` |

**Problem:** `selectedArticle = folders.find(...)` gets a new identity whenever `onSaved()` reloads folders, which re-runs the fetch effect. That fires `getNote` plus a raw-CDN pointer read, which the service's own comment (`github.service.ts:391-395`) warns can be stale.

**Impact:** Every save causes a redundant spinner and refetch, and can reset `order` to a stale value.

**Fix:** Depend on `selectedArticle?.id` rather than the object, and use the authenticated pointer read.

---

#### R1-F18 — Oversized components and duplicated note/upload logic

| | |
|---|---|
| **Severity** | MEDIUM |
| **Domain** | quality |
| **Fix scope** | L |
| **Location** | `src/pages/Home/Notes/EditNoteTabPanel.tsx`, `CreateNoteTabPanel.tsx`, `src/components/layout/NavBar/NavBar.tsx`, `src/pages/Home/Clipboard/useClipboard.ts`, `src/components/controls/{ImageUpload,FileUpload}` |

**Problem:** These are well above the 30-line function threshold and mix several responsibilities:
- `EditNoteTabPanel` is a ≈775-line component with 14 `useState`s.
- `CreateNoteTabPanel` ≈405, `NavBar` ≈280, `useClipboard` ≈278 lines.
- `updateNote` 115 and `syncArticlePageImage` 96 lines.

Code is duplicated in several places:
- Create and Edit share ≈120 lines (`syncPageImage`, the save-image-only handler, `articleOptions`, the hidden-flag effect, the duplicate check).
- Edit's note-load block appears twice.
- The Text, Image and File tab panels have the same `handleSave`.
- ImageUpload and FileUpload share their `getSaveItems`/`commitSavedFilenames`/`reset` logic.

**Impact:** Fixes such as R1-F5 have to be made in more than one place, and the copies already drift.

**Fix:** Extract a `useNoteEditor` hook (shared by Create and Edit), a `useStorageUploadField` hook (shared by the upload controls) and a single tab-panel save helper.

---

#### R1-F19 — Generic components and utils depend on the Supabase data layer

| | |
|---|---|
| **Severity** | MEDIUM |
| **Domain** | architecture |
| **Fix scope** | M |
| **Location** | `src/components/controls/ImageUpload/ImageUpload.tsx:16-22,125`, `src/utils/clipboard-image-helpers.ts:1,92-94`, `src/utils/clipboard-helpers.ts:1-9`, `src/utils/getErrorMessage.ts:1` |

**Problem:** The dependencies run the wrong way between layers:
- The generic `ImageUpload` control calls `imageSourceToPngBlob`, which downloads from the `clipboard-images` bucket.
- `utils/clipboard-helpers` imports types from `components/controls/*`.
- `getErrorMessage` imports `supabase-utils`, which runs `createClient` at import time, so `ToastProvider` and `GitHubAuthModal` pull in the Supabase client.

**Impact:** The controls and utils can't be reused or unit-tested without Supabase.

**Fix:** Pass a `loadImage` callback into `ImageUpload`. Move the shared types to `src/types`. Move `formatSupabaseError` to a pure module with no client import.

---

#### R1-F20 — `github.service.ts` is a 1113-line god module with hardcoded config

| | |
|---|---|
| **Severity** | MEDIUM |
| **Domain** | architecture |
| **Fix scope** | M |
| **Location** | `src/services/github.service.ts:31-32` (config), 83-200, 374-772, 814-1113 |

**Problem:** One file mixes:
- the HTTP client (`githubFetch`)
- gist CRUD
- pointer-gist reconcile, dedupe and migration logic
- image object-URL handling
- the Notes/Folders API

`POINTER_GIST_ID` and `POINTER_GIST_OWNER` are hardcoded, while Supabase config comes from env. Six exports have no callers: `updatePointerGistHidden`, `syncPointerGistEntry`, `getFolder`, `listNotesInFolder`, `deleteFolder`, `listFolderRevisions`.

**Impact:** It's hard to change or test safely, and the site's identity is baked into the code.

**Fix:** Split it into `github-client.ts`, `pointer-gist.service.ts` and `notes.service.ts`. Move the gist ID and owner to `VITE_` env vars. Delete the dead exports.

---

#### R1-F21 — No automated tests

| | |
|---|---|
| **Severity** | MEDIUM |
| **Domain** | quality |
| **Fix scope** | M |
| **Location** | `package.json` (no test runner); `src/utils/*`, `src/services/github.service.ts`, `src/supabase/supabase-utils.ts` |

**Problem:** There are zero test files and no runner. The pointer-gist reconciliation logic rewrites shared public data with no tests behind it.

**Impact:** Regressions in merge, order and migration logic reach the live site unnoticed.

**Fix:** Add Vitest (it shares the Vite config) and start with the pure functions:
- `pointer-gist-articles` — `mergeArticlesWithGistFilenames`, `migrateLegacyArticles`, `renameArticleInList`
- `article-page-image` — `parseArticlePageImageRecord`, `findOrphanImageFilenames`, `filterArticleTextFilenames`
- `clipboard-helpers`, `getErrorMessage`
- `dedupePointerGistEntries` / `normalizePointerEntryFromGist`
- `splitStorageFilenames` / `syncStorageFiles` (with a mocked client)

---

### Consider

#### R1-F22 — No fetch timeout, retry or rate-limit handling; unhandled `getSession` rejection

| | |
|---|---|
| **Severity** | LOW |
| **Domain** | resilience |
| **Fix scope** | S |
| **Location** | `src/services/github.service.ts:102,108-115,186-199,340,361`, `src/context/SupabaseContext.tsx:28-31` |

**Problem:** Plain `fetch` calls are made with no `AbortSignal`, no retry, and no 403/429 rate-limit handling. `supabase.auth.getSession().then(...)` has no `.catch` and ignores `error`.

**Fix:** Use `AbortSignal.timeout(15000)` in `githubFetch`, add one retry for idempotent GETs, and surface rate-limit reset times. Add `.catch` to `getSession` and set `authLoading` to false there.

---

#### R1-F23 — "Hidden" articles are only hidden in the UI

| | |
|---|---|
| **Severity** | LOW |
| **Domain** | security |
| **Fix scope** | M |
| **Location** | `src/utils/writing-articles.ts:71-79`, `src/services/github.service.ts:38-40,336-362` |

**Problem:** The public pointer gist lists the gist ID and filenames of every hidden article, and anyone can read secret gists by URL.

**Fix:** Treat "hidden" as unlisted, not private. If drafts must stay private, keep hidden entries in a separate secret pointer gist that's only read with the token.

---

#### R1-F24 — Uploads have no size cap or type allow-list; unsandboxed iframe preview

| | |
|---|---|
| **Severity** | LOW |
| **Domain** | security |
| **Fix scope** | S |
| **Location** | `src/components/controls/ImageUpload/ImageUpload.tsx:51-53`, `src/components/controls/FileUpload/FileUpload.tsx:196-217,236,267-272`, `src/supabase/supabase-utils.ts:46-49` |

**Problem:** `file.type.startsWith('image/')` accepts SVG. There's no size limit, `contentType: file.type` trusts the sender, and stored public URLs load in an `<iframe>` with no `sandbox`.

**Fix:** Allow-list the MIME types (drop SVG), cap the size client-side and with bucket `file_size_limit`/`allowed_mime_types`, and add `sandbox` to the iframe.

---

#### R1-F25 — Duplicate `/writing` route metadata; route registries can drift

| | |
|---|---|
| **Severity** | LOW |
| **Domain** | architecture |
| **Fix scope** | S |
| **Location** | `src/routes-data.ts:51,94`, `src/routes.ts:57`, `scripts/generate-routes.ts:64-69` |

**Problem:** `/writing` is defined twice with different `ogTitle`/`ogDescription`. The app uses the first entry, while the generated `dist/writing/index.html` uses the second. `og('/cover-letter-generator')` has no `routesData` entry.

**Fix:** Remove the duplicate, define paths once as constants in `route-paths.ts`, and make `generate-routes.ts` fail on duplicate paths.

---

#### R1-F26 — Two design-token sources

| | |
|---|---|
| **Severity** | LOW |
| **Domain** | architecture |
| **Fix scope** | M |
| **Location** | `src/constants/colours.ts:5-24`, `src/styles/tokens.ts:1-26`, `src/styles/theme.ts:2-3,21` |

**Problem:** `tokens.ts` calls itself the "single source of truth", but `colours.ts` redefines the same hex values under different keys, and 19 TSX files use `colours` against 7 that use the theme.

**Fix:** Derive `colours` from `tokens` (or remove it) and migrate the inline `sx` usages over time.

---

#### R1-F27 — Dead code, plus stale untracked files in the working tree

| | |
|---|---|
| **Severity** | LOW |
| **Domain** | quality, architecture |
| **Fix scope** | S |
| **Location** | `src/context/ClipboardAuthContext.tsx`, `src/components/unused/`, `src/pages/Writing/OpenAi/OpenAi.tsx:4`; untracked: `src/components/{NavBar*,Tile*,Temp,TypedText,PodcastTileList}.*`, `src/constants.tsx`, `src/pages/{Home,Projects}.*` |

**Problem:**
- `ClipboardAuthContext` is an unimported near-copy of `AuthRequestContext`.
- `components/unused/` is still tracked.
- `OpenAi.tsx` is a `//TODO` stub.
- *Uncommitted:* the 16 untracked files (dated 2025-10-21) are pre-refactor copies that commit `3d8c294` deleted. They only import each other and are referenced nowhere else. A `git add -A` would bring them back.
- *Uncommitted:* the YouthWork.tsx change is planning comments only (no functional change).

**Fix:**
```bash
git rm src/context/ClipboardAuthContext.tsx src/components/unused/NavBarHomeLogo.tsx
rm src/components/NavBar*.tsx src/components/NavBar.css src/components/Tile.* src/components/Temp.tsx src/components/TypedText.tsx src/components/PodcastTileList.tsx src/constants.tsx src/pages/Home.tsx src/pages/Home.css src/pages/Projects.tsx
```

---

#### R1-F28 — Suppressed or worked-around hook dependencies

| | |
|---|---|
| **Severity** | LOW |
| **Domain** | quality |
| **Fix scope** | S |
| **Location** | `src/components/controls/ImageUpload/ImageUpload.tsx:168-183`, `src/components/controls/FileUpload/FileUpload.tsx:137,191-195`, `src/hooks/useClickOutside.ts:17`, `src/hooks/useScrollBackground.ts:32-34` |

**Problem:**
- Two effects use a joined-string `initialKey` instead of the real dependencies (2 exhaustive-deps lint warnings).
- `useClickOutside` spreads `...refs` into its deps array (so the array length changes) and disables the lint rule.
- `useScrollBackground` uses `[]` with the rule disabled.
- `useImperativeHandle` in FileUpload has no deps array.

**Fix:** Memoise the inputs or store them in refs, and remove the suppressions.

---

#### R1-F29 — Copy and auth-prompt defects in note and clipboard panels

| | |
|---|---|
| **Severity** | LOW |
| **Domain** | quality |
| **Fix scope** | S |
| **Location** | `src/pages/Home/Notes/EditNoteTabPanel.tsx:299-303,598-609`, `src/pages/Home/Notes/CreateNoteTabPanel.tsx:173`, `src/pages/Home/Clipboard/{Text,Image,File}TabPanel.tsx` |

**Problem:**
- The Section field's validation text reads "Article is required." and "This article has no articles." (left over from the notes→articles rename).
- `performSavePageImageOnly` calls `requestAuth()` when a token exists but there are no image changes.
- The tab panels call `requestAuth()` and then `onSave()`, which calls it again.

**Fix:** Correct the strings ("Section is required.", "This article has no sections."). Show an info toast instead of `requestAuth()` when there's nothing to save. Drop the extra `requestAuth()` from the tab panels.

---

### Architectural Observations

- **Admin tools on the public origin:** should Notes, Clipboard and Cover Letter ship from the portfolio at all, or move to a separate entry or app, with their own provider subtree so Supabase doesn't start a session check on every public visit?
- **Folder taxonomy:** the README describes `components/{controls,display,layout}`, but the code also has `Json`, `auth`, `content` and `unused`. The README tree also lists `Projects/Litter` and `Blog`, while the code has `About/LitterApp` and `Writing`. Update the README, or fold these folders into the taxonomy?
- **Data-access placement:** data access lives in three places: `src/supabase/`, `src/services/` and `src/utils/clipboard-image-helpers.ts`. Consolidate it under `services/`?
- **`NavRoute` type location:** `routes.ts` imports every page, and the components import `NavRoute` back from it, which is a type-only cycle. Move the type to `types/`?
- **Admin-route detection:** `NavBar.tsx:62-63` hardcodes which routes show the auth icon. Would a `requiresAuth` flag on the route definition be cleaner?
- **Gists as a database:** with this much read-modify-write and reconcile logic (R1-F7, R1-F8), is the gist-as-database design still worth it, or should articles move to Supabase (or a repo folder) now that Supabase is already a dependency?

### Positive Observations

- `strict` TypeScript with no `any`, and only one `as T` cast at the fetch boundary.
- No `dangerouslySetInnerHTML`, `innerHTML` or `eval`. All gist and Supabase text renders as React text nodes.
- Every `target='_blank'` link has `rel='noopener noreferrer'`. `spa-redirect.js` rejects `//` paths, so there's no open redirect.
- The `.env` key is a `sb_publishable_` key, not a service-role key. New gists are created secret, and the PAT link requests only the `gist` scope.
- Async effects consistently use `cancelled` flags, and object URLs are revoked carefully, including ones that arrive after cancellation.
- `githubFetch` and `throwIfSupabaseError` centralise error formatting with status, path and `cause`. RLS errors are mapped to friendly messages.
- Writes read the pointer gist through the authenticated API to avoid CDN staleness, and `reconcilePointerGist` is a deliberate self-healing pass.
- Article page images are checked by magic bytes, which rejects SVG. Storage filenames are cleaned of unsafe characters.
- `BusyContext` per-source slots stop concurrent loaders from clearing each other.
- Pure helpers already live in `src/utils`, which makes adding tests straightforward.

### Test Coverage for Changes

| Changed Production File | Tests Added/Updated | Paths Covered | Status |
|------------------------|---------------------|---------------|--------|
| `src/services/github.service.ts` | No | — | Missing |
| `src/utils/pointer-gist-articles.ts` | No | — | Missing |
| `src/utils/article-page-image.ts` | No | — | Missing |
| `src/supabase/supabase-utils.ts` | No | — | Missing |
| `src/pages/Home/Clipboard/useClipboard.ts` | No | — | Missing |
| `src/pages/Home/Notes/*TabPanel.tsx` | No | — | Missing |
| `src/context/*` | No | — | Missing |
| `src/pages/YouthWork/YouthWork.tsx` (uncommitted) | n/a | Comment-only change | n/a |
