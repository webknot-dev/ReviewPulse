'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, ThumbsUp, ThumbsDown, Star, TrendingUp } from 'lucide-react'
import './analyticspage.css'
import colors from '@/lib/colors'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts'

interface AnalyticsPageProps {
  placeId?: string
  onNavigateBack?: () => void
}

export default function AnalyticsPage({ placeId = 'The Grand Hotel, New York', onNavigateBack }: AnalyticsPageProps) {
  const router = useRouter()
  
  const handleBackNavigation = () => {
    if (onNavigateBack) {
      onNavigateBack()
    } else {
      router.push('/')
    }
  }
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year' | 'all'>('all')

  // Mock data for demonstration - bypassing API calls to avoid network errors
  const mockData = {
    insight: {
      placeId: placeId,
      summary: 'Overall positive sentiment with excellent service ratings',
      positiveHighlights: [
        'Exceptional customer service and friendly staff',
        'Clean and well-maintained facilities',
        'Great location with easy access to attractions',
        'Delicious breakfast with variety of options',
        'Comfortable beds and spacious rooms'
      ],
      negativeHighlights: [
        'Slow Wi-Fi connection in some rooms',
        'Long wait times during check-in',
        'Parking is limited and expensive',
        'Air conditioning not working properly',
        'Noisy due to street traffic'
      ],
      sentimentBreakdown: {
        positive: 6547,
        negative: 1456,
        neutral: 544
      },
      topics: [
        { name: 'service', count: 1847, sentiment: 'positive' as const },
        { name: 'location', count: 1523, sentiment: 'positive' as const },
        { name: 'clean', count: 1234, sentiment: 'positive' as const },
        { name: 'breakfast', count: 1098, sentiment: 'positive' as const },
        { name: 'staff', count: 982, sentiment: 'positive' as const },
        { name: 'wifi', count: 678, sentiment: 'negative' as const },
        { name: 'parking', count: 567, sentiment: 'negative' as const },
        { name: 'comfortable', count: 834, sentiment: 'positive' as const },
        { name: 'noisy', count: 423, sentiment: 'negative' as const },
        { name: 'value', count: 756, sentiment: 'positive' as const }
      ],
      trends: {
        all: {
          period: 'all',
          averageRating: 4.2,
          totalReviews: 8547,
          sentimentBreakdown: {
            positive: 6547,
            negative: 1456,
            neutral: 544
          }
        }
      },
      lastProcessed: new Date().toISOString()
    },
    place: {
      placeId: placeId,
      name: placeId, // Use the placeId as the display name
      address: 'New York, NY',
      rating: 4.2,
      totalReviews: 8547
    }
  }

  const { insight, place } = mockData

  // Calculate total reviews
  const totalReviews =
    insight.sentimentBreakdown.positive +
    insight.sentimentBreakdown.negative +
    insight.sentimentBreakdown.neutral

  // Calculate average rating (assuming from trends data)
  const avgRating = insight.trends.all?.averageRating || 4.2

  // Determine sentiment
  const sentiment =
    insight.sentimentBreakdown.positive > insight.sentimentBreakdown.negative
      ? 'positive'
      : insight.sentimentBreakdown.negative > insight.sentimentBreakdown.positive
        ? 'negative'
        : 'neutral'

  // Prepare highlights with mention counts (using mock data to match the design)
  const positiveHighlightsWithCounts = [
    { text: 'Exceptional customer service and friendly staff', mentions: 1247 },
    { text: 'Clean and well-maintained facilities', mentions: 1089 },
    { text: 'Great location with easy access to attractions', mentions: 892 },
    { text: 'Delicious breakfast with variety of options', mentions: 743 },
    { text: 'Comfortable beds and spacious rooms', mentions: 621 },
  ]

  const negativeHighlightsWithCounts = [
    { text: 'Slow Wi-Fi connection in some rooms', mentions: 456 },
    { text: 'Long wait times during check-in', mentions: 389 },
    { text: 'Parking is limited and expensive', mentions: 312 },
    { text: 'Air conditioning not working properly', mentions: 267 },
    { text: 'Noisy due to street traffic', mentions: 198 },
  ]

  // Prepare trend data for line chart (monthly data)
  const monthlyTrendData = [
    { month: 'Jan', rating: 1.8, reviews: 400 },
    { month: 'Feb', rating: 2.2, reviews: 550 },
    { month: 'Mar', rating: 3.0, reviews: 700 },
    { month: 'Apr', rating: 3.2, reviews: 800 },
    { month: 'May', rating: 3.7, reviews: 900 },
    { month: 'Jun', rating: 3.9, reviews: 1000 },
    { month: 'Jul', rating: 4.5, reviews: 1100 },
    { month: 'Aug', rating: 4.3, reviews: 1000 },
    { month: 'Sep', rating: 4.1, reviews: 950 },
    { month: 'Oct', rating: 4.2, reviews: 1000 },
    { month: 'Nov', rating: 3.7, reviews: 800 },
    { month: 'Dec', rating: 4.0, reviews: 900 },
  ]

  // Prepare keywords data (mock data to match the design)
  const keywords = [
    { name: 'service', count: 1847, sentiment: 'positive' },
    { name: 'location', count: 1523, sentiment: 'positive' },
    { name: 'clean', count: 1234, sentiment: 'positive' },
    { name: 'breakfast', count: 1098, sentiment: 'positive' },
    { name: 'staff', count: 982, sentiment: 'positive' },
    { name: 'wifi', count: 678, sentiment: 'negative' },
    { name: 'parking', count: 567, sentiment: 'negative' },
    { name: 'comfortable', count: 834, sentiment: 'positive' },
    { name: 'noisy', count: 423, sentiment: 'negative' },
    { name: 'value', count: 756, sentiment: 'positive' },
  ]

  // Get max mentions for bar scaling
  const maxPositiveMentions = Math.max(...positiveHighlightsWithCounts.map((h: { text: string; mentions: number }) => h.mentions), 1)
  const maxNegativeMentions = Math.max(...negativeHighlightsWithCounts.map((h: { text: string; mentions: number }) => h.mentions), 1)

  return (
    <div className="analytics-container">
      <div className="analytics-content">
        {/* Header */}
        <div className="analytics-header-section">
          <button onClick={handleBackNavigation} className="analytics-new-search-button">
            <ArrowLeft className="analytics-back-icon" />
            <span>New Search</span>
          </button>
          <div className="analytics-header-info">
            <h1 className="analytics-title">{place?.name || 'Review Insights'}</h1>
            <div className="analytics-header-stats">
              <span className="analytics-review-count">
                {totalReviews.toLocaleString()} reviews
              </span>
              <span className="analytics-header-separator">•</span>
              <span className="analytics-header-rating">
                {avgRating.toFixed(1)}
              </span>
              <Star className="analytics-star-icon" />
            </div>
          </div>
        </div>

        {/* Time Period Selector */}
        <div className="analytics-time-period-section">
          <div className="analytics-time-period-header">
            <Calendar className="analytics-calendar-icon" />
            <h2 className="analytics-time-period-title">Select Time Period</h2>
          </div>
          <div className="analytics-date-range-container">
            {['week', 'month', 'year', 'all'].map((range) => {
              const isAvailable = insight.trends[range as keyof typeof insight.trends]
              if (!isAvailable && range !== 'all') return null
              return (
                <button
                  key={range}
                  onClick={() => setDateRange(range as 'week' | 'month' | 'year' | 'all')}
                  className={`analytics-date-button ${dateRange === range ? 'active' : ''}`}
                >
                  {range === 'all' ? 'All Time' : `Last ${range.charAt(0).toUpperCase() + range.slice(1)}`}
                </button>
              )
            })}
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="analytics-metrics-grid">
          <div className="analytics-metric-card">
            <p className="analytics-metric-label">Reviews</p>
            <p className="analytics-metric-value">{totalReviews.toLocaleString()}</p>
          </div>
          <div className="analytics-metric-card">
            <p className="analytics-metric-label">Avg Rating</p>
            <div className="analytics-metric-rating">
              <p className="analytics-metric-value">{avgRating.toFixed(1)}</p>
              <Star className="analytics-metric-star" />
            </div>
          </div>
          <div className="analytics-metric-card">
            <p className="analytics-metric-label">Sentiment</p>
            <p className={`analytics-metric-value analytics-sentiment-${sentiment}`}>
              {sentiment}
            </p>
          </div>
          <div className="analytics-metric-card">
            <p className="analytics-metric-label">Change</p>
            <p className="analytics-metric-value">0%</p>
          </div>
        </div>

        {/* Highlights Grid */}
        <div className="analytics-highlights-grid">
          {/* Positive Highlights */}
          <div className="analytics-highlight-card analytics-highlight-positive">
            <div className="analytics-highlight-header">
              <ThumbsUp className="analytics-highlight-icon positive" />
              <div>
                <h2 className="analytics-highlight-title">Top Positive Highlights</h2>
                <p className="analytics-highlight-subtitle">What customers love the most</p>
              </div>
            </div>
            <ul className="analytics-highlight-list">
              {positiveHighlightsWithCounts.map((highlight: { text: string; mentions: number }, idx: number) => (
                <li key={idx} className="analytics-highlight-item">
                  <div className="analytics-highlight-number">{idx + 1}.</div>
                  <div className="analytics-highlight-content">
                    <p className="analytics-highlight-text">{highlight.text}</p>
                    <div className="analytics-highlight-bar-container">
                      <div
                        className="analytics-highlight-bar positive"
                        style={{
                          width: `${(highlight.mentions / maxPositiveMentions) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="analytics-highlight-mentions-badge">
                    {highlight.mentions} mentions
                  </div>
                  <TrendingUp className="analytics-highlight-trend positive" />
                </li>
              ))}
            </ul>
          </div>

          {/* Negative Highlights */}
          <div className="analytics-highlight-card analytics-highlight-negative">
            <div className="analytics-highlight-header">
              <ThumbsDown className="analytics-highlight-icon negative" />
              <div>
                <h2 className="analytics-highlight-title">Top Negative Highlights</h2>
                <p className="analytics-highlight-subtitle">Common complaints and issues</p>
              </div>
            </div>
            <ul className="analytics-highlight-list">
              {negativeHighlightsWithCounts.map((highlight: { text: string; mentions: number }, idx: number) => (
                <li key={idx} className="analytics-highlight-item">
                  <div className="analytics-highlight-number">{idx + 1}.</div>
                  <div className="analytics-highlight-content">
                    <p className="analytics-highlight-text">{highlight.text}</p>
                    <div className="analytics-highlight-bar-container">
                      <div
                        className="analytics-highlight-bar negative"
                        style={{
                          width: `${(highlight.mentions / maxNegativeMentions) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="analytics-highlight-mentions-badge negative">
                    {highlight.mentions} mentions
                  </div>
                  <TrendingUp className="analytics-highlight-trend negative" />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sentiment Trend Chart */}
        <div className="analytics-trend-chart-card">
          <h2 className="analytics-chart-title">Sentiment Trend Over Time</h2>
          <p className="analytics-chart-subtitle">Track how customer satisfaction has evolved.</p>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={monthlyTrendData}>
              <defs>
                <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.chartBlue} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors.chartBlue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" label={{ value: 'Rating', angle: -90, position: 'insideLeft' }} />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{ value: 'Reviews', angle: 90, position: 'insideRight' }}
              />
              <Tooltip />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="rating"
                stroke={colors.chartBlue}
                fillOpacity={1}
                fill="url(#colorRating)"
                name="Average Rating"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="reviews"
                stroke={colors.chartGreen}
                strokeWidth={2}
                dot={{ fill: colors.chartGreen, r: 4 }}
                name="Number of Reviews"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Frequently Mentioned Keywords */}
        <div className="analytics-keywords-card">
          <h2 className="analytics-chart-title">Frequently Mentioned Keywords</h2>
          <p className="analytics-chart-subtitle">Most discussed topics in reviews</p>
          <div className="analytics-keywords-container">
            {keywords.map((keyword: { name: string; count: number; sentiment: string }, idx: number) => (
              <div
                key={idx}
                className={`analytics-keyword-tag ${
                  keyword.sentiment === 'positive'
                    ? 'positive'
                    : keyword.sentiment === 'negative'
                      ? 'negative'
                      : 'neutral'
                }`}
              >
                <span className="analytics-keyword-name">{keyword.name}</span>
                <span className="analytics-keyword-count">{keyword.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
