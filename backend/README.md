# WebReview Backend

Node.js + Express + TypeScript backend for WebReview.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (see `.env.example`):
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/webreview
OPENAI_API_KEY=your_key_here
GOOGLE_PLACES_API_KEY=your_key_here
FRONTEND_URL=http://localhost:3000
```

3. Start MongoDB (if using local):
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

4. Run development server:
```bash
npm run dev
```

Server will start on `http://localhost:3001`

## API Endpoints

- `POST /api/reviews/fetch` - Fetch reviews from Google Places
- `POST /api/reviews/process` - Process reviews with AI
- `GET /api/reviews/insights/:placeId` - Get insights for a place
- `GET /health` - Health check

See main README.md for detailed API documentation.

