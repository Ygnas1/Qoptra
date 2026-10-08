# Qoptra website

Next.js site for Qoptra: home page with an interactive explainer of the inspection station, and a demos section with the LineSight simulator.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home: hero, clickable station diagram, setup steps, hardware kit, demos, contact |
| `/demos` | List of hardware demos |
| `/demos/linesight` | LineSight inspection demo embedded in the site |
| `/demos/linesight.html` | The same demo, full screen (good for investor meetings) |

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

**Option A: through GitHub (recommended, auto-deploys on every change)**

1. Create a new empty repository on GitHub, e.g. `qoptra-site`.
2. In this folder:
   ```bash
   git init
   git add .
   git commit -m "Qoptra website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USER/qoptra-site.git
   git push -u origin main
   ```
3. Go to vercel.com → Add New → Project → import the repository → Deploy. No settings need changing.

**Option B: straight from your computer**

```bash
npx vercel
```

Log in when asked and accept the defaults. Run `npx vercel --prod` to publish to the main URL.

## Connect the domain

In Vercel: Project → Settings → Domains → add `qoptra.com`, then set the DNS records Vercel shows at your domain registrar.

## Things to edit

- Contact email: `CONTACT_EMAIL` at the top of `app/page.tsx`.
- Texts: `app/page.tsx` (home), `components/StationExplorer.tsx` (station parts).
- Adding a new demo: put a standalone HTML file in `public/demos/`, copy `app/demos/linesight/page.tsx` to a new folder, and add a card in `app/demos/page.tsx` and on the home page.
