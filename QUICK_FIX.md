# 🚨 QUICK FIX - Google Sign-In Setup

## The Problem
Google Sign-In shows "Missing required parameter: client_id" because `GOOGLE_CLIENT_ID` is not set.

## Quick Solution (5 minutes)

### Step 1: Get Your Google Client ID

1. **Go to:** https://console.cloud.google.com/
2. **Select your project** (or create new one)
3. **Enable APIs:**
   - Go to "APIs & Services" → "Library"
   - Search "Google Identity Services" → Enable
4. **Create OAuth Credential:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - If asked, configure OAuth consent screen:
     - User Type: **External**
     - App name: **ReviewPulse**
     - Your email
     - Save and Continue (skip other steps)
5. **Create OAuth Client:**
   - Application type: **Web application**
   - Name: **ReviewPulse Web**
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000`
   - Click **Create**
6. **Copy the Client ID** (looks like: `123456789-abc...apps.googleusercontent.com`)

### Step 2: Update Backend .env

Edit `backend/.env` and replace:
```
GOOGLE_CLIENT_ID=your_google_client_id_here
```
With your actual Client ID:
```
GOOGLE_CLIENT_ID=123456789-abc...apps.googleusercontent.com
```

### Step 3: Update Frontend .env.local

Edit `frontend/.env.local` and replace:
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```
With the **SAME** Client ID:
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abc...apps.googleusercontent.com
```

### Step 4: Restart Both Servers

**Backend:**
```bash
cd backend
# Stop server (Ctrl+C) then:
npm run dev
```

**Frontend:**
```bash
cd frontend
# Stop server (Ctrl+C) then:
npm run dev
```

## ✅ What I Fixed

1. ✅ **MONGODB_URI** - Set to your MongoDB Atlas connection string
2. ✅ **Backend .env** - Properly formatted with all variables
3. ✅ **Frontend .env.local** - Created with correct variables
4. ⚠️ **GOOGLE_CLIENT_ID** - **YOU NEED TO ADD THIS** (follow Step 1 above)

## 📝 Answers to Your Questions

**Q: DB value, i got it from mongodb we need to add this to env right?**
A: ✅ YES! I've added it as `MONGODB_URI` in your backend `.env` file.

**Q: What is MONGODB_URI?**
A: It's the connection string to your MongoDB database. I used your MongoDB Atlas connection string: `mongodb+srv://reviewpulse-user:webreviewpulse123@cluster0.8be6qqe.mongodb.net/reviewpulse`

**Q: How to find GOOGLE_CLIENT_ID value?**
A: Follow **Step 1** above - it takes 5 minutes to get it from Google Cloud Console.

## 🎯 After You Add GOOGLE_CLIENT_ID

1. Add the Client ID to both `.env` files (backend and frontend)
2. Restart both servers
3. Try signing in again - it should work!

