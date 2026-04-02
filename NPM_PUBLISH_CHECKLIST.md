# npm Publish Checklist

Use this checklist before `npm publish`.

## Package Integrity

- [ ] `pnpm --filter @emrelutfi/emre-toast build` succeeds
- [ ] `dist/` contains updated JS + types + styles
- [ ] `README.md` examples compile with current exports
- [ ] `package.json` version bumped
- [ ] `package.json` metadata is accurate (description, keywords, homepage, bugs)

## Install Validation

- [ ] Create a fresh Next.js test app
- [ ] Install from local tarball (`npm pack`) or published version
- [ ] Render `<Toaster />` and trigger `toast.success`
- [ ] Validate `stream`, `progress`, and `undo` examples

## Docs and Launch

- [ ] Docs site screenshots updated
- [ ] One short demo video exported
- [ ] LinkedIn launch post drafted
- [ ] daily.dev article drafted
- [ ] Changelog/release notes prepared

## Publish Commands

```bash
pnpm --filter @emrelutfi/emre-toast build
cd packages/emre-toast
npm publish --access public
```
