# Backend Environment Variables Setup Guide

## Quick Answers to Your Questions

### 1. Is DB and MONGODB_URI the same?
**Yes!** `MONGODB_URI` is the full connection string to your MongoDB database. It includes:
- The protocol (`mongodb://`)
- The host and port (`localhost:27017`)
- The database name (`reviewpulse`)

**Example:** `mongodb://localhost:27017/reviewpulse`

### 2. PORT - What is it?
**PORT** is the port number where your backend server will run.
- Default: `3001` (if not set)
- Your backend will be accessible at: `http://localhost:3001`
- This is like a "door number" for your server

### 3. GOOGLE_CLIENT_ID - How to get it?

**Step-by-step:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **Create a new project** (or select existing one)
   - Click "Select a project" → "New Project"
   - Give it a name like "ReviewPulse"
3. **Enable Google Identity Services API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google Identity Services" or "Google+ API"
   - Click "Enable"
4. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - If prompted, configure OAuth consent screen first:
     - User Type: External
     - App name: ReviewPulse
     - Support email: your email
     - Save and continue through the steps
5. **Create OAuth Client ID**
   - Application type: **Web application**
   - Name: ReviewPulse Web Client
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000`
   - Click "Create"
6. **Copy the Client ID** - It looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`
7. **Paste it in your .env file** as `GOOGLE_CLIENT_ID`

### 4. JWT_SECRET - How to get it?

**JWT_SECRET** is a random secret key used to sign/encrypt authentication tokens.

**I've generated one for you:**
```
dfkdctxyw9eqRXMGmSie1oMr7/pwRV/AO6Vp1IpxVSo=
```

**To generate a new one yourself:**
```bash
openssl rand -base64 32
```

**Important:** 
- Keep this secret! Don't share it publicly
- Use a different one for production
- Minimum 32 characters recommended

---

## Complete .env File Template

Create a file named `.env` in the `backend/` folder with this content:

```env
# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/reviewpulse

# Authentication
GOOGLE_CLIENT_ID=your_google_client_id_here
JWT_SECRET=dfkdctxyw9eqRXMGmSie1oMr7/pwRV/AO6Vp1IpxVSo=

# API Keys
OPENAI_API_KEY=your_openai_or_google_ai_key_here
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
```

---

## How to Create the .env File

**Option 1: Using Terminal**
```bash
cd /Users/mothichandrarayal/Desktop/Webknathon/ReviewPulse/backend
touch .env
# Then open it in your editor and paste the template above
```

**Option 2: Using Your Code Editor**
1. In your editor, create a new file in `backend/` folder
2. Name it exactly `.env` (with the dot at the beginning)
3. Paste the template above
4. Replace the placeholder values with your actual keys

---

## Required vs Optional Variables

### Required (for authentication to work):
- ✅ `GOOGLE_CLIENT_ID` - Needed for Google Sign-In
- ✅ `JWT_SECRET` - Needed to create authentication tokens
- ✅ `MONGODB_URI` - Needed to store user data (or server will warn but continue)

### Optional (for full functionality):
- `OPENAI_API_KEY` - Needed for AI review analysis
- `GOOGLE_PLACES_API_KEY` - Needed to fetch real Google reviews (will use mock data if missing)
- `PORT` - Has default value (3001)
- `FRONTEND_URL` - Has default value (http://localhost:3000)

---

## Testing Your Setup

After creating your `.env` file:

1. **Restart your backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Check if MongoDB is running** (optional but recommended):
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Or check if it's already running
   lsof -i :27017
   ```

3. **Test the health endpoint:**
   ```bash
   curl http://localhost:3001/health
   ```

---

## Quick Reference

| Variable | Purpose | Example Value |
|----------|---------|---------------|
| `PORT` | Server port | `3001` |
| `MONGODB_URI` | Database connection | `mongodb://localhost:27017/reviewpulse` |
| `GOOGLE_CLIENT_ID` | Google OAuth ID | `123456789-abc...apps.googleusercontent.com` |
| `JWT_SECRET` | Token encryption key | `dfkdctxyw9eqRXMGmSie1oMr7/pwRV/AO6Vp1IpxVSo=` |
| `OPENAI_API_KEY` | AI service key | `sk-...` or Google AI key |
| `GOOGLE_PLACES_API_KEY` | Places API key | `AIza...` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

---

## Need Help?

- **Google OAuth Setup:** https://developers.google.com/identity/protocols/oauth2
- **MongoDB Setup:** https://www.mongodb.com/docs/manual/installation/
- **JWT Info:** https://jwt.io/introduction

