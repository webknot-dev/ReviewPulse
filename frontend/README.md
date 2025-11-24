# WebReview Frontend

Next.js 14 + Tailwind CSS frontend for WebReview.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

3. Run development server:
```bash
npm run dev
```

Frontend will start on `http://localhost:3000`

## Pages

- `/` - Home page with Place ID input
- `/dashboard/[placeId]` - Dashboard with insights and charts

## Features

- Modern UI with Tailwind CSS
- Interactive charts with Recharts
- Real-time data fetching with React Query
- Responsive design
- Dark mode support

