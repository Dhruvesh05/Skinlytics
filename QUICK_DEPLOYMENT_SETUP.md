# ⚡ QUICK SETUP - 5 MINUTE DEPLOYMENT

**Status:** Ready to Deploy  
**Backend:** https://skinlytics-rdk0.onrender.com  
**Frontend:** https://skinlytics-lyart.vercel.app/

---

## 🎯 DO THIS NOW (Copy-Paste)

### ✅ Step 1: Render Backend (2 min)

**Go to:** https://render.com/dashboard → Select **skinlytics-rdk0** → Click **Settings**

**Click:** Environment Variables

**Add these 3 variables:**

```
FRONTEND_URL
https://skinlytics-lyart.vercel.app

CORS_ORIGINS
https://skinlytics-lyart.vercel.app,http://localhost:5173,http://localhost:3000

ENVIRONMENT
production
```

**Then:** Render auto-redeploys (wait 2-3 min)

---

### ✅ Step 2: Vercel Frontend (1 min)

**Go to:** https://vercel.com/dashboard → Select **skinlytics-lyart** → Click **Settings**

**Click:** Environment Variables

**Add this 1 variable for Production:**

```
VITE_API_URL
https://skinlytics-rdk0.onrender.com
```

**Then:** Click **Settings** → **Deployments** → Find latest → Click **Redeploy** (wait 1-2 min)

---

### ✅ Step 3: Test (1 min)

Open: **https://skinlytics-lyart.vercel.app/**

1. Fill form
2. Click "Analyze My Skin"
3. Should see results!

If results appear = **✅ EVERYTHING WORKS!**

---

## 🧪 Verify Connection

Open DevTools (F12) → Network tab → Submit form

**Look for request to:** `skinlytics-rdk0.onrender.com/api/predict`

**Should show:** Status `200` (green checkmark)

---

## 📸 Screenshots of What to Set

### Render Environment Variables

```
Name: FRONTEND_URL
Value: https://skinlytics-lyart.vercel.app
✅ Add

Name: CORS_ORIGINS  
Value: https://skinlytics-lyart.vercel.app,http://localhost:5173,http://localhost:3000
✅ Add

Name: ENVIRONMENT
Value: production
✅ Add
```

### Vercel Environment Variables

```
Name: VITE_API_URL
Value: https://skinlytics-rdk0.onrender.com
Environment: ☑️ Production
✅ Save
```

Then redeploy frontend.

---

## ❌ If Something Goes Wrong

**Q: CORS error in console?**  
A: Check CORS_ORIGINS on Render includes your Vercel domain. Manually redeploy on Render.

**Q: Cannot connect error?**  
A: Redeploy frontend on Vercel. Check URL has no trailing slash.

**Q: Slow page load?**  
A: Normal on Render free tier. First request takes 30+ seconds.

---

## ✨ That's It!

You now have a fully connected production setup.

**Total time:** 5 minutes  
**Difficulty:** Very Easy ⭐  
**Cost:** Free (Render + Vercel free tier)

---

Created: April 28, 2026
