# Quick Setup Guide

## 🚀 5-Minute Setup

### 1. Install Dependencies

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

### 2. Configure Environment Variables

**Backend** - Create `backend/.env`:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/webreview
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
FRONTEND_URL=http://localhost:3000
```

**Frontend** - Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Option B: MongoDB Atlas (Cloud)**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get connection string
- Update `MONGODB_URI` in `backend/.env`

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Open Browser

Navigate to: `http://localhost:3000`

## ✅ Testing Without API Keys

The app works with **mock data** if you don't have API keys:
- No Google Places API key → Uses mock reviews
- No OpenAI API key → Uses rating-based sentiment analysis

Just leave the API keys empty or use placeholder values!

## 🎯 First Test

1. Go to `http://localhost:3000`
2. Enter any Place ID (or leave empty for mock data)
3. Click "Analyze Reviews"
4. View the dashboard with insights!

## 🐛 Common Issues

**MongoDB Connection Error:**
- Make sure MongoDB is running
- Check `MONGODB_URI` in `.env`

**Port Already in Use:**
- Change `PORT` in backend `.env`
- Update `NEXT_PUBLIC_API_URL` in frontend `.env.local`

**CORS Errors:**
- Verify `FRONTEND_URL` matches your frontend URL
- Check backend is running on correct port

---

**Ready to go! 🚀**

