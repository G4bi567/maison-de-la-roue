# 🎰 Maison de la Roue — Deployment Guide

Get your casino app online in **~10 minutes**, free, forever, with HTTPS (so iPhone gyroscope works).

You'll end up with a URL like `https://maison-de-la-roue.onrender.com` that everyone can open from any phone, anywhere.

---

## What you need

- A computer (any OS)
- An email address
- About 10 minutes

You do **NOT** need to know how to code. Just follow the steps.

---

## STEP 1 — Create a GitHub account (2 min)

GitHub is where your code lives.

1. Go to **https://github.com/signup**
2. Enter your email, create a password, pick a username
3. Verify your email

Done.

---

## STEP 2 — Put the app on GitHub (3 min)

The easy way: upload the files through the website, no command line needed.

1. Once logged in to GitHub, click the **`+`** icon (top right) → **New repository**
2. Repository name: `maison-de-la-roue` (or anything you want)
3. Keep it **Public** (required for Render's free tier)
4. ✅ Check **"Add a README file"**
5. Click **Create repository**

Now upload the casino files:

6. On the new repo page, click **Add file** → **Upload files**
7. Unzip the `casino.zip` I gave you on your computer
8. **Drag ALL the files from inside the casino folder** (not the folder itself — the files: `server.js`, `index.html`, `phone.html`, etc.) into the GitHub page
9. Scroll down → click **Commit changes**

You should now see all the files listed on your GitHub repo page.

---

## STEP 3 — Create a Render account (2 min)

Render is what actually runs your app.

1. Go to **https://render.com**
2. Click **Get Started** → **Sign up with GitHub** (easiest — it links the two accounts)
3. Authorize Render to access your GitHub

---

## STEP 4 — Deploy the app (3 min)

1. In Render dashboard, click **+ New** → **Web Service**
2. Find your `maison-de-la-roue` repository in the list → click **Connect**
3. Render auto-fills most settings from the `render.yaml` file. Confirm:
   - **Name:** `maison-de-la-roue` (this becomes your URL)
   - **Runtime:** Node
   - **Build Command:** *(leave empty)*
   - **Start Command:** `node server.js`
   - **Instance Type:** **Free**
4. Click **Create Web Service**

Render now builds and deploys. Wait ~2 minutes. You'll see logs scrolling — when you see:

```
Listening on port 10000
```

…you're live! 🎉

---

## STEP 5 — Use it!

Your URL is shown at the top of the Render page, something like:

**`https://maison-de-la-roue.onrender.com`**

Open these on the right devices:

| Device | URL |
|---|---|
| 📱 Players' phones | `https://your-url.onrender.com/phone` |
| 📺 TV (roulette) | `https://your-url.onrender.com/display` |
| 📺 TV (Liar's Bar) | `https://your-url.onrender.com/liarbar` |
| 👨‍💼 Game master | `https://your-url.onrender.com/admin` |
| 🏆 Leaderboard TV | `https://your-url.onrender.com/leaderboard` |

**Admin password:** `casino2026`

Bookmark the player URL on each phone (Share → Add to Home Screen) for one-tap access.

---

## 💡 Tips

### Free tier sleep
After 15 minutes with nobody using it, Render puts the app to sleep. First visit takes ~30 seconds to wake it. After that it's instant. **Workaround:** open the URL 1 minute before your party starts.

### iPhone gyroscope
On first use, iPhone players will see an **"Enable motion sensors"** button — they must tap it once and accept. This is normal Apple security and only works because Render gives you HTTPS.

### Updating the app later
Any change you make on GitHub auto-redeploys to Render in ~1 minute. To edit a file:
1. Go to the file on GitHub → click the **pencil icon** → edit → **Commit changes**
2. Render rebuilds automatically.

### Saving leaderboard data
On Render's free tier, the `coffres.json` file resets when the app sleeps/restarts. For a single party night this is fine. **For permanent saves across nights**, see `SUPABASE.md` — free Supabase setup takes ~10 minutes and gives you persistent storage forever.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Render build fails | Check the logs — most likely `server.js` wasn't uploaded. Re-upload all files. |
| URL shows "Application failed to respond" | App is sleeping — wait 30 sec and refresh. |
| iPhone gyroscope doesn't work | Make sure the URL starts with `https://` (not `http://`), and tap "Enable motion sensors". |
| Players can't connect | Make sure they're using the **Render URL**, not your local IP. |

---

## That's it!

Once it's deployed, you never have to redo this. The URL stays forever (or until you delete it).

Bonne soirée casino ! 🎲🍾
