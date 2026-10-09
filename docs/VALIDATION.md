# Validation results — 9 October 2026

## Passed

- `npm test`: **11 tests passed, 0 failed**.
- Dataset checks: 33 distinct product slugs, 8 categories, all 33 products mapped to categories, and 12 markets per product; every market minimum is at most its maximum.
- Sorting tests: mixed Bengali prices including `৯৯`, `১৪৮`, `১,৮৫০`; ascending/descending numeric order and input-order preservation.
- Top movers: six in each direction, largest absolute percentage changes first; flat products excluded.
- Market statistics: known examples, empty-market handling and first supplied product's extremes.
- Bengali digits/units and Dhaka timezone formatting.
- ESLint: no errors or warnings after the final fixes.
- TypeScript syntax transpilation: all source/test TS/TSX files processed without syntax diagnostics.
- Strict upstream-data validation rejects malformed prices instead of converting them to zero, duplicate products/categories and reversed market ranges.
- Setup-script test verifies secret generation, no secret output, repeat-run idempotence and preservation of existing connection settings.
- Playwright test discovery succeeded: **27 test cases** across three viewport profiles. These cases were listed, not executed.
- Compose and GitHub Actions YAML syntax parsed successfully.
- Supplied logo and hero image inspected; actual source images are included and used in their navbar/hero positions.

## Atlas provisioning update

Created the free BazarDor Atlas cluster and verified a database-list operation through the MongoDB integration. The Next.js app still needs its own database user and network access; see ATLAS_STATUS.md. Added a regression assertion confirming that setup produces exactly one secret entry; it passes. The existing replacement logic already behaved correctly.

## Blocked, not passed

- npm dependency installation: the execution environment returned **403 Forbidden** for the npm registry request for `@better-auth/mongo-adapter`; a fresh retry for `better-auth` was also denied on this update.
- Production `npm run build`: stopped at unresolved packages because Better Auth, its MongoDB adapter/driver and react-hot-toast could not be installed here. This is **not** a successful production build.
- Full `npm run typecheck`: reported unresolved modules from those unavailable dependencies. It must be repeated after a normal npm install. Syntax-only transpilation does not replace type checking.
- Live primary/alternate API access was blocked here. The supplied JSON was checked instead; live API responses were not verified.
- Database-backed signup/signin/logout/profile persistence: needs a MongoDB connection and auth secret, which were not provided.
- Google/GitHub OAuth: implementation is included; actual provider keys and callback registration are required.
- Responsive browser screenshots and end-to-end UI testing: not completed. A direct Chromium launch failed because its executable is not installed in this environment. Breakpoints and layouts are implemented, but are not a substitute for browser validation.
- Vercel deployment and direct-refresh tests: not performed; no deployment URL/account was configured.
- Pixel-perfect comparison with a rendered full-size Figma screen: not established. The supplied Penpot geometry, tokens, text, images and Figma thumbnail informed the implementation.

## Included in version 1.1

Windows launch/verification scripts, safe local setup, optional Docker MongoDB, self-hosted Hind Siliguri dependency, strict API response validation, real MongoDB Playwright test definitions and an automated GitHub Actions workflow. No authentication package or database was replaced with a fake implementation.

## Before submission

Install packages on your machine, configure `.env.local`, run the checks in the README and finish `SUBMISSION_CHECKLIST.md`. This delivery is the full source implementation and setup guide, not a verified deployed submission.

## Version 1.2 language update

- 14 unit tests pass, including English coverage of every supplied product/category/market/division, translation-key coverage, locale normalization, numeric/unit/date formatting.
- ESLint passes. Full TypeScript check still stops on the unavailable Better Auth/MongoDB/toast imports in this workspace.
- Language persistence/navigation browser tests added for all three configured viewport profiles, but not executed here. Production build and browser visual validation remain unverified.
- Private environment files are excluded from this update; retain the working local MongoDB settings on your PC.
