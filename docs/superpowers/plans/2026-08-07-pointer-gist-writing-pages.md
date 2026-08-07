# Pointer Gist — Writing Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire `Analog` and `Bannjan` writing pages to fetch and display content from their respective GitHub gists, using a public pointer gist as an indirection layer so the pages survive gist-ID churn caused by visibility changes.

**Architecture:** A public "pointer gist" (`7d48f1881df7e46bf6e0425b50666131`) stores a JSON file `PointerGistIDs` mapping page keys to current gist IDs. Writing pages use a `usePointerGistContent(pageKey)` hook that performs the two-step unauthenticated fetch (pointer gist → content gist). When a note's visibility changes and the service deletes+recreates a gist, `updatePointerGistId` patches the pointer gist with the new ID. All reads by writing pages are unauthenticated; pointer gist writes use the authenticated `githubFetch` helper.

**Tech Stack:** React 18, TypeScript, Vite, MUI v5, `github.service.ts` (plain `fetch` for unauthenticated calls, `githubFetch` helper for authenticated calls)

## Global Constraints

- No test framework present — verify each task with `npm run lint` and manual browser check on `localhost:5173`
- All new TypeScript must pass `npm run lint` (zero warnings, zero errors)
- No new npm dependencies
- Pointer gist ID constant: `7d48f1881df7e46bf6e0425b50666131`
- Pointer gist filename: `PointerGistIDs`
- `fetchPointerGistIds` and `fetchPublicGistFiles` must NOT use the `githubFetch` helper — they use plain `fetch` with no auth header
- `colours` import path from writing pages: `'../../../constants/colours'`
- `JsonSection` import path from writing pages: `'../../../components/Json/JsonSection/JsonSection'`
- `JsonImageTextPanel` type import path: `'../../../components/Json/JsonSection/JsonPanel'`

---

### Task 1: Migrate pointer gist to JSON + add service constants and unauthenticated fetch functions

**Files:**
- Modify: `src/services/github.service.ts` (add constant + two exported functions near top, after existing imports)

**Interfaces:**
- Produces:
  - `POINTER_GIST_ID: string` (module-level constant, not exported)
  - `POINTER_GIST_FILENAME: string` (module-level constant, not exported)
  - `export async function fetchPointerGistIds(): Promise<Record<string, string>>`
  - `export async function fetchPublicGistFiles(gistId: string): Promise<Array<{ filename: string; content: string }>>`

- [ ] **Step 1: Migrate the pointer gist file to JSON**

  Open https://gist.github.com/dalapto/7d48f1881df7e46bf6e0425b50666131 in a browser, click "Edit", and replace the content of `PointerGistIDs` with the following, then click "Update public gist":

  ```json
  {
    "Analog": "efa92ac12875415bc2a0fa63ccb246b1",
    "Bannjan": "fb7e16ee5a0d62137828276c9db217d3"
  }
  ```

- [ ] **Step 2: Add the pointer gist constants to `github.service.ts`**

  Open `src/services/github.service.ts`. After the `const GITHUB_API_BASE` line add:

  ```ts
  const POINTER_GIST_ID = '7d48f1881df7e46bf6e0425b50666131';
  const POINTER_GIST_FILENAME = 'PointerGistIDs';
  ```

- [ ] **Step 3: Add `fetchPointerGistIds`**

  Add this exported function after the `deleteGist` function (around line 118):

  ```ts
  export async function fetchPointerGistIds(): Promise<Record<string, string>> {
  	const res = await fetch(`${GITHUB_API_BASE}/gists/${POINTER_GIST_ID}`, {
  		headers: { Accept: 'application/vnd.github+json' },
  	});
  	if (!res.ok) throw new Error(`Failed to fetch pointer gist: ${res.status}`);
  	const gist: Gist = await res.json() as Gist;
  	const file = gist.files[POINTER_GIST_FILENAME];
  	if (!file?.content) throw new Error('PointerGistIDs file missing or empty');
  	return JSON.parse(file.content) as Record<string, string>;
  }
  ```

- [ ] **Step 4: Add `fetchPublicGistFiles`**

  Add this exported function immediately after `fetchPointerGistIds`:

  ```ts
  export async function fetchPublicGistFiles(
  	gistId: string,
  ): Promise<Array<{ filename: string; content: string }>> {
  	const res = await fetch(`${GITHUB_API_BASE}/gists/${gistId}`, {
  		headers: { Accept: 'application/vnd.github+json' },
  	});
  	if (!res.ok) throw new Error(`Failed to fetch gist ${gistId}: ${res.status}`);
  	const gist: Gist = await res.json() as Gist;
  	return Object.values(gist.files)
  		.map((file) => ({ filename: file.filename, content: file.content ?? '' }))
  		.sort((a, b) => a.filename.localeCompare(b.filename));
  }
  ```

- [ ] **Step 5: Run lint**

  ```bash
  npm run lint
  ```

  Expected: 0 errors, 0 warnings.

- [ ] **Step 6: Commit**

  ```bash
  git add src/services/github.service.ts
  git commit -m "feat: add fetchPointerGistIds and fetchPublicGistFiles to github.service"
  ```

---

### Task 2: Add `updatePointerGistId` + wire into visibility-change paths

**Files:**
- Modify: `src/services/github.service.ts`

**Interfaces:**
- Consumes: `fetchPointerGistIds(): Promise<Record<string, string>>` (Task 1), `githubFetch<T>`, `POINTER_GIST_ID`, `POINTER_GIST_FILENAME`, existing `Gist` interface
- Produces: `updatePointerGistId(token: string, oldId: string, newId: string): Promise<void>` (not exported — internal only)

- [ ] **Step 1: Add `updatePointerGistId` function**

  Add this non-exported function immediately after `fetchPublicGistFiles`:

  ```ts
  async function updatePointerGistId(
  	token: string,
  	oldId: string,
  	newId: string,
  ): Promise<void> {
  	const ids = await fetchPointerGistIds();
  	const entry = Object.entries(ids).find(([, v]) => v === oldId);
  	if (!entry) return;
  	const updated = { ...ids, [entry[0]]: newId };
  	await githubFetch<Gist>(token, `/gists/${POINTER_GIST_ID}`, {
  		method: 'PATCH',
  		headers: { 'Content-Type': 'application/json' },
  		body: JSON.stringify({
  			files: {
  				[POINTER_GIST_FILENAME]: {
  					content: JSON.stringify(updated, null, 2),
  				},
  			},
  		}),
  	});
  }
  ```

- [ ] **Step 2: Wire into `saveNote` — after `deleteGist`**

  In `saveNote`, find this block (around line 350):

  ```ts
  		const newGist = await createGist(token, {
  			description: folderName,
  			files: allFiles,
  			isPublic: input.isPublic,
  		});
  		await deleteGist(token, existing.id);

  		return {
  			folderId: newGist.id,
  ```

  Add the `updatePointerGistId` call between the `deleteGist` line and the `return`:

  ```ts
  		const newGist = await createGist(token, {
  			description: folderName,
  			files: allFiles,
  			isPublic: input.isPublic,
  		});
  		await deleteGist(token, existing.id);
  		await updatePointerGistId(token, existing.id, newGist.id).catch((err) =>
  			console.warn('Pointer gist update failed:', err),
  		);

  		return {
  			folderId: newGist.id,
  ```

- [ ] **Step 3: Wire into `updateNote` — after `deleteGist`**

  In `updateNote`, find the visibility-change delete+create block (around line 221–233). It looks like:

  ```ts
  		const newGist = await createGist(token, {
  			description: sourceFolderName,
  			files: allFiles,
  			isPublic: input.isPublic,
  		});
  		await deleteGist(token, input.folderId);

  		return {
  			folderId: newGist.id,
  ```

  Add the call between `deleteGist` and `return`:

  ```ts
  		const newGist = await createGist(token, {
  			description: sourceFolderName,
  			files: allFiles,
  			isPublic: input.isPublic,
  		});
  		await deleteGist(token, input.folderId);
  		await updatePointerGistId(token, input.folderId, newGist.id).catch((err) =>
  			console.warn('Pointer gist update failed:', err),
  		);

  		return {
  			folderId: newGist.id,
  ```

- [ ] **Step 4: Run lint**

  ```bash
  npm run lint
  ```

  Expected: 0 errors, 0 warnings.

- [ ] **Step 5: Commit**

  ```bash
  git add src/services/github.service.ts
  git commit -m "feat: add updatePointerGistId and wire into visibility-change paths"
  ```

---

### Task 3: Create `usePointerGistContent` hook

**Files:**
- Create: `src/hooks/usePointerGistContent.ts`

**Interfaces:**
- Consumes:
  - `fetchPointerGistIds(): Promise<Record<string, string>>` from `'../services/github.service'`
  - `fetchPublicGistFiles(gistId: string): Promise<Array<{ filename: string; content: string }>>` from `'../services/github.service'`
- Produces:
  ```ts
  interface PointerGistFile { filename: string; content: string; }
  interface UsePointerGistContentResult { files: PointerGistFile[]; loading: boolean; error: string | null; }
  function usePointerGistContent(pageKey: string): UsePointerGistContentResult
  ```

- [ ] **Step 1: Create the hook file**

  Create `src/hooks/usePointerGistContent.ts` with this content:

  ```ts
  import { useEffect, useState } from 'react';
  import {
  	fetchPointerGistIds,
  	fetchPublicGistFiles,
  } from '../services/github.service';

  interface PointerGistFile {
  	filename: string;
  	content: string;
  }

  interface UsePointerGistContentResult {
  	files: PointerGistFile[];
  	loading: boolean;
  	error: string | null;
  }

  function usePointerGistContent(pageKey: string): UsePointerGistContentResult {
  	const [files, setFiles] = useState<PointerGistFile[]>([]);
  	const [loading, setLoading] = useState(true);
  	const [error, setError] = useState<string | null>(null);

  	useEffect(() => {
  		let cancelled = false;

  		async function load() {
  			try {
  				const ids = await fetchPointerGistIds();
  				const gistId = ids[pageKey];
  				if (!gistId) {
  					if (!cancelled) setError(`No gist registered for "${pageKey}"`);
  					return;
  				}
  				const fetched = await fetchPublicGistFiles(gistId);
  				if (!cancelled) setFiles(fetched);
  			} catch (err) {
  				if (!cancelled)
  					setError(
  						err instanceof Error ? err.message : 'Failed to load content',
  					);
  			} finally {
  				if (!cancelled) setLoading(false);
  			}
  		}

  		void load();
  		return () => {
  			cancelled = true;
  		};
  	}, [pageKey]);

  	return { files, loading, error };
  }

  export { usePointerGistContent };
  export type { PointerGistFile, UsePointerGistContentResult };
  ```

- [ ] **Step 2: Run lint**

  ```bash
  npm run lint
  ```

  Expected: 0 errors, 0 warnings.

- [ ] **Step 3: Commit**

  ```bash
  git add src/hooks/usePointerGistContent.ts
  git commit -m "feat: add usePointerGistContent hook"
  ```

---

### Task 4: Implement `Analog/Analog.tsx`

**Files:**
- Modify: `src/pages/Writing/Analog/Analog.tsx` (replace stub)

**Interfaces:**
- Consumes:
  - `usePointerGistContent(pageKey: string): { files: PointerGistFile[]; loading: boolean; error: string | null }` from `'../../../hooks/usePointerGistContent'`
  - `JsonSection` from `'../../../components/Json/JsonSection/JsonSection'`
  - `JsonImageTextPanel` type from `'../../../components/Json/JsonSection/JsonPanel'`
  - `colours` from `'../../../constants/colours'`
  - `CircularProgress` from `'@mui/material'`

- [ ] **Step 1: Replace the stub**

  Replace the entire contents of `src/pages/Writing/Analog/Analog.tsx` with:

  ```tsx
  import { CircularProgress } from '@mui/material';
  import React from 'react';
  import type { JsonImageTextPanel } from '../../../components/Json/JsonSection/JsonPanel';
  import { JsonSection } from '../../../components/Json/JsonSection/JsonSection';
  import { colours } from '../../../constants/colours';
  import { usePointerGistContent } from '../../../hooks/usePointerGistContent';

  const PAGE_KEY = 'Analog';

  function Analog() {
  	const { files, loading, error } = usePointerGistContent(PAGE_KEY);

  	if (loading) {
  		return (
  			<div style={{ display: 'flex', justifyContent: 'center', paddingTop: '8rem' }}>
  				<CircularProgress />
  			</div>
  		);
  	}

  	if (error) {
  		return (
  			<div
  				style={{
  					display: 'flex',
  					justifyContent: 'center',
  					paddingTop: '8rem',
  					color: colours.error,
  				}}
  			>
  				{error}
  			</div>
  		);
  	}

  	const headerPanel: JsonImageTextPanel = {
  		kind: 'image-text',
  		header: { titleText: PAGE_KEY },
  		content: [],
  	};

  	const filePanels: JsonImageTextPanel[] = files.map((file) => ({
  		kind: 'image-text',
  		header: { titleText: file.filename.replace(/\.txt$/i, '') },
  		content: file.content.split('\n'),
  		contentBackground: colours.primary,
  	}));

  	return <JsonSection items={[headerPanel, ...filePanels]} gap='6rem' />;
  }

  export { Analog };
  ```

- [ ] **Step 2: Run lint**

  ```bash
  npm run lint
  ```

  Expected: 0 errors, 0 warnings.

- [ ] **Step 3: Verify in browser**

  - Run `npm run dev` (already running at `localhost:5173`)
  - Navigate to the Analog writing page
  - Expected: spinner while loading, then page title "Analog" followed by one section per gist file, each with a header and plain-text content

- [ ] **Step 4: Commit**

  ```bash
  git add src/pages/Writing/Analog/Analog.tsx
  git commit -m "feat: implement Analog writing page with pointer gist lookup"
  ```

---

### Task 5: Implement `Bannjan/Bannjan.tsx` + delete old analog stub

**Files:**
- Modify: `src/pages/Writing/Bannjan/Bannjan.tsx` (replace stub)
- Delete: `src/pages/Writing/analog/analog.tsx` (superseded lowercase stub)

**Interfaces:**
- Consumes: same as Task 4 — `usePointerGistContent`, `JsonSection`, `JsonImageTextPanel`, `colours`, `CircularProgress`

- [ ] **Step 1: Replace the Bannjan stub**

  Replace the entire contents of `src/pages/Writing/Bannjan/Bannjan.tsx` with:

  ```tsx
  import { CircularProgress } from '@mui/material';
  import React from 'react';
  import type { JsonImageTextPanel } from '../../../components/Json/JsonSection/JsonPanel';
  import { JsonSection } from '../../../components/Json/JsonSection/JsonSection';
  import { colours } from '../../../constants/colours';
  import { usePointerGistContent } from '../../../hooks/usePointerGistContent';

  const PAGE_KEY = 'Bannjan';

  function Bannjan() {
  	const { files, loading, error } = usePointerGistContent(PAGE_KEY);

  	if (loading) {
  		return (
  			<div style={{ display: 'flex', justifyContent: 'center', paddingTop: '8rem' }}>
  				<CircularProgress />
  			</div>
  		);
  	}

  	if (error) {
  		return (
  			<div
  				style={{
  					display: 'flex',
  					justifyContent: 'center',
  					paddingTop: '8rem',
  					color: colours.error,
  				}}
  			>
  				{error}
  			</div>
  		);
  	}

  	const headerPanel: JsonImageTextPanel = {
  		kind: 'image-text',
  		header: { titleText: PAGE_KEY },
  		content: [],
  	};

  	const filePanels: JsonImageTextPanel[] = files.map((file) => ({
  		kind: 'image-text',
  		header: { titleText: file.filename.replace(/\.txt$/i, '') },
  		content: file.content.split('\n'),
  		contentBackground: colours.primary,
  	}));

  	return <JsonSection items={[headerPanel, ...filePanels]} gap='6rem' />;
  }

  export { Bannjan };
  ```

- [ ] **Step 2: Delete the old lowercase analog stub**

  Delete `src/pages/Writing/analog/analog.tsx`. Check if the `analog/` directory is now empty and delete it too if so:

  ```bash
  git rm src/pages/Writing/analog/analog.tsx
  # If the directory is now empty, it will be removed automatically by git
  ```

  Verify no other file in the project imports from `./analog/analog` or `../analog/analog`:

  ```bash
  # In your editor or terminal search for any import referencing the old path
  # Expected: no results
  ```

- [ ] **Step 3: Run lint**

  ```bash
  npm run lint
  ```

  Expected: 0 errors, 0 warnings.

- [ ] **Step 4: Verify in browser**

  - Navigate to the Bannjan writing page
  - Expected: spinner while loading, then "Bannjan" title followed by one section per gist file with header and plain-text content

- [ ] **Step 5: Commit**

  ```bash
  git add src/pages/Writing/Bannjan/Bannjan.tsx
  git commit -m "feat: implement Bannjan writing page with pointer gist lookup"
  git commit -m "chore: delete superseded analog lowercase stub" -- src/pages/Writing/analog/
  ```

  Or combine both into one commit:

  ```bash
  git add src/pages/Writing/Bannjan/Bannjan.tsx
  git rm src/pages/Writing/analog/analog.tsx
  git commit -m "feat: implement Bannjan writing page; remove old analog stub"
  ```
