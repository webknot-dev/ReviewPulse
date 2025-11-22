# Authentication Setup Guide

## ✅ What's Implemented

Google Sign-In authentication has been implemented for ReviewPulse. The code automatically creates the `users` collection in MongoDB when the first user signs in.

## 🔧 Setup Steps

### 1. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Google+ API** (or **Google Identity Services**)
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - Your production URL (for production)
7. Add authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - Your production URL (for production)
8. Copy the **Client ID**

### 2. Backend Environment Variables

Add to `backend/.env`:

```env
# Existing variables...
MONGODB_URI=mongodb://localhost:27017/reviewpulse

# New authentication variables
GOOGLE_CLIENT_ID=your_google_client_id_here
JWT_SECRET=your_random_secret_key_here_min_32_chars
```

**Important:** 
- `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID from step 1
- `JWT_SECRET`: Generate a random secret (e.g., use `openssl rand -base64 32`)

### 3. Frontend Environment Variables

Add to `frontend/.env.local`:

```env
# Existing variable...
NEXT_PUBLIC_API_URL=http://localhost:3001

# New authentication variable
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

**Note:** Use the same Client ID from step 1.

### 4. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

New packages added:
- Backend: `google-auth-library`, `jsonwebtoken`
- Frontend: `@react-oauth/google`

## 📊 Database Schema

The `users` collection is **automatically created** by Mongoose when the first user signs in. No manual setup needed!

**User Schema:**
```typescript
{
  googleId: string (unique, indexed)
  email: string (unique, indexed)
  name: string
  picture?: string
  createdAt: Date
  updatedAt: Date
}
```

## 🔐 How It Works

1. **User clicks "Sign in with Google"** → Google OAuth popup
2. **User authorizes** → Google returns access token
3. **Frontend sends token to backend** → `/api/auth/google`
4. **Backend verifies token** → Validates with Google
5. **Backend creates/updates user** → Stores in MongoDB
6. **Backend returns JWT token** → Frontend stores in localStorage
7. **All API requests include JWT** → Protected routes verify token

## 🛡️ Protected Routes

All review routes are now protected:
- `POST /api/reviews/fetch` - Requires authentication
- `POST /api/reviews/process` - Requires authentication
- `GET /api/reviews/insights/:placeId` - Requires authentication

## 🎨 Using Authentication in Frontend

### Check if user is authenticated:
```tsx
import { useAuth } from '@/app/providers/AuthProvider'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()
  
  if (!isAuthenticated) {
    return <button onClick={login}>Sign in</button>
  }
  
  return <div>Welcome, {user?.name}!</div>
}
```

### Protect a route:
```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function MyPage() {
  return (
    <ProtectedRoute>
      <YourContent />
    </ProtectedRoute>
  )
}
```

### Use Login Button:
```tsx
import { LoginButton } from '@/components/LoginButton'

function Header() {
  return (
    <header>
      <LoginButton />
    </header>
  )
}
```

## 🧪 Testing

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Open `http://localhost:3000`
4. Click "Sign in with Google"
5. Authorize with your Google account
6. You should be logged in!

## 🐛 Troubleshooting

**"Invalid Google token" error:**
- Check `GOOGLE_CLIENT_ID` in backend `.env`
- Verify Client ID matches in frontend `.env.local`
- Ensure authorized origins/redirects are set correctly

**"Authentication required" on API calls:**
- Check JWT token is stored: `localStorage.getItem('auth_token')`
- Verify token is sent in headers: Check browser Network tab
- Token might be expired (7 days), sign in again

**MongoDB connection error:**
- Ensure MongoDB is running
- Check `MONGODB_URI` in backend `.env`

## 📝 API Endpoints

### `POST /api/auth/google`
Sign in with Google token.

**Request:**
```json
{
  "token": "google_access_token"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "picture": "https://..."
  }
}
```

### `GET /api/auth/me`
Get current user (requires authentication).

**Headers:**
```
Authorization: Bearer jwt_token
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "picture": "https://..."
  }
}
```

## ✅ Summary

- ✅ Google Sign-In implemented
- ✅ JWT token authentication
- ✅ User model with MongoDB (auto-created)
- ✅ Protected API routes
- ✅ Frontend auth context & components
- ✅ Token storage & auto-injection

**No manual database setup needed!** The users collection is created automatically when the first user signs in.

