# emre-toast

Premium React toast notifications for real-time and interaction-heavy apps.

- Zero runtime dependencies
- Streaming and progress updates
- Stacked/expand-on-hover interactions
- Undo countdown, grouping, and movable mode

## Install

```bash
npm install @emrelutfi/emre-toast
# or
pnpm add @emrelutfi/emre-toast
```

## Quick Start

```tsx
import { Toaster, toast } from "@emrelutfi/emre-toast";
import "@emrelutfi/emre-toast/styles.css";

export default function App() {
  return (
    <>
      <button onClick={() => toast.success("Saved!")}>Save</button>
      <Toaster position="bottom-right" closeButton />
    </>
  );
}
```

## API

`emre-toast` exports both branded and familiar names:

- `Toaster` and `toast`
- `EmreToaster` and `emreToast`
- `useEmreToast`

## Core Examples

### Streaming update in place

```tsx
const id = toast.loading("Analyzing...");
toast.update(id, { title: "Found 3 issues" });
toast.update(id, { type: "success", title: "Done" });
```

### Undo countdown

```tsx
toast.undo("Email archived", {
  onUndo: () => restoreEmail(),
  countdown: 5000,
});
```

### Progress toast

```tsx
const id = toast.progress("Uploading...", { progress: 0 });
toast.update(id, { progress: 75 });
toast.update(id, { type: "success", title: "Upload complete" });
```

### Grouping bursts

```tsx
toast.success("File saved", { groupKey: "file-save" });
toast.success("File saved", { groupKey: "file-save" });
```

## Why This Library

emre-toast is built for apps where notifications are part of core UX, not just decoration. If your product has streaming states, frequent background events, or undo-heavy workflows, this package gives you strong defaults with simple APIs.

## Local Development

```bash
pnpm dev:web
```

This runs the docs/demo site locally.

## License

MIT
