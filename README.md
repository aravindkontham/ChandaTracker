# Sri Ramanavami Chanda Tracker

Login-protected app to record chanda (donation) collections — first name,
last name, phone, amount and a photo — with date/time recorded
automatically. All signed-in members can view every entry. Only an admin
can edit or delete. Includes an auto-scrolling leaderboard ranked from
highest to lowest total chanda per person.

Built with Next.js + Supabase (Auth, Database, Storage), hosted free on
Vercel.

## 1. Create the Supabase project

1. Go to https://supabase.com, sign up free, click **New Project**.
2. Set a name/region and database password, wait ~2 minutes for setup.

## 2. Set up the database, auth trigger, and storage bucket

1. In your project, go to **SQL Editor → New Query**.
2. Open `supabase_schema.sql` from this project, copy all of it, paste it
   in, and click **Run**. This creates:
   - `profiles` table (tracks who's an admin) + a trigger that auto-fills
     it whenever someone signs up
   - `donations` table with the access rules described above
   - a public `chanda-images` storage bucket for photos, with upload
     allowed only for signed-in users

That's it — no manual bucket creation needed, the SQL does it.

## 3. Get your API keys

Go to **Project Settings → API** and copy:
- **Project URL**
- **anon public** key

## 4. Configure the app locally (VS Code)

1. Open the `chanda-tracker` folder in VS Code, open a terminal.
2. `npm install`
3. Copy `.env.local.example` to `.env.local`:
   ```
   cp .env.local.example .env.local
   ```
4. Paste your Project URL and anon key into `.env.local`.
5. `npm run dev`, open http://localhost:3000 — you'll land on the login
   page.

## 5. Create your account and make yourself admin

1. On the login page, click **Create an account**, sign up with your
   email/password.
   - By default Supabase requires email confirmation. For quick local
     testing you can turn this off: **Authentication → Providers → Email
     → toggle off "Confirm email"**. (Turn it back on before going live
     if you want extra security.)
2. Sign in. You'll see the app, but as a regular member (view + add
   only) — this is expected.
3. In Supabase, go to **Table Editor → profiles**, find your row, and set
   `is_admin` to `true`. (Or run the commented `update` line at the
   bottom of `supabase_schema.sql` with your email.)
4. Refresh the app — you'll now see an **Admin** badge and Edit/Delete
   buttons on every entry.

Every other person who signs up will default to a regular member: they
can sign in, view the full list and leaderboard, and add new entries, but
cannot edit or delete anything — this is enforced both in the UI and at
the database level (row-level security), so it can't be bypassed from
the browser.

## 6. Push to GitHub

```
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/chanda-tracker.git
git push -u origin main
```
(`.env.local` is git-ignored, so your keys stay private.)

## 7. Deploy to Vercel (free)

1. Go to https://vercel.com, sign up with GitHub.
2. **Add New → Project**, import the `chanda-tracker` repo.
3. Expand **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**. You'll get a live link like
   `chanda-tracker.vercel.app` to share with everyone helping collect
   chanda — they just sign up and start adding entries.

## How the leaderboard works

It aggregates all donations by donor (name + phone) and ranks them
highest total to lowest, auto-scrolling vertically in a loop. Hover over
it to pause.

## Making changes later

`git add . && git commit -m "message" && git push` — Vercel redeploys
automatically on every push to `main`.
