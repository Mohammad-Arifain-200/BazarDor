# Running the remaining checks

## Unit and setup checks

```bash
npm test
```

These tests run with Node and do not need MongoDB. They cover catalog integrity, numeric sorting, market summary calculations, invalid upstream data and setup-script idempotence.

## Full validation on your machine

```bash
npm install
npm run setup
npm run verify
```

`verify` stops at the first lint/typecheck/unit/build failure. Do not interpret an earlier successful step as a full build success. After a successful npm install, commit the generated package-lock.json to make subsequent installs reproducible.

## Browser tests with real MongoDB

Start a local MongoDB service, or run `npm run db:start` with Docker Desktop running. Then:

```bash
npm run test:install
npm run test:e2e
```

A production build must already exist from `npm run verify`. Playwright starts the production app on port 3100 and closes it when done. Stop any existing process on port 3100 first.

The tests use **bazardor_e2e**, not the main `bazardor` database. They create randomly named test accounts there. They do not delete or overwrite the main database. Default test URI: mongodb://127.0.0.1:27017/bazardor_e2e. If a dedicated remote test MongoDB is needed, set E2E_MONGODB_URI in the shell; use a test-only database user that can access bazardor_e2e. Do not point tests at a production database.

27 cases are defined: nine flows at 1440px desktop, 768px tablet and 390px mobile widths. They cover:

- Home/hero/anchor, 33 cards, six risers/fallers, ticker pause and horizontal overflow.
- Category sorting, active navigation and direct refresh.
- Search and empty results.
- Three invalid routes, each with a return-home action.
- Protection against signed-out access and a forged session cookie.
- Form validation and unavailable-provider feedback.
- Real database signup, signin, market details, detail refresh, name persistence after reload and logout.

Successful runs save home/detail screenshots in test-results and an HTML report in playwright-report. These folders are ignored by Git. OAuth keys are intentionally blank in the test server; the tests do not simulate or claim a successful Google/GitHub authorization.

## Real OAuth and deployment

After configuring actual provider keys/callbacks, manually test Google and GitHub on the production domain. Then check direct refresh and logout there using SUBMISSION_CHECKLIST.md. A local or CI test cannot establish that production callback URLs and Atlas access are correct.

## GitHub Actions

The included .github/workflows/verify.yml runs the automated checks with a MongoDB service on push to main, pull requests or manual dispatch. It needs no database/OAuth secrets. Once it runs, read the actual result and downloaded reports. A workflow file by itself is not evidence of a passing run.
