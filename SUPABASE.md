# 💾 Adding Persistent Storage (Supabase)

By default the app saves coffres to a local `coffres.json` file. On Render's free tier this file resets when the app sleeps/restarts. For most parties this is fine — but if you want **leaderboards that survive forever**, you can plug in Supabase (free).

## What you get

- Coffres saved permanently across restarts and deploys
- Leaderboard works across multiple parties / nights
- 100% free for any party size

## Setup (~10 min, one time)

### 1. Create Supabase account

1. Go to **https://supabase.com** → **Start your project**
2. Sign in with GitHub (easiest)
3. Click **New Project**, pick any name (`maison-casino`), generate a password, region: closest to you. Free tier is enough.
4. Wait ~2 min for the project to provision.

### 2. Create the coffres table

Once your project is ready, click **SQL Editor** (left sidebar), paste this, click **Run**:

```sql
CREATE TABLE coffres (
  id TEXT PRIMARY KEY,
  name TEXT,
  chips JSONB DEFAULT '{}'::jsonb,
  history JSONB DEFAULT '[]'::jsonb,
  updated_at BIGINT
);

ALTER TABLE coffres ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open access" ON coffres FOR ALL USING (true) WITH CHECK (true);
```

### 3. Get your credentials

1. Click **Project Settings** (gear icon, bottom left) → **API**
2. Copy two values:
   - **Project URL** (something like `https://abcdef.supabase.co`)
   - **anon / public key** (long token starting with `eyJ...`)

### 4. Add them to Render

1. In your Render dashboard, open the `maison-de-la-roue` service
2. Click **Environment** (left tab) → **Add Environment Variable**, add two:
   - `SUPABASE_URL` = (paste your Project URL)
   - `SUPABASE_KEY` = (paste your anon key)
3. Render auto-restarts.

### 5. That's it

The server detects these variables on startup and uses Supabase automatically. Your existing local `coffres.json` is ignored. If the variables aren't set, it falls back to the local file (so dev keeps working).

## What if I don't add this?

Nothing — the app works fine without it. Coffres just won't survive a Render free-tier sleep (~15 min of inactivity). For a one-night party that's not a problem.

---

**The code already supports this** — you don't need to change anything in the files. Just add the two env variables and you're done.
