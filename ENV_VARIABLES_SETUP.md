# 📌 COPY-PASTE ENVIRONMENT VARIABLES

**Use this file to quickly set your environment variables!**

---

## 🔴 RENDER (Backend)

**URL:** https://render.com/dashboard

**Path:** 
1. Click **skinlytics-rdk0** service
2. Click **Settings** tab
3. Scroll to **Environment Variables**

**Variable 1:**
```
Name: FRONTEND_URL
Value: https://skinlytics-lyart.vercel.app
```
Click **Add**

---

**Variable 2:**
```
Name: CORS_ORIGINS
Value: https://skinlytics-lyart.vercel.app,http://localhost:5173,http://localhost:3000
```
Click **Add**

---

**Variable 3:**
```
Name: ENVIRONMENT
Value: production
```
Click **Add**

---

⏱️ **Wait 2-3 minutes for Render to redeploy**

---

## 🔵 VERCEL (Frontend)

**URL:** https://vercel.com/dashboard

**Path:**
1. Click **skinlytics-lyart** project
2. Click **Settings** tab
3. Scroll to **Environment Variables**

**Variable 1:**
```
Name: VITE_API_URL
Value: https://skinlytics-rdk0.onrender.com
Environment: Production ☑️
```
Click **Save**

---

⏱️ **Then redeploy:**
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click **Redeploy**
4. Wait 1-2 minutes

---

## ✅ VERIFY SETUP

### Test 1: Can you access the frontend?
```
https://skinlytics-lyart.vercel.app/
```
Should load without errors ✓

---

### Test 2: Can you access the backend?
```
https://skinlytics-rdk0.onrender.com/health
```
Should show:
```json
{"status":"ok"}
```

---

### Test 3: Does the form work?
1. Go to frontend: https://skinlytics-lyart.vercel.app/
2. Fill the form
3. Click "Analyze My Skin"
4. Wait for results

Should see ingredient recommendation ✓

---

### Test 4: Check Network Connection
1. Open frontend in browser
2. Press F12 (DevTools)
3. Go to **Network** tab
4. Fill form and submit
5. Look for request to `skinlytics-rdk0.onrender.com`

Should show status **200** (green) ✓

---

## 🎉 SUCCESS INDICATORS

✅ **Everything working when:**
- Frontend loads: https://skinlytics-lyart.vercel.app/
- Backend health: https://skinlytics-rdk0.onrender.com/health returns `{"status":"ok"}`
- Form submission completes without CORS errors
- Results display with ingredient recommendation
- DevTools Network shows status 200 to Render backend

---

## ❌ TROUBLESHOOTING

**Issue:** CORS Error in Console
```
Access to XMLHttpRequest blocked by CORS policy
```
**Fix:** 
- Make sure `CORS_ORIGINS` on Render includes Vercel domain
- Click **Redeploy** on Render manually
- Wait 2-3 minutes

---

**Issue:** Cannot Connect / Network Error
```
Failed to fetch
Network request failed
```
**Fix:**
- Check Vercel env variable is set
- Redeploy on Vercel (Settings → Deployments → Redeploy)
- Clear browser cache (Ctrl+Shift+Delete)

---

**Issue:** Render backend is slow
```
Request took 30+ seconds
```
**Normal on free tier!** First request takes time. Subsequent requests are faster.

---

## 📝 SUMMARY

| Step | Service | What to Do | Time |
|------|---------|-----------|------|
| 1 | Render | Add 3 env variables | 1 min |
| 2 | - | Wait for redeploy | 2-3 min |
| 3 | Vercel | Add 1 env variable | 1 min |
| 4 | Vercel | Redeploy | 1-2 min |
| 5 | Test | Form submission | 1 min |

**Total:** 5-10 minutes

---

**Made:** April 28, 2026  
**Status:** Ready to Deploy
