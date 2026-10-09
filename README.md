# 🛒 বাজার দর · BazarDor

A responsive Bengali market-price website for Assignment 07. Browse daily prices, compare price changes and inspect market-specific prices after signing in.

## Technology

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Base UI, Better Auth, MongoDB and react-hot-toast. Prices come from the two supplied BazarDor APIs. MongoDB stores authentication users, accounts and sessions.

## Features

1. Reference-based two-row navbar with logo, Dhaka date in Bengali and active category navigation.
2. Seamless price ticker with emoji, price/unit, change percentages and a pause button.
3. Hero using the supplied illustration; its CTA scrolls to `#সব-পণ্য` on the same page.
4. Top six price risers and fallers, all 33 supplied products, search and responsive cards.
5. Category pages with numeric price sorting, including Bengali numerals.
6. Server-validated, login-protected product details: min/max/average prices and all 12 markets.
7. Better Auth email/password, Google and GitHub sign-in; signup redirects to signin, login to home.
8. Profile and a separate name update page using `authClient.updateUser`.
9. Loading skeletons, friendly 404s, error boundaries and auth/validation/redirect toast notifications.
10. Primary API → alternate API → explicitly labeled supplied JSON snapshot.

The written requirement specifies **green up / red down / gray flat** badges, so those colors take precedence over the conflicting colors in the design file. Average price is the arithmetic mean of each market's `(min + max) / 2`; the UI labels this definition. The date uses Bengali language/digits for the Gregorian date, matching the supplied design.

## Quick start — Windows / VS Code

**Easy launch:** extract the ZIP and double-click `START_WINDOWS.bat`. It changes to the correct project folder, installs dependencies, prepares `.env.local`, checks MongoDB and starts the app. Node.js and a reachable MongoDB server are prerequisites. It stops and shows the actual error if a step fails.

`npm run setup` generates the auth secret once and preserves existing non-empty settings. For a local database, either start your installed MongoDB service or run `npm run db:start` with Docker Desktop installed and running. The included Compose service binds only to localhost and retains data in a named volume.


Extract the ZIP and open the **BazarDor folder containing package.json**. Do not run npm in the parent Downloads folder.

```powershell
cd BazarDor
npm install
npm run setup
```

For macOS/Linux:

```bash
cd BazarDor
npm install
npm run setup
```

Use Node.js **22.13+** (Node 24 LTS is suitable). The setup script fills the local defaults and generates a random secret. For Atlas or production, edit the relevant fields in `.env.local`:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017/bazardor
MONGODB_DB=bazardor
MONGODB_TRANSACTIONS=false
BETTER_AUTH_SECRET=your-generated-secret-at-least-32-characters
BETTER_AUTH_URL=http://localhost:3000
```

If you prefer configuring manually, you can generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Start your locally installed MongoDB service, or use your own MongoDB Atlas connection string. An Atlas URI typically looks like `mongodb+srv://USER:URL_ENCODED_PASSWORD@YOUR_CLUSTER/bazardor`. Set Atlas database-user permissions and network access for your development/deployment environment. Set `MONGODB_TRANSACTIONS=true` for Atlas/replica sets; leave false for a standalone local MongoDB. The app does not require migrations; Better Auth creates its collections as needed.

```bash
npm run check:env
npm run check:db
npm run dev
```

Open **http://localhost:3000**. Changes to `.env.local` require restarting the development server.

Without auth settings the public catalog still loads, but registration and login display a service-unavailable message. This is configuration handling, not a fake login. To demonstrate all assignment requirements, supply MongoDB, the auth secret and both OAuth providers.

## Google OAuth

Create a Google Cloud OAuth client of type Web Application and configure the consent screen. If the app is in testing, add examiner/test accounts as test users.

- Authorized JavaScript origin: `http://localhost:3000`
- Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
- Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local`.
- Add the deployed origin and its `/api/auth/callback/google` URI before production testing.

## GitHub OAuth

Create a GitHub OAuth App under Developer settings:

- Homepage URL: `http://localhost:3000`
- Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
- Set `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.

For a separate production callback, create a production OAuth App or update the callback to your deployed domain. OAuth success returns to `/`; provider errors return to `/signin` and show a toast. No email-verification or forgotten-password flows are implemented, as requested.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run setup` | Prepare local config and generate a secret without overwriting existing values |
| `npm run db:start` | Start local MongoDB with Docker Compose |
| `npm run db:stop` | Stop MongoDB while retaining its data |
| `npm run verify` | Run lint, full typecheck, unit tests and a production build |
| `npm run test:install` | Install Chromium for browser tests |
| `npm run test:e2e` | Run 27 checks against the production app across three viewport sizes |
| `npm run dev` | Development server |
| `npm run build` | Production Next.js build |
| `npm start` | Run an already built production app |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript checks |
| `npm test` | Data, sorting, mover selection, formatting and market summary tests |
| `npm run check:env` | Required settings check without printing secrets |
| `npm run check:db` | MongoDB connectivity check |

## Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Hero, risers/fallers and all products |
| `/category/[slug]` | Public | Category and numeric sorting |
| `/product/[slug]` | Login required | Summary and all market prices |
| `/signin`, `/signup` | Public | Authentication |
| `/profile` | Login required | Account information |
| `/profile/update` | Login required | Name update form |
| `/api/auth/[...all]` | Better Auth handler | Auth endpoints |
| Unknown route / invalid category or product | Public 404 | Friendly return-home link |

Invalid products are checked before the login gate, so `/product/unknown` shows the requested friendly 404 even when signed out. Valid detail pages and both profile pages validate the session against Better Auth on the server; creating a cookie manually does not grant access.

## Data

Default primary: `https://api.api-store.workers.dev/api/bazardor`

Default alternate: `https://api.abcz.workers.dev/api/bazardor`

The server rejects malformed prices, duplicate IDs/slugs, invalid market ranges and missing category references before using upstream data. It fetches `/products` and `/categories`, caches successful responses for 5 minutes and applies a 3.5-second timeout per endpoint. It filters category/product data by category ID and product slug locally because the supplied single-product endpoint accepts numeric IDs, while the UI uses slugs. The API's other endpoints remain available as specified in the assignment.

`data/products.json` is the exact 33-product snapshot supplied in the attachment, and `data/categories.json` is derived from its eight category identifiers. It is shown only if both APIs fail or `BAZARDOR_SNAPSHOT_ONLY=true`. A visible notice distinguishes stored data from API responses; neither the ticker nor home page claims the snapshot is current live market data.

## Deployment — Vercel

1. Push this source folder to your GitHub repository.
2. Import that repository into Vercel. Framework preset: **Next.js**; install command: `npm install`; build command: `npm run build`. Root directory must contain `package.json`.
3. Add MongoDB/auth/OAuth environment variables in Vercel. Set `BETTER_AUTH_URL=https://YOUR-PRODUCTION-DOMAIN` and `MONGODB_TRANSACTIONS=true` for Atlas.
4. Configure provider callbacks for that exact domain. Ensure MongoDB Atlas permits deployment connections.
5. Deploy, then perform the checks in `docs/SUBMISSION_CHECKLIST.md`, including direct refresh of dynamic routes.

Do **not** use static export (`output: "export"`); authentication needs the Next.js server. No client-only SPA rewrite is required on Vercel with this App Router project.

## Git commits

The ZIP includes the repository's actual local Git history. Each commit records a distinct implemented part of this project. Check with:

```bash
git log --oneline
```

Before your own future commits, set your Git name/email. Then create an empty GitHub repo and push:

```bash
git config user.name "Your Name"
git config user.email "your-email@example.com"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Do not commit `.env.local`, `node_modules` or `.next`. These are already excluded.

## Automated verification

Run `npm run verify`, then `npm run test:install` and `npm run test:e2e`. On Windows, `VERIFY_WINDOWS.bat` runs these steps in order. The browser tests use a separate `bazardor_e2e` database on your local MongoDB and a test server on port 3100; they do not use production credentials. Read `docs/TESTING.md` before choosing a custom test database.

The included GitHub Actions workflow runs installation, lint, typechecking, unit tests, a production build and 27 Chromium tests with a temporary MongoDB service after pushing to `main`. Reports and a generated package lockfile are saved as workflow artifacts. No GitHub workflow was executed from this workspace.

Hind Siliguri font files are loaded from the installed `@fontsource/hind-siliguri` package and served with the app, matching the reference typeface without a browser-time Google Fonts request.

## Validation and submission

Read `docs/VALIDATION.md` for the actual results and remaining credential-dependent checks. Source generation alone does not prove a working deployed login. Full installation/build, database-backed auth, both OAuth providers and Vercel refresh tests must pass in your configured environment before submission.

- **Live Link:** add your deployed URL after deployment.
- **GitHub Repository Link:** add your actual repository URL after pushing.

Reference: [Better Auth Next.js integration](https://better-auth.com/docs/integrations/next), [MongoDB adapter](https://better-auth.com/docs/adapters/mongo), [Update user](https://better-auth.com/docs/concepts/users-accounts#update-user).

### Provisioned Atlas cluster

A free BazarDor cluster is ready. See [Atlas setup status](docs/ATLAS_STATUS.md) for the project, connection template and remaining application access configuration.

## Version 1.2: বাংলা / English

Use the navbar language selector to switch the entire interface. Bengali is the default. The choice is stored in a one-year same-site cookie; switching reloads the current URL so server content, page metadata and client controls agree. Product/category labels, supplied markets, units, numbers, Dhaka dates, forms, errors, loading states and navigation are translated. User-entered names/emails are preserved. Search accepts both Bengali and translated English product names. Unknown future API labels retain the source text until added to `lib/translations.ts`.

### Updating an existing installation

Extract the updated ZIP into a NEW folder. Copy your current working `.env.local` from the old BazarDor folder into the new BazarDor folder beside `package.json`. This update intentionally excludes private settings and credentials so it cannot restore the old Atlas connection. For a fresh local installation, run `npm run setup`; it generates a secret and uses local MongoDB.

Then run `npm install`, `npm run check:db`, and `npm run dev`. Stop the old development server first. Use `npm run verify` for the production checks.
