# Requirement → implementation

All paths are relative to the project root. “Included” means code is present; see VALIDATION.md for what was actually executed.

| Requirement | Implementation |
| --- | --- |
| Next.js App Router + Tailwind + component library | package.json, app/, globals.css, Base UI in ui-button.tsx |
| Navbar logo, Bengali date, category links, active category, auth menu | components/header.tsx, lib/format.ts |
| Infinite ticker with emoji, unit, price, direction and percentage | components/ticker.tsx, components/catalog-ticker.tsx |
| Hero text, right image, same-page CTA | app/page.tsx, public/bazar-hero.png |
| Top six risers / fallers | lib/catalog-utils.ts, app/page.tsx |
| All products, responsive cards, Bengali digits | components/product-card.tsx, product-grid.tsx, lib/format.ts |
| Card click → product slug route | product-card.tsx, app/product/[slug]/page.tsx |
| Login-protected detail page and server session validation | lib/session.ts, app/product/[slug]/page.tsx |
| Minimum, maximum, average and all market prices | catalog-utils.ts, product/[slug]/page.tsx |
| Category title/icon, sorting, empty state | category/[slug]/page.tsx, components/product-list.tsx |
| Numeric sorting of Bengali numerals | lib/format.ts, catalog-utils.ts, tests/catalog.test.ts |
| Loading skeleton Home/Category | app/loading.tsx, category/[slug]/loading.tsx |
| Signup form, validation, redirect to signin | components/auth-form.tsx, app/signup/page.tsx |
| Signin form, errors, success → home | components/auth-form.tsx, app/signin/page.tsx |
| Google and GitHub login via Better Auth | lib/auth.ts, components/auth-form.tsx |
| Auth, logout, validation and protected-route toast | providers.tsx, header.tsx, auth-form.tsx, auth-status-toast.tsx |
| No email verification or forgot-password flow | lib/auth.ts, auth-form.tsx |
| Profile + separate name update route | app/profile/, update-profile-form.tsx |
| Better Auth updateUser | components/update-profile-form.tsx |
| Footer copy/layout | components/footer.tsx |
| Mobile/tablet/desktop layouts | app/globals.css |
| Unknown route/category/product friendly 404 | app/not-found.tsx, category/product page validation |
| Dynamic-route refresh compatible with Next.js deployment | App Router routes; no static export configuration |
| README with technologies and at least 5 features | README.md |
| At least 8 meaningful commits | Included local .git history; git log --oneline |
| Deployment and submission links | README deployment instructions; actual deployment still pending |

Additional completion support: START_WINDOWS.bat, VERIFY_WINDOWS.bat, scripts/setup.mjs, compose.yaml, playwright.config.ts, e2e/bazardor.spec.ts and .github/workflows/verify.yml. See VALIDATION.md for executed versus blocked checks.
