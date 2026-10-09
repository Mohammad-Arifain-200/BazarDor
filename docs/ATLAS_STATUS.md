# BazarDor Atlas setup — 9 October 2026

## Completed

- Created the BazarDor Atlas project: `6ac8b9320d57cc6fd6927a13`.
- Created the free `bazardor` cluster (AWS US_EAST_1), confirmed ready.
- Connected through the MongoDB integration and successfully listed databases.
- No application database users or network access entries exist yet.

## Connect the application

In this Atlas project's Database Access, create an application user scoped to the `bazardor` cluster with `readWrite` on the `bazardor` database. Store the generated password privately.

In Network Access, allow your application's actual outbound IP address. For local development, allow your own public IP. Choose deployment networking before configuring production access.

Run `npm run setup`, then update the existing entries in `.env.local`:

```dotenv
MONGODB_URI=mongodb+srv://<username>:<URL-encoded-password>@bazardor.eoate1t.mongodb.net/bazardor?retryWrites=true&w=majority
MONGODB_DB=bazardor
MONGODB_TRANSACTIONS=true
```

Keep the generated `BETTER_AUTH_SECRET`. Set `BETTER_AUTH_URL` to your real app origin when deploying. Never commit `.env.local` or put the database password in client-side variables.

Run `npm run check:db` after dependencies are installed. A successful integration connection does not establish that the Next.js application can connect. Application signup/signin and profile persistence remain unverified.

Google/GitHub provider credentials, browser tests, production build and deployment still require completion; see VALIDATION.md.
