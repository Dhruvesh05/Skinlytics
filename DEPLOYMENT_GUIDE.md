# 🚀 DEPLOYMENT GUIDE - Skinlytix Production Setup

**Created:** April 28, 2026  
**Status:** Ready for Deployment  
**Backend:** https://skinlytics-rdk0.onrender.com  
**Frontend:** https://skinlytics-lyart.vercel.app/

---

## 📋 Overview

This guide walks through connecting your Render backend with your Vercel frontend for production deployment.

### Current Setup
- **Backend:** FastAPI on Render (https://skinlytics-rdk0.onrender.com)
- **Frontend:** React/Vite on Vercel (https://skinlytics-lyart.vercel.app/)
- **Database:** SQLite (local on Render)

---

## 🔧 PART 1: Backend Configuration (Render)

### Step 1: Set Environment Variables on Render

1. Go to **https://render.com/dashboard**
2. Select your **skinlytics-rdk0** service
3. Click **Settings** → **Environment**
4. Add these environment variables:

```
FRONTEND_URL=https://skinlytics-lyart.vercel.app
CORS_ORIGINS=https://skinlytics-lyart.vercel.app,http://localhost:5173,http://localhost:3000
ENVIRONMENT=production
```

### Step 2: Verify Backend Environment File

✅ File: `backend/.env` (already configured locally)

```
# Backend Configuration
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173
DATABASE_URL=sqlite:///./skinlytix.db
ENVIRONMENT=development
```

### Step 3: Backend Code Changes

✅ File: `backend/main.py` (already updated)

The CORS middleware now reads from environment variables:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="Skinlytix API", version="1.0")

# Read CORS origins from environment
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "").split(",") if os.getenv("CORS_ORIGINS") else [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

# Add production frontend
FRONTEND_URL = os.getenv("FRONTEND_URL")
if FRONTEND_URL and FRONTEND_URL not in CORS_ORIGINS:
    CORS_ORIGINS.append(FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)
```

---

## 🌐 PART 2: Frontend Configuration (Vercel)

### Step 1: Set Environment Variables on Vercel

1. Go to **https://vercel.com/dashboard**
2. Select your **skinlytics-lyart** project
3. Click **Settings** → **Environment Variables**
4. Add this variable for **Production**:

```
VITE_API_URL=https://skinlytics-rdk0.onrender.com
```

### Step 2: Verify Frontend Environment Files

✅ File: `frontend/.env.production` (created for production)

```
VITE_API_URL=https://skinlytics-rdk0.onrender.com
```

✅ File: `frontend/.env.local` (for local development)

```
VITE_API_URL=http://localhost:8000
```

### Step 3: API Service Configuration

✅ File: `frontend/src/services/api.ts` (already supports env vars)

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
```

The frontend automatically reads from:
- `VITE_API_URL` environment variable (if set)
- Falls back to localhost (for local development)

---

## ✅ DEPLOYMENT CHECKLIST

### Before Deploying Backend to Render

- [ ] Backend code is committed to git
- [ ] `backend/.env` has correct CORS settings
- [ ] `backend/main.py` uses environment variables (✅ already done)
- [ ] Requirements are in `requirements.txt`
- [ ] Database initialization works

### Deploying Backend to Render

1. **Render Dashboard → Services → skinlytics-rdk0**
2. **Settings → Environment Variables**
3. **Add:**
   ```
   FRONTEND_URL=https://skinlytics-lyart.vercel.app
   CORS_ORIGINS=https://skinlytics-lyart.vercel.app,http://localhost:5173,http://localhost:3000
   ENVIRONMENT=production
   ```
4. **Deploy → Manual Deploy** (or push to git branch)
5. **Wait** for deployment to complete
6. **Test:** Open https://skinlytics-rdk0.onrender.com/health

### Before Deploying Frontend to Vercel

- [ ] Frontend code is committed to git
- [ ] `frontend/.env.production` is correct
- [ ] Build succeeds locally: `npm run build`
- [ ] No console errors

### Deploying Frontend to Vercel

1. **Vercel Dashboard → Projects → skinlytics-lyart**
2. **Settings → Environment Variables**
3. **Add for Production:**
   ```
   VITE_API_URL = https://skinlytics-rdk0.onrender.com
   ```
4. **Deployments → Redeploy**
5. **Wait** for build to complete
6. **Test:** Open https://skinlytics-lyart.vercel.app/

---

## 🧪 TESTING THE CONNECTION

### Test 1: Backend Health Check

```bash
curl https://skinlytics-rdk0.onrender.com/health
```

Expected response:
```json
{"status": "ok"}
```

### Test 2: Frontend Access

Open in browser:
```
https://skinlytics-lyart.vercel.app/
```

Should load without errors.

### Test 3: Form Submission

1. Open https://skinlytics-lyart.vercel.app/
2. Fill the analysis form
3. Click "Analyze My Skin"
4. **Expected:** Results display with ingredient recommendation

If results show, the connection works! ✅

### Test 4: Browser DevTools

1. Open https://skinlytics-lyart.vercel.app/
2. Press **F12** to open DevTools
3. Go to **Network** tab
4. Fill form and submit
5. **Look for:** Request to `https://skinlytics-rdk0.onrender.com/api/predict`
6. **Should see:** Status **200** (success)

If you see any **CORS errors**, the environment variables aren't set correctly.

---

## 🐛 TROUBLESHOOTING

### Error: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution:**
1. Check Render environment variables are set:
   - `FRONTEND_URL=https://skinlytics-lyart.vercel.app`
   - `CORS_ORIGINS` includes your Vercel domain
2. Restart Render service: **Settings → Manual Deploy**
3. Wait 2-3 minutes for changes to take effect
4. Test again

### Error: "Cannot connect to backend"

**Solution:**
1. Check backend is running: https://skinlytics-rdk0.onrender.com/health
2. Check Vercel environment variable `VITE_API_URL` is set to `https://skinlytics-rdk0.onrender.com`
3. Redeploy frontend on Vercel
4. Clear browser cache (Ctrl+Shift+Delete)
5. Test again

### Error: "Network request failed"

**Solution:**
1. Verify backend URL: `https://skinlytics-rdk0.onrender.com`
2. Check Render free plan isn't causing delays (can take 30 seconds)
3. Try directly accessing: `https://skinlytics-rdk0.onrender.com/health`
4. If slow, consider upgrading Render plan

### Frontend shows old API URL

**Solution:**
1. Check `.env.production` has correct URL
2. Rebuild on Vercel: **Deployments → Redeploy**
3. Clear browser cache completely
4. Try incognito/private window

### Environment Variable Not Being Used

**Solution:**
1. **On Render:** 
   - Manual Deploy (not just commit)
   - Wait for service to restart
   - Check logs in Render dashboard

2. **On Vercel:**
   - Redeploy project
   - Check variable is marked for "Production"
   - Wait for build to complete

---

## 📝 File Summary

### Backend Files Updated
- ✅ `backend/main.py` - Uses environment variables for CORS
- ✅ `backend/.env` - Local configuration
- ✅ `.env.example` - Template for environment variables

### Frontend Files Updated
- ✅ `frontend/.env.production` - Production API URL
- ✅ `frontend/.env.local` - Local development API URL
- ✅ `frontend/src/services/api.ts` - Reads from environment

---

## 🔄 Deployment Flow

```
1. Commit & push backend code
   ↓
2. Set Render environment variables
   ↓
3. Deploy backend on Render
   ↓
4. Test backend: /health endpoint
   ↓
5. Commit & push frontend code
   ↓
6. Set Vercel environment variable
   ↓
7. Deploy frontend on Vercel
   ↓
8. Test frontend: Form submission
   ↓
9. Verify CORS works (Network tab in DevTools)
   ↓
✅ Production deployment complete!
```

---

## 🎯 What's Ready

✅ **Backend:**
- Updated to support environment-based CORS configuration
- Ready for Render deployment
- Supports multiple frontend URLs

✅ **Frontend:**
- Environment files set up for production
- API service reads from environment
- Ready for Vercel deployment

✅ **Configuration:**
- `.env.example` template created
- `.env.production` for frontend
- Environment variables documented

---

## 📞 Next Steps

1. **Go to Render Dashboard**
   - Add environment variables to skinlytics-rdk0 service
   - Manual Deploy to apply changes

2. **Go to Vercel Dashboard**
   - Add environment variable to skinlytics-lyart project
   - Redeploy project

3. **Test Connection**
   - Open frontend URL
   - Submit form
   - Check DevTools Network tab
   - Verify no CORS errors

4. **Monitor Logs**
   - **Render:** Settings → Logs
   - **Vercel:** Deployments → Logs

---

## ✨ Summary

Your deployment is now **configuration-ready**. The backend will accept requests from your Vercel frontend, and the frontend will automatically connect to your Render backend in production.

**Total setup time:** ~5 minutes  
**Cost:** Free (Render hobby plan + Vercel free)

---

**Last Updated:** April 28, 2026  
**Status:** ✅ Ready for Production Deployment
