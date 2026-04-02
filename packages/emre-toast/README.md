# @emrelutfi/emre-toast

TypeScript-first React toast notifications with streaming updates, progress, undo countdown, and premium stacked UX.

## Install

```bash
npm install @emrelutfi/emre-toast
# or
pnpm add @emrelutfi/emre-toast
# or
yarn add @emrelutfi/emre-toast
```

## Quick Start

```tsx
import { Toaster, toast } from "@emrelutfi/emre-toast";
import "@emrelutfi/emre-toast/styles.css";

export default function App() {
  return (
    <>
      <button onClick={() => toast.success("Saved successfully")}>Save</button>
      <Toaster position="bottom-right" closeButton />
    </>
  );
}
```

## Why Use It

- Smooth stacked notifications with expand-on-hover behavior
- In-place streaming and progress updates
- Built-in undo countdown flow
- Promise lifecycle helpers
- Zero runtime dependencies
- Works with React 18+

## API

Main exports:

- `Toaster` (alias of `EmreToaster`)
- `toast` (alias of `emreToast`)
- `useEmreToast`

Toast methods:

- `toast("Message", options?)`
- `toast.success("Message", options?)`
- `toast.error("Message", options?)`
- `toast.warning("Message", options?)`
- `toast.info("Message", options?)`
- `toast.loading("Message", options?)`
- `toast.update(id, updates)`
- `toast.dismiss(id)`
- `toast.promise(promise, { loading, success, error })`
- `toast.progress("Uploading...", { progress: 0 })`
- `toast.stream("Generating...", { onStream })`
- `toast.undo("Item archived", { onUndo, countdown })`

## Patterns

### Update a toast in place

```tsx
const id = toast.loading("Analyzing...");

setTimeout(() => {
  toast.update(id, { title: "Checking dependencies..." });
}, 800);

setTimeout(() => {
  toast.update(id, { type: "success", title: "Analysis completed" });
}, 1800);
```

### Promise workflow

```tsx
await toast.promise(fetch("/api/save"), {
  loading: "Saving...",
  success: "Saved",
  error: "Save failed",
});
```

### Progress workflow

```tsx
const id = toast.progress("Uploading...", { progress: 0 });

toast.update(id, { progress: 35 });
toast.update(id, { progress: 78 });
toast.update(id, { type: "success", title: "Upload complete", progress: 100 });
```

### Undo workflow

```tsx
toast.undo("Email archived", {
  countdown: 5000,
  onUndo: () => restoreEmail(),
});
```

### Group repeated events

```tsx
toast.success("File saved", { groupKey: "file-save" });
toast.success("File saved", { groupKey: "file-save" });
```

## Toaster Options

```tsx
<Toaster
  position="top-right"
  theme="system"
  maxVisible={4}
  animation="slide"
  closeButton
  expand
  movable
/>
```

## Styling

Default styles are shipped in `@emrelutfi/emre-toast/styles.css`.

For per-toast customization, pass:

- `classNames`
- `fillColor`
- `borderColor`
- `borderWidth`
- `icon`
- `avatar`

## License

MIT
