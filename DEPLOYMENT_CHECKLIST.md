# ✅ STEP-BY-STEP DEPLOYMENT CHECKLIST

**Follow this checklist to deploy your Skinlytix app!**

---

## 📋 PART 1: BACKEND SETUP (Render) - 5 MINUTES

### Step 1: Log in to Render
- [ ] Go to https://render.com/dashboard
- [ ] Log in with your account
- [ ] You should see your services

### Step 2: Open Your Backend Service
- [ ] Click on **skinlytics-rdk0** service
- [ ] You're now in the service details page

### Step 3: Open Settings
- [ ] Click the **Settings** tab (top menu)
- [ ] Scroll down to find **Environment Variables**

### Step 4: Add First Variable
- [ ] Click **Add Environment Variable**
- [ ] Copy-paste exactly:
  ```
  Name: FRONTEND_URL
  Value: https://skinlytics-lyart.vercel.app
  ```
- [ ] Click **Add** button

### Step 5: Add Second Variable
- [ ] Click **Add Environment Variable** again
- [ ] Copy-paste exactly:
  ```
  Name: CORS_ORIGINS
  Value: https://skinlytics-lyart.vercel.app,http://localhost:5173,http://localhost:3000
  ```
- [ ] Click **Add** button

### Step 6: Add Third Variable
- [ ] Click **Add Environment Variable** again
- [ ] Copy-paste exactly:
  ```
  Name: ENVIRONMENT
  Value: production
  ```
- [ ] Click **Add** button

### Step 7: Wait for Render
- [ ] Render automatically redeploys with new variables
- [ ] ⏱️ **Wait 2-3 minutes** for deployment to complete
- [ ] Check the **Logs** tab to see "Build succeeded"

### Step 8: Verify Backend
- [ ] Open new browser tab
- [ ] Go to: https://skinlytics-rdk0.onrender.com/health
- [ ] You should see: `{"status":"ok"}`
- [ ] ✅ If you see that, backend is ready!

---

## 🌐 PART 2: FRONTEND SETUP (Vercel) - 5 MINUTES

### Step 1: Log in to Vercel
- [ ] Go to https://vercel.com/dashboard
- [ ] Log in with your account
- [ ] You should see your projects

### Step 2: Open Your Frontend Project
- [ ] Click on **skinlytics-lyart** project
- [ ] You're now in the project details page

### Step 3: Open Settings
- [ ] Click the **Settings** tab (top menu)
- [ ] Scroll to find **Environment Variables**

### Step 4: Add the API URL Variable
- [ ] Click on **Environment Variables** section
- [ ] You might see existing variables (that's fine)
- [ ] Scroll to add a new one
- [ ] Copy-paste exactly:
  ```
  Name: VITE_API_URL
  Value: https://skinlytics-rdk0.onrender.com
  ```
- [ ] Make sure **Production** is checked ✓
- [ ] Click **Save** button

### Step 5: Redeploy Frontend
- [ ] Click on **Deployments** tab
- [ ] Find the latest deployment at the top
- [ ] Click the **⋮** (three dots) menu
- [ ] Select **Redeploy**
- [ ] Confirm when asked
- [ ] ⏱️ **Wait 1-2 minutes** for new build to complete

### Step 6: Verify Frontend
- [ ] Open new browser tab
- [ ] Go to: https://skinlytics-lyart.vercel.app/
- [ ] Page should load without errors
- [ ] ✅ If it loads, frontend is ready!

---

## 🧪 PART 3: TEST THE CONNECTION - 5 MINUTES

### Test 1: Check Console
- [ ] Open frontend: https://skinlytics-lyart.vercel.app/
- [ ] Press **F12** to open DevTools
- [ ] Go to **Console** tab
- [ ] Look for any red error messages
- [ ] ✅ Should be **NO RED ERRORS**

### Test 2: Fill the Form
- [ ] Close DevTools (or keep it open)
- [ ] Fill in the analysis form:
  - Skin Type: **Combination**
  - Sensitivity: **Yes**
  - Concern: **Acne**
- [ ] Click **"Analyze My Skin"** button

### Test 3: Check Network Request
- [ ] Open DevTools again (F12)
- [ ] Go to **Network** tab
- [ ] Submit the form
- [ ] Look for a request that starts with `api/predict`
- [ ] Click on that request
- [ ] Check the **Status** column
- [ ] ✅ Should show **200** (green)

### Test 4: Verify Results
- [ ] After form submission completes
- [ ] You should see results with:
  - Ingredient name
  - Confidence score
  - Product recommendations
- [ ] ✅ If all this appears, **EVERYTHING WORKS!**

---

## ❌ IF SOMETHING GOES WRONG

### Problem: CORS Error in Console
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
1. Go back to Render dashboard
2. Check that `CORS_ORIGINS` variable is set correctly
3. Click **Redeploy** manually in Render
4. Wait 2-3 minutes
5. Try again

### Problem: Cannot Connect / Network Error
```
Failed to fetch
Network request failed
```

**Solution:**
1. Go to Render: https://skinlytics-rdk0.onrender.com/health
2. Should show `{"status":"ok"}`
3. If not, wait 5 minutes (cold start)
4. Go back to Vercel and click **Redeploy**
5. Clear browser cache (Ctrl+Shift+Delete)
6. Try form again

### Problem: Vercel Environment Variable Not Working
```
Backend returns 404 or wrong URL
```

**Solution:**
1. Go to Vercel dashboard
2. Check `VITE_API_URL` variable is set for **Production**
3. Click **Redeploy** on latest deployment
4. Wait for new build to complete
5. Try again

### Problem: Form Submits but No Results
```
Form seems to work but no response
```

**Solution:**
1. Check browser DevTools → Network tab
2. Look for `api/predict` request
3. Click it and check the **Response** tab
4. If it shows error, something's wrong with backend
5. Check Render logs for errors

---

## ✨ SUCCESS CHECKLIST

When everything is working, you should have:

- [x] Backend environment variables set (3 variables on Render)
- [x] Frontend environment variable set (1 variable on Vercel)
- [x] Frontend redeployed on Vercel
- [x] Frontend loads: https://skinlytics-lyart.vercel.app/
- [x] Backend health shows: https://skinlytics-rdk0.onrender.com/health
- [x] Form submission completes without errors
- [x] Results display with ingredient recommendation
- [x] DevTools Network shows status 200 for API request
- [x] No red errors in DevTools console

---

## 📊 SUMMARY TABLE

| Step | Service | Action | Time | Status |
|------|---------|--------|------|--------|
| 1 | Render | Add 3 env variables | 2 min | ☐ |
| 2 | Render | Wait for redeploy | 3 min | ☐ |
| 3 | Render | Verify health endpoint | 1 min | ☐ |
| 4 | Vercel | Add 1 env variable | 1 min | ☐ |
| 5 | Vercel | Redeploy frontend | 2 min | ☐ |
| 6 | Vercel | Verify frontend loads | 1 min | ☐ |
| 7 | Testing | Test form submission | 2 min | ☐ |
| 8 | Testing | Verify network request | 1 min | ☐ |

**Total Time:** ~15 minutes

---

## 🎊 COMPLETED!

When you finish all steps:

1. ✅ Backend is running on Render
2. ✅ Frontend is running on Vercel
3. ✅ They can communicate with each other
4. ✅ Form submissions work end-to-end
5. ✅ Your app is deployed to production!

---

## 📞 REFERENCE LINKS

- Frontend: https://skinlytics-lyart.vercel.app/
- Backend: https://skinlytics-rdk0.onrender.com/
- Render Dashboard: https://render.com/dashboard
- Vercel Dashboard: https://vercel.com/dashboard
- Deployment Guide: `DEPLOYMENT_GUIDE.md`
- Quick Setup: `QUICK_DEPLOYMENT_SETUP.md`

---

## 🚀 YOU'RE READY!

Print this checklist, follow it step by step, and you'll have your Skinlytix app deployed to production in 15 minutes!

**Good luck! 🎉**

---

Created: April 28, 2026
Last Updated: April 28, 2026
