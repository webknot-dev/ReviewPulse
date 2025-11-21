# ReviewPulse 🚀

**AI-Powered Review Analysis Engine** - Analyze thousands of Google reviews instantly and extract meaningful insights.

## 🎯 Problem Statement

People depend heavily on online reviews before choosing hotels, schools, restaurants, products, tourist spots, or services. But these places often have thousands or even lakhs of reviews, spread across many years, making it impossible for normal users to read and understand overall sentiment.

**ReviewPulse solves this by:**
- ✅ Extracting top positive highlights
- ✅ Identifying common complaints
- ✅ Analyzing sentiment trends over time
- ✅ Providing AI-generated summaries
- ✅ Showing trends for last week/month/year/all time

## 🏗️ Project Structure

```
ReviewPulse/
├── backend/                 # Node.js + Express + TypeScript backend
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # MongoDB schemas (Place, Review, Insight)
│   │   ├── routes/         # API routes
│   │   ├── services/       # AI & Google Places services
│   │   ├── app.ts          # Express app setup
│   │   └── server.ts       # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/               # Next.js 14 + Tailwind CSS frontend
    ├── app/                # Next.js App Router
    │   ├── dashboard/      # Dashboard page
    │   ├── providers/      # React Query provider
    │   ├── layout.tsx      # Root layout
    │   └── page.tsx        # Home page
    ├── lib/                # Utilities & API client
    ├── package.json
    └── tsconfig.json
```

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express** - REST API server
- **TypeScript** - Type safety
- **MongoDB** + **Mongoose** - Database & ODM
- **OpenAI API** - AI-powered analysis (GPT-4o-mini)
- **Google Places API** - Review fetching (with mock fallback)

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **React Query** - Data fetching & caching
- **Axios** - HTTP client

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas account
- OpenAI API key (optional - will use fallback if not provided)
- Google Places API key (optional - will use mock data if not provided)

### Step 1: Clone & Navigate
```bash
cd ReviewPulse
```

### Step 2: Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/reviewpulse
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/reviewpulse

# OpenAI Configuration (Optional - will use fallback if not provided)
OPENAI_API_KEY=your_openai_api_key_here

# Google Places API Configuration (Optional - will use mock data if not provided)
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### Step 3: Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Step 4: Start MongoDB

**Local MongoDB:**
```bash
# macOS (using Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**OR use MongoDB Atlas** (cloud) - just update `MONGODB_URI` in backend `.env`

### Step 5: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🚀 Usage

1. **Open the app**: Navigate to `http://localhost:3000`
2. **Enter a Place ID**: 
   - You can use any Google Place ID
   - Example: `ChIJN1t_tDeuEmsRUsoyG83frY4`
   - If you don't have one, the app will use mock data for testing
3. **Click "Analyze Reviews"**: The app will:
   - Fetch reviews from Google Places API (or use mock data)
   - Process them with AI to extract insights
   - Display results on the dashboard

## 📊 Features

### Dashboard Features
- **AI Summary**: Overall summary of all reviews
- **Sentiment Analysis**: Positive, negative, and neutral breakdown
- **Positive Highlights**: What people are praising
- **Common Complaints**: What people are complaining about
- **Topic Extraction**: Most mentioned topics
- **Trend Analysis**: Compare trends across different time periods
- **Interactive Charts**: Visual representation of data

### Time Range Filtering
- **All Time**: Complete review history
- **Last Year**: Reviews from the past year
- **Last Month**: Reviews from the past month
- **Last Week**: Reviews from the past week

*Note: Time range options automatically hide if the place is too new (e.g., no "Last Year" for a 1-month-old place)*

## 🔌 API Endpoints

### `POST /api/reviews/fetch`
Fetch reviews from Google Places API.

**Request:**
```json
{
  "placeId": "ChIJN1t_tDeuEmsRUsoyG83frY4",
  "dateRange": "all" // "week" | "month" | "year" | "all"
}
```

**Response:**
```json
{
  "success": true,
  "place": {
    "placeId": "...",
    "name": "...",
    "address": "..."
  },
  "reviews": [...],
  "totalReviews": 150
}
```

### `POST /api/reviews/process`
Process reviews with AI analysis.

**Request:**
```json
{
  "placeId": "ChIJN1t_tDeuEmsRUsoyG83frY4",
  "reviews": [...]
}
```

**Response:**
```json
{
  "success": true,
  "insight": {
    "summary": "...",
    "positiveHighlights": [...],
    "negativeHighlights": [...],
    "sentimentBreakdown": {...},
    "topics": [...],
    "trends": {...}
  }
}
```

### `GET /api/reviews/insights/:placeId`
Get processed insights for a place.

**Response:**
```json
{
  "success": true,
  "insight": {...},
  "place": {...}
}
```

## 🧠 AI Processing

The AI service processes reviews in chunks and:
1. **Chunks reviews** into batches of 20
2. **Generates summaries** for each chunk
3. **Extracts topics** with sentiment
4. **Analyzes sentiment** (positive/negative/neutral)
5. **Merges insights** into final summary
6. **Extracts highlights** (positive & negative)
7. **Calculates trends** for different time periods

## 🗄️ Database Schema

### Places Collection
```typescript
{
  placeId: string (unique, indexed)
  name: string
  address?: string
  types?: string[]
  rating?: number
  totalReviews?: number
  metadata?: object
  createdAt: Date
  updatedAt: Date
}
```

### Reviews Collection
```typescript
{
  placeId: string (indexed)
  author: string
  rating: number (1-5)
  text: string
  time: Date
  sentiment?: 'positive' | 'negative' | 'neutral'
  topics?: string[]
  createdAt: Date
  updatedAt: Date
}
```

### Insights Collection
```typescript
{
  placeId: string (unique, indexed)
  summary: string
  positiveHighlights: string[]
  negativeHighlights: string[]
  sentimentBreakdown: {
    positive: number
    negative: number
    neutral: number
  }
  topics: Array<{
    name: string
    count: number
    sentiment: 'positive' | 'negative' | 'neutral'
  }>
  trends: {
    week?: TrendData
    month?: TrendData
    year?: TrendData
    all?: TrendData
  }
  lastProcessed: Date
  createdAt: Date
  updatedAt: Date
}
```

## 🔧 Development

### Backend Commands
```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm start        # Start production server
npm run type-check  # Type check without building
```

### Frontend Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🧪 Testing with Mock Data

The app works without API keys using mock data:
- **No Google Places API key?** → Uses mock reviews
- **No OpenAI API key?** → Uses fallback analysis based on ratings

This makes it perfect for development and testing!

## 📝 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 3001)
- `MONGODB_URI` - MongoDB connection string
- `OPENAI_API_KEY` - OpenAI API key (optional)
- `GOOGLE_PLACES_API_KEY` - Google Places API key (optional)
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - Backend API URL

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or check MongoDB Atlas connection string
- Verify `MONGODB_URI` in backend `.env`

### API Errors
- Check that backend is running on port 3001
- Verify `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Check CORS settings in backend

### OpenAI API Errors
- Verify `OPENAI_API_KEY` is set correctly
- Check API key has sufficient credits
- App will use fallback analysis if API fails

## 🚧 Future Enhancements

- [ ] Support for multiple review sources (Yelp, TripAdvisor, etc.)
- [ ] Real-time review monitoring
- [ ] Email/SMS alerts for sentiment changes
- [ ] Export insights as PDF/CSV
- [ ] Multi-language support
- [ ] Advanced filtering options
- [ ] Review comparison between places

## 📄 License

MIT License - feel free to use this for your hackathon project!

## 👥 Contributors

Built for Webknathon 2025 🎉

---

**Happy Hacking! 🚀**
