# Assignment 07 submission checklist

## Configuration and build

- [ ] Run npm install in the folder containing package.json.
- [ ] Set required MongoDB and Better Auth settings; check:env and check:db pass.
- [ ] Configure both Google and GitHub OAuth callbacks.
- [ ] npm run lint, npm run typecheck, npm test and npm run build pass.
- [ ] Run npm start and repeat the browser checks using a production build.

## Public pages

- [ ] Logo/date, second-row categories, active category, signin/signup links and footer match the intended reference layout.
- [ ] Ticker scrolls continuously, includes units and changes, and can be paused.
- [ ] Hero CTA scrolls to the all-products anchor on the same page.
- [ ] Home shows exactly six risers, six fallers and 33 products for the supplied snapshot.
- [ ] Category page title/icon, all three sorting options and Bengali numeric price order work.
- [ ] Home search finds products and gives a helpful empty result.
- [ ] Loading skeletons appear under network throttling.
- [ ] Snapshot notice appears when upstream APIs are unavailable; API data works when accessible.
- [ ] Unknown route, /category/invalid and /product/unknown give a friendly 404 with a home link.

## Authentication and profile

- [ ] Valid signup redirects to signin; valid signin redirects home.
- [ ] Invalid form input and wrong credentials show clear errors/toasts.
- [ ] Google and GitHub each log in and return home.
- [ ] Valid product detail signed out redirects to signin with a toast.
- [ ] Signed-in navbar shows profile and sign-out; logout updates it and returns home.
- [ ] Signed-in details show all 12 supplied markets, accurate min/max/average and units.
- [ ] Profile update is a separate route and persists a changed name after reload and a fresh login.
- [ ] A fake/expired session cookie cannot open protected pages.

## Responsive and deployment

- [ ] Test 360/390px mobile, 768px tablet and 1440px desktop widths.
- [ ] Header/auth buttons remain usable; category nav scrolls; hero stacks; cards collapse without clipping.
- [ ] Market table scrolls inside its container on mobile; the whole page does not overflow.
- [ ] Keyboard focus and form labels work; reduced-motion preference stops the ticker.
- [ ] Deploy to Vercel with production auth URL, OAuth callbacks and Atlas access set correctly.
- [ ] Refresh /category/chal, /product/miniket-chal, /signin and /profile directly on the deployed domain.
- [ ] Confirm no browser console or server errors during all flows.
- [ ] git log contains at least eight meaningful commits, GitHub push is complete and README links are filled.

These are acceptance checks to execute, not a claim that external deployment and OAuth have already passed.
