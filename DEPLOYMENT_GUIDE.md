# 🚀 ReplyAI Deployment Guide

## Quick Deploy to Vercel

### Step 1: Prerequisites ✅

- [x] GitHub account
- [x] Vercel account (free tier is fine)
- [x] MongoDB Atlas account (free tier works)
- [x] Google Gemini API key

---

## Step 2: MongoDB Setup

1. **Go to MongoDB Atlas**
   - Visit: https://cloud.mongodb.com
   - Sign up or log in

2. **Create a Cluster** (if you don't have one)
   - Select FREE tier
   - Choose a region close to you
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Add new user
   - Username: `subha` (or anything)
   - Password: Generate or create strong password
   - Save credentials!

4. **Whitelist IP Addresses**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Should look like:
     ```
     mongodb+srv://subha:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/reply-ai
     ```

---

## Step 3: Google Gemini API Key

1. **Go to Google AI Studio**
   - Visit: https://aistudio.google.com/apikey

2. **Create API Key**
   - Click "Create API Key"
   - Select project or create new one
   - Copy the key (starts with `AIzaSy...`)
   - **IMPORTANT:** Keep this secret!

---

## Step 4: Push to GitHub

Your code is already on GitHub at:
**https://github.com/20SB/ReplyAI**

If you need to push updates:
```bash
cd /path/to/reply-ai
git add -A
git commit -m "Your message"
git push origin main
```

---

## Step 5: Deploy to Vercel

### Option A: Link Existing Project (Recommended)

You already have a Vercel project. Just link it to GitHub:

1. **Go to Project Settings**
   - Visit: https://vercel.com/20sb/reply-ai/settings/git

2. **Connect Git Repository**
   - Click "Connect Git Repository"
   - Select GitHub
   - Choose repository: `20SB/ReplyAI`
   - Click "Connect"

3. **Add Environment Variables**
   - Go to: https://vercel.com/20sb/reply-ai/settings/environment-variables
   - Add two variables:

   | Name | Value |
   |------|-------|
   | `MONGODB_URI` | Your MongoDB connection string |
   | `GEMINI_API_KEY` | Your Gemini API key |

   - Click "Save" for each

4. **Trigger Deployment**
   - Go to: https://vercel.com/20sb/reply-ai
   - Click "Deployments"
   - Click "Redeploy" on latest deployment
   - OR just push a commit to GitHub (auto-deploys)

---

### Option B: Create New Vercel Project

1. **Go to Vercel**
   - Visit: https://vercel.com/new

2. **Import GitHub Repository**
   - Click "Import Git Repository"
   - Select `20SB/ReplyAI`
   - Click "Import"

3. **Configure Project**
   - Framework: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add:
     - `MONGODB_URI` = your MongoDB connection string
     - `GEMINI_API_KEY` = your Gemini API key

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Done! ✅

---

## Step 6: Verify Deployment

1. **Visit Your Site**
   - URL will be: `https://reply-ai-xxx.vercel.app`
   - Or your custom domain

2. **Test Features**
   - ✅ Main page loads
   - ✅ Generate reply works
   - ✅ Add contact works
   - ✅ View history works
   - ✅ Settings page works

3. **Check Logs** (if issues)
   - Go to Vercel Dashboard
   - Click "Deployments"
   - Click on deployment
   - View "Build Logs" and "Function Logs"

---

## Step 7: Enable Auto-Deploy

Once GitHub is linked:

1. **Every `git push` will auto-deploy**
   - Push to `main` branch
   - Vercel detects change
   - Builds and deploys automatically
   - Takes ~2 minutes

2. **Production URL**
   - Vercel assigns: `https://reply-ai.vercel.app`
   - Or use custom domain

---

## 🔧 Troubleshooting

### Build Fails

**Error:** "Module not found"
- Solution: Make sure all dependencies are in `package.json`
- Run: `npm install` locally to verify

**Error:** "Environment variable not set"
- Solution: Add missing variables in Vercel settings
- Go to Settings → Environment Variables

### Database Connection Fails

**Error:** "MongoServerError: Authentication failed"
- Solution: Check MongoDB username/password
- Make sure connection string is correct
- Verify IP whitelist includes 0.0.0.0/0

**Error:** "Connection timeout"
- Solution: Check Network Access in MongoDB Atlas
- Add 0.0.0.0/0 to whitelist

### AI Replies Don't Work

**Error:** "403 Forbidden" or "Invalid API key"
- Solution: Check Gemini API key
- Make sure it's not leaked (create new one if needed)
- Add to Vercel environment variables

### Pages Return 404

**Error:** "404 Not Found" on routes
- Solution: Clear Vercel cache and redeploy
- Or: Check file names match exactly (case-sensitive)

---

## 📊 Post-Deployment

### Custom Domain (Optional)

1. Go to Vercel project settings
2. Domains → Add domain
3. Follow DNS instructions
4. Wait for propagation (~5 minutes)

### Analytics

Vercel provides:
- Page views
- Function executions
- Performance metrics
- Error tracking

Access at: https://vercel.com/20sb/reply-ai/analytics

### Monitoring

Check regularly:
- Database usage (MongoDB Atlas)
- API usage (Google AI Studio)
- Vercel function executions
- Error logs

---

## 💰 Cost Estimate (Free Tier)

| Service | Free Tier | Usage |
|---------|-----------|-------|
| Vercel | 100GB bandwidth/month | ~5-10GB |
| MongoDB Atlas | 512MB storage | ~50-100MB |
| Gemini API | 1500 requests/day | ~10-50/day |
| **Total** | **$0/month** | ✅ Free! |

---

## 🎯 Next Steps

1. ✅ Deploy to Vercel
2. ✅ Link GitHub for auto-deploy
3. ✅ Test all features
4. 📢 Share with users
5. 📊 Monitor usage
6. 🚀 Add new features

---

## 📞 Support

Issues? Check:
1. Vercel deployment logs
2. MongoDB connection
3. Environment variables
4. API key validity

Still stuck? Open an issue on GitHub!

---

**Ready to deploy? Start with Step 1!** 🚀
