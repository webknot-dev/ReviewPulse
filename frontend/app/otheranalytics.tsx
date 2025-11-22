'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Star, TrendingUp, ThumbsUp, ThumbsDown } from 'lucide-react'
import './otheranalytics.css'

interface OtherAnalyticsProps {
  placeName?: string
  onNavigateBack?: () => void
}

export default function OtherAnalytics({ 
  placeName = 'Review Analytics', 
  onNavigateBack 
}: OtherAnalyticsProps) {
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState('Weekly')

  const handleBackNavigation = () => {
    if (onNavigateBack) {
      onNavigateBack()
    } else {
      router.push('/')
    }
  }

  // Mock data matching the design
  const metrics = {
    reviews: '8,547',
    avgRating: '4.2',
    sentiment: 'positive',
    change: '0%'
  }

  const timePeriods = ['Weekly', 'Monthly', 'Yearly', 'All Time']

  const positiveHighlights = [
    { 
      text: 'Exceptional customer service and friendly staff', 
      mentions: 1247,
      percentage: 100
    },
    { 
      text: 'Clean and well-maintained facilities', 
      mentions: 1089,
      percentage: 87
    },
    { 
      text: 'Great location with easy access to attractions', 
      mentions: 892,
      percentage: 72
    },
    { 
      text: 'Delicious breakfast with variety of options', 
      mentions: 743,
      percentage: 60
    },
    { 
      text: 'Comfortable beds and spacious rooms', 
      mentions: 621,
      percentage: 50
    }
  ]

  const negativeHighlights = [
    { 
      text: 'Slow Wi-Fi connection in some rooms', 
      mentions: 456,
      percentage: 100
    },
    { 
      text: 'Long wait times during check-in', 
      mentions: 389,
      percentage: 85
    },
    { 
      text: 'Parking is limited and expensive', 
      mentions: 312,
      percentage: 68
    },
    { 
      text: 'Air conditioning not working properly', 
      mentions: 267,
      percentage: 59
    },
    { 
      text: 'Noisy due to street traffic', 
      mentions: 198,
      percentage: 43
    }
  ]

  // Calculate max mentions for percentage calculation
  const maxPositiveMentions = Math.max(...positiveHighlights.map(h => h.mentions))
  const maxNegativeMentions = Math.max(...negativeHighlights.map(h => h.mentions))

  return (
    <div className="other-analytics-container">
      <div className="other-analytics-content">
        {/* Time Period Selector */}
        <div className="time-period-section">
          <span className="time-period-label">Time Period</span>
          <div className="time-period-buttons">
            {timePeriods.map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`time-period-button ${selectedPeriod === period ? 'active' : ''}`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Header Metrics */}
        <div className="metrics-header">
          <div className="metric-card-header">
            <span className="metric-label-header">Reviews</span>
            <span className="metric-value-header">{metrics.reviews}</span>
          </div>
          <div className="metric-card-header">
            <span className="metric-label-header">Avg Rating</span>
            <div className="rating-header">
              <span className="metric-value-header">{metrics.avgRating}</span>
              <Star className="star-icon-header" />
            </div>
          </div>
          <div className="metric-card-header">
            <span className="metric-label-header">Sentiment</span>
            <div className="sentiment-header">
              <span className="metric-value-header sentiment-positive">{metrics.sentiment}</span>
              <TrendingUp className="trend-icon-header positive" />
            </div>
          </div>
          <div className="metric-card-header">
            <span className="metric-label-header">Change</span>
            <span className="metric-value-header">{metrics.change}</span>
          </div>
        </div>

        {/* Main Content - Two Columns */}
        <div className="highlights-container">
          {/* Left Column: Positive Highlights */}
          <div className="highlights-card positive-card">
            <div className="card-header-section">
              <ThumbsUp className="card-icon positive-icon" />
              <div className="card-title-section">
                <h2 className="card-title">Top Positive Highlights</h2>
                <p className="card-subtitle">What customers love the most</p>
              </div>
            </div>
            <div className="highlights-list">
              {positiveHighlights.map((highlight, index) => {
                const percentage = (highlight.mentions / maxPositiveMentions) * 100
                return (
                  <div key={index} className="highlight-item positive-item">
                    <div className="highlight-content">
                      <p className="highlight-text">{highlight.text}</p>
                      <div className="highlight-bar-container">
                        <div 
                          className="highlight-bar positive-bar" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="highlight-meta">
                      <span className="highlight-mentions positive-badge">
                        {highlight.mentions} mentions
                      </span>
                      <TrendingUp className="trend-icon-small positive" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Negative Highlights */}
          <div className="highlights-card negative-card">
            <div className="card-header-section">
              <ThumbsDown className="card-icon negative-icon" />
              <div className="card-title-section">
                <h2 className="card-title">Top Negative Highlights</h2>
                <p className="card-subtitle">Common complaints and issues</p>
              </div>
            </div>
            <div className="highlights-list">
              {negativeHighlights.map((highlight, index) => {
                const percentage = (highlight.mentions / maxNegativeMentions) * 100
                return (
                  <div key={index} className="highlight-item negative-item">
                    <div className="highlight-content">
                      <p className="highlight-text">{highlight.text}</p>
                      <div className="highlight-bar-container">
                        <div 
                          className="highlight-bar negative-bar" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="highlight-meta">
                      <span className="highlight-mentions negative-badge">
                        {highlight.mentions} mentions
                      </span>
                      <TrendingUp className="trend-icon-small negative" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
