# FormPanel & ActionConfig Design

**Date:** 2026-08-06  
**Status:** Approved

---

## Goal

Introduce a generic `FormPanel` layout component and an `ActionConfig` type that replaces ad-hoc `ReactNode` button slots across the app. The result is a consistent, config-driven pattern for rendering action toolbars and form-panel layouts — matching the data-driven spirit of the existing `JsonPanel`/`JsonSection` system.

---

## New Type: `ActionConfig`

Defined in `src/types/basic.types.ts`.

```ts
interface ActionConfig {
  id: string;
  label: string;
  variant: 'outlined' | 'contained';
  onClick: () => void;
  icon?: React.ReactElement;
  disabled?: boolean;
  hidden?: boolean;       // declaratively hides the button (replaces ternary JSX)
  mobileIconOnly?: boolean;
}
```

`hidden` is the key addition over the existing `ActionButtonProps` — it replaces patterns like `{hasContent && <ClearButton />}` with a declarative flag.

A `renderActions(configs: ActionConfig[])` helper (co-located with `ActionButton`) filters out hidden items and maps each to an `<ActionButton>`.

---

## New Type: `HeaderActions`

A union type that defaults arrays to the `end` (right) slot:

```ts
type HeaderActions =
  | ActionConfig[]                                       // shorthand → all go to end
  | { start?: ActionConfig[]; end?: ActionConfig[] }     // explicit both sides
```

A `resolveHeaderActions` helper normalises both forms to `{ start: ActionConfig[], end: ActionConfig[] }`:

```ts
function resolveHeaderActions(h?: HeaderActions) {
  if (!h) return { start: [], end: [] };
  if (Array.isArray(h)) return { start: [], end: h };
  return { start: h.start ?? [], end: h.end ?? [] };
}
```

---

## New Component: `FormPanel`

Location: `src/components/layout/FormPanel/FormPanel.tsx`

### Props

```ts
interface FormPanelProps {
  header?: string;                  // optional title row
  headerActions?: HeaderActions;    // toolbar above content
  children: React.ReactNode;        // form body
  footerActions?: ActionConfig[];   // row of actions below content (e.g. Cancel + Save)
}
```

### Layout

```
┌─────────────────────────────────────────────┐
│ [header text]                                │  ← optional, only rendered if header set
├──────────────────────────────────────────────┤
│ [start actions]        [end actions]         │  ← only rendered if headerActions set
├──────────────────────────────────────────────┤
│                                              │
│  children (form content)                     │
│                                              │
├──────────────────────────────────────────────┤
│                    [Cancel]  [Save]          │  ← only rendered if footerActions set
└──────────────────────────────────────────────┘
```

- The consumer decides whether to wrap `FormPanel` in a MUI `Dialog` (modal) or render it inline.
- `FormPanel` owns only the inner layout — no Dialog shell.

---

## Migrations

### `ActionsPanel` → `FormPanel`

`ActionsPanel` is deprecated in favour of `FormPanel`.

| Old prop | New equivalent |
|---|---|
| `onRefresh` | `headerActions={{ start: [refreshConfig] }}` |
| `leadingActions?: ReactNode` | `headerActions={{ start: [...] }}` |
| `actions?: ReactNode` | `headerActions={[...]}` or `headerActions={{ end: [...] }}` |
| `children` | `children` |

`ActionsPanel` can be kept as a thin compatibility shim during migration, or callers updated directly.

### `AuthModal`

`AuthModal` restructures its `DialogContent` to use `FormPanel` internally:

- No `header` needed (the `DialogTitle` above already serves this role, or move it into `FormPanel`'s `header` prop and drop `DialogTitle`).
- No `headerActions`.
- `footerActions` — two entries: Cancel and Sign in / Close and Sign out.

### `ClipboardButtons.tsx`

`ClipboardTabActions`, `ClipboardClearButton`, `ClipboardSaveButton`, `ClipboardUploadButton` are all deleted. Their logic moves inline into the tab panel files as `ActionConfig` arrays:

**TextTabPanel example:**
```ts
const headerActions: HeaderActions = {
  start: [
    { id: 'refresh', label: 'Refresh', variant: 'outlined', icon: <RefreshIcon />, onClick: onRefresh },
  ],
  end: [
    { id: 'clear', label: 'Clear', variant: 'outlined', onClick: onClear, hidden: !hasContent },
    { id: 'save', label: 'Save', variant: 'contained', onClick: onSave, disabled: hasNoTextChanges },
  ],
};
```

**ImageTabPanel / FileTabPanel example:**
```ts
const headerActions: HeaderActions = {
  start: [
    { id: 'refresh', label: 'Refresh', variant: 'outlined', icon: <RefreshIcon />, onClick: onRefresh },
    { id: 'upload', label: 'Upload', variant: 'contained', icon: <UploadIcon />, onClick: triggerUpload },
  ],
  end: [
    { id: 'clear', label: 'Clear', variant: 'outlined', onClick: onClear, hidden: !hasContent },
    { id: 'save', label: 'Save', variant: 'contained', onClick: onSave, disabled: hasNoChanges },
  ],
};
```

### `JsonPanelData` — Phase 2 (optional)

Add `kind: 'form'` to the union in `JsonPanel.tsx`:

```ts
interface JsonFormPanelData {
  kind: 'form';
  header?: string;
  headerActions?: HeaderActions;
  content: React.ReactNode;      // forms remain ReactNode
  footerActions?: ActionConfig[];
}
```

This allows `JsonSection`-driven pages to embed a form panel alongside `kind: 'text'`, `'image-text'`, `'tabs'` panels. Phase 2 is optional — `FormPanel` has full value as a standalone component.

---

## Files Affected

### New
- `src/components/layout/FormPanel/FormPanel.tsx`
- `src/components/layout/FormPanel/FormPanel.css` (if layout styles needed)

### Modified
- `src/types/basic.types.ts` — add `ActionConfig`, `HeaderActions`
- `src/components/controls/ActionButton/ActionButton.tsx` — add `renderActions` helper; export `ActionConfig` (or keep it in `basic.types.ts` and import)
- `src/components/layout/ActionsPanel/ActionsPanel.tsx` — migrate to `FormPanel` or deprecate
- `src/components/auth/AuthModal.tsx` — use `FormPanel` internally
- `src/pages/Projects/Clipboard/TextTabPanel.tsx` — use `FormPanel`, inline action configs
- `src/pages/Projects/Clipboard/ImageTabPanel.tsx` — same
- `src/pages/Projects/Clipboard/FileTabPanel.tsx` — same

### Deleted
- `src/pages/Projects/Clipboard/ClipboardButtons.tsx`

---

## Out of Scope

- `kind: 'form'` in `JsonPanelData` (Phase 2)
- Any undo/redo or optimistic-save behaviour
- Icon registry (icons remain `React.ReactElement`, not string IDs)
