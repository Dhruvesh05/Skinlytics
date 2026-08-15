# 🎯 RENDER ENVIRONMENT VARIABLES - COPY & PASTE

**Go to:** https://render.com/dashboard → skinlytics-rdk0 → Settings → Environment Variables

**Then paste each variable:**

---

## Variable 1: FRONTEND_URL

```
Name: FRONTEND_URL
Value: https://skinlytics-lyart.vercel.app
```

Click **Add**

---

## Variable 2: CORS_ORIGINS

```
Name: CORS_ORIGINS
Value: https://skinlytics-lyart.vercel.app,http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173
```

Click **Add**

---

## Variable 3: ENVIRONMENT

```
Name: ENVIRONMENT
Value: production
```

Click **Add**

---

## ✅ After Adding:

Render will **automatically redeploy** your backend.

⏱️ **Wait 2-3 minutes** for deployment to complete.

Then test: https://skinlytics-rdk0.onrender.com/health

Should return: `{"status":"ok"}`

---

## 🔗 Production URLs

- **Frontend:** https://skinlytics-lyart.vercel.app
- **Backend:** https://skinlytics-rdk0.onrender.com
- **Backend Health:** https://skinlytics-rdk0.onrender.com/health

---

## 📱 CORS_ORIGINS Breakdown

The `CORS_ORIGINS` value includes:
- `https://skinlytics-lyart.vercel.app` ← Your production frontend
- `http://localhost:3000` ← For local development
- `http://localhost:5173` ← For local development (Vite)
- `http://127.0.0.1:3000` ← For local development (IP)
- `http://127.0.0.1:5173` ← For local development (IP)

This allows:
✅ Production: Frontend on Vercel can access backend on Render
✅ Development: Local frontend can access backend for testing
