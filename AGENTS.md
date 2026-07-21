<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project structure

Every page is a folder under `src/app/(app)/`, with that page's components
colocated beside its `page.tsx`. Only `page.tsx` and `route.ts` make a folder
routable, so any other file in there is safe.

```
src/app/
├─ page.tsx                    redirects "/" → "/dashboard"
└─ (app)/                      route group: everything inside gets the shell
   ├─ layout.tsx               sidebar + header + mobile tabs
   ├─ parts.tsx                small pieces shared by pages in the group
   └─ dashboard/
      ├─ page.tsx              the page: data loading + layout only
      ├─ groups-card.tsx       one file per card/section
      └─ charts.tsx
```

- Page-specific components go in the page's folder, **not** `src/components/`.
- `src/components/` is for shell and shared UI only: `app-shell`, `header`,
  `app-sidebar`, `mobile-nav`, `notifications`, `icons`, `ui/`.
- Routes that must render without the shell (login, register) go outside
  `(app)`.
- The sidebar is driven by `src/lib/nav.ts` — add the route there too, or it
  will not appear in the nav.

# Code style

- Keep files small. When a component passes ~150 lines, move a card or section
  into its own colocated file.
- `async`/`await` with `try`/`catch`. No `.then().catch()` chains.
- Every form uses **react-hook-form** with validation.
- Plain syntax over clever syntax: no comma expressions, no `??=` tricks. Name
  the helper instead of repeating inline maths.
- API calls go through the axios instance in `src/lib/api.ts`, which attaches
  the token and retries once on 401. Do not call `fetch` directly.
- The API base URL lives only in `.env.local`. Never hard-code it.
