# Codespaces CORS + Mixed Content Setup Guide

## ✅ Changes Made

1. **Created environment files:**
   - [.env.local](.env.local) — Your local/Codespaces configuration (don't commit this)
   - [.env.example](.env.example) — Template for reference

2. **Updated [src/api.ts](src/api.ts):**
   - Now uses `import.meta.env.VITE_API_URL` from your .env.local file
   - Automatically falls back to `http://localhost:8000` if not set

3. **Updated [../../backend/app.py](../../backend/app.py):**
   - CORS now allows local development ports
   - Added comments showing where to add Codespaces URLs

## 🔧 How to Setup in Codespaces

### Step 1: Get Your Codespaces URLs

1. Look at the bottom panel in VS Code for the **Ports** tab
2. If you don't see it, use: **View → Ports** or **Ctrl+Shift+\`**
3. Find your running services and note their **Forwarded Address**:
   - **Backend port 8000**: `https://xxx-8000.app.github.dev`
   - **Frontend port 5173**: `https://xxx-5173.app.github.dev`

Example Codespaces ports might look like:
```
https://solid-invention-x5r94jj4qg64h9xpw-8000.app.github.dev  ← Backend
https://solid-invention-x5r94jj4qg64h9xpw-5173.app.github.dev  ← Frontend
```

### Step 2: Update Frontend Configuration

Edit the frontend `.env.local` file with your backend URL:

```env
# .env.local
VITE_API_URL=https://solid-invention-x5r94jj4qg64h9xpw-8000.app.github.dev
```

The frontend will now use this HTTPS URL instead of `http://localhost:8000`.

### Step 3: Update Backend CORS

Edit [backend/app.py](../../backend/app.py) and add your Codespaces frontend URL:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Local development
        "http://localhost:3000",   # Alternative local port
        "https://solid-invention-x5r94jj4qg64h9xpw-5173.app.github.dev"  # ← ADD YOUR CODESPACES URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Step 4: Make Port 8000 Public (Important!)

1. Go to **Ports** tab
2. Right-click on **port 8000**
3. Select **Port Visibility → Public**

This prevents authentication errors when the frontend tries to reach the backend.

### Step 5: Restart Your Services

After making changes:
- **Backend:** Stop and restart your FastAPI server
- **Frontend:** The Vite dev server will auto-reload when you save `.env.local`

## 🧪 Testing

1. Open your frontend Codespaces URL in browser
2. Try the predict or taxi simulation features
3. Check browser console (F12 → Network tab) to verify:
   - Requests go to your HTTPS Codespaces backend URL
   - No CORS errors appear
   - Response status is 200-300

## 📝 Environment Variables Reference

| Variable | Value | Where to Get |
|----------|-------|-------------|
| `VITE_API_URL` | Your backend's Codespaces HTTPS URL | Ports tab → port 8000 → Forwarded Address |

## ⚙️ For Local Development

When running locally (not in Codespaces):
- `.env.local` defaults to `http://localhost:8000`
- Both frontend and backend run on localhost
- No CORS issues on localhost
- Everything works as before

## ❌ Common Issues

| Issue | Solution |
|-------|----------|
| Still getting CORS errors | Check `.env.local` has HTTPS URL, backend CORS list includes frontend URL |
| Mixed content errors | Verify using HTTPS, not HTTP (check `.env.local`) |
| 404 errors to API | Verify port 8000 is running and URL is correct in `.env.local` |
| Backend can't find frontend | Make sure port 8000 is set to Public in Ports tab |

## 🚀 Next Steps

1. **Copy your Codespaces URLs** from the Ports tab
2. **Update `.env.local`** with your backend URL
3. **Update `backend/app.py`** with your frontend URL
4. **Set port 8000 to Public**
5. **Restart services** and test!
