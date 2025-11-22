'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, TrendingUp, Star, MapPin, Phone, Activity, Gamepad2, Theater, LineChart } from 'lucide-react'
import './venue-analytics.css'

interface VenueAnalyticsProps {
  venueName?: string
  onNavigateBack?: () => void
}

export default function VenueAnalytics({ 
  venueName = 'Venue Analytics', 
  onNavigateBack 
}: VenueAnalyticsProps) {
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly')

  const handleBackNavigation = () => {
    if (onNavigateBack) {
      onNavigateBack()
    } else {
      router.push('/')
    }
  }

  // Mock data matching the design
  const metricsData = {
    totalReviews: { value: '1,287', trend: 'up', change: '+12.5% vs last month' },
    averageRating: { value: '4.7', maxValue: '5', trend: 'up', change: '+0.2 vs last month' }
  }

  const timePeriods = ['Weekly', 'Monthly', 'Yearly', 'All Time']

  const topActivities = [
    { 
      name: 'Thrill Rides', 
      icon: Activity, 
      description: 'Mentioned in 45% of positive reviews.' 
    },
    { 
      name: 'Arcade Zone', 
      icon: Gamepad2, 
      description: 'Top-rated for family fun.' 
    },
    { 
      name: 'Live Shows', 
      icon: Theater, 
      description: 'Praised for high production value.' 
    }
  ]

  const audioVideoQuality = {
    score: '9.2',
    maxScore: '10',
    label: 'Excellent',
    percentage: 92
  }

  const cleanliness = {
    score: '8.5',
    maxScore: '10',
    label: 'Very Good',
    percentage: 85
  }

  const parkingAvailability = {
    percentage: 78,
    label: 'Positive Sentiment'
  }

  const familyFriendly = {
    percentage: 95,
    label: 'Highly Recommended'
  }

  const ambianceTags = [
    { text: 'Peaceful', color: 'green' },
    { text: 'Lively', color: 'yellow' },
    { text: 'Scenic', color: 'blue' }
  ]

  const venueInfo = {
    address: '123 Funland Drive, Entertainment City, 45678',
    phone: '(555) 123-4567'
  }

  return (
    <div className="venue-analytics-container">
      <div className="venue-analytics-content">
        {/* Header */}
        <div className="venue-header">
          <div className="venue-title-section">
            <h1 className="venue-title">Venue Analytics Dashboard</h1>
            <p className="venue-subtitle">Key insights from customer reviews.</p>
          </div>
          <button className="export-button">
            <Download className="export-icon" />
            Export Data
          </button>
        </div>

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

        {/* Top Metrics Row */}
        <div className="metrics-row">
          <div className="metric-card reviews-card">
            <div className="metric-header">
              <span className="metric-label">Total Reviews</span>
              <LineChart className="metric-graph-icon" />
            </div>
            <div className="metric-value">{metricsData.totalReviews.value}</div>
            <div className="metric-trend">
              <TrendingUp className="trend-icon up" />
              <span className="trend-text">{metricsData.totalReviews.change}</span>
            </div>
          </div>

          <div className="metric-card rating-card">
            <span className="metric-label">Average Rating</span>
            <div className="rating-display">
              <span className="metric-value">{metricsData.averageRating.value}</span>
              <span className="metric-max">/{metricsData.averageRating.maxValue}</span>
            </div>
            <div className="stars-display">
              <Star className="star-icon filled" />
              <Star className="star-icon filled" />
              <Star className="star-icon filled" />
              <Star className="star-icon filled" />
              <Star className="star-icon partial" />
            </div>
            <div className="metric-trend">
              <TrendingUp className="trend-icon up" />
              <span className="trend-text">{metricsData.averageRating.change}</span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="content-grid">
          {/* Top 3 Most-Loved Activities */}
          <div className="insight-card activities-card">
            <h3 className="card-title">Top 3 Most-Loved Activities</h3>
            <div className="activities-list">
              {topActivities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon-wrapper">
                    <activity.icon className="activity-icon" />
                  </div>
                  <div className="activity-info">
                    <span className="activity-name">{activity.name}</span>
                    <span className="activity-description">{activity.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audio/Video Quality */}
          <div className="insight-card quality-card">
            <h3 className="card-title">Audio/Video Quality</h3>
            <div className="score-display">
              <span className="score-value">{audioVideoQuality.score}</span>
              <span className="score-max">/{audioVideoQuality.maxScore}</span>
            </div>
            <div className="score-label positive">{audioVideoQuality.label}</div>
            <div className="progress-bar">
              <div 
                className="progress-fill positive" 
                style={{ width: `${audioVideoQuality.percentage}%` }}
              />
            </div>
          </div>

          {/* Cleanliness */}
          <div className="insight-card cleanliness-card">
            <h3 className="card-title">Cleanliness</h3>
            <div className="score-display">
              <span className="score-value">{cleanliness.score}</span>
              <span className="score-max">/{cleanliness.maxScore}</span>
            </div>
            <div className="score-label positive">{cleanliness.label}</div>
            <div className="progress-bar">
              <div 
                className="progress-fill positive" 
                style={{ width: `${cleanliness.percentage}%` }}
              />
            </div>
          </div>

          {/* Parking Availability */}
          <div className="insight-card parking-card">
            <h3 className="card-title">Parking Availability</h3>
            <div className="percentage-display">
              <span className="percentage-value">{parkingAvailability.percentage}%</span>
            </div>
            <div className="score-label warning">{parkingAvailability.label}</div>
            <div className="progress-bar">
              <div 
                className="progress-fill warning" 
                style={{ width: `${parkingAvailability.percentage}%` }}
              />
            </div>
          </div>

          {/* Family-Friendly */}
          <div className="insight-card family-card">
            <h3 className="card-title">Family-Friendly</h3>
            <div className="percentage-display">
              <span className="percentage-value">{familyFriendly.percentage}%</span>
            </div>
            <div className="score-label positive">{familyFriendly.label}</div>
            <div className="progress-bar">
              <div 
                className="progress-fill positive" 
                style={{ width: `${familyFriendly.percentage}%` }}
              />
            </div>
          </div>

          {/* Ambiance */}
          <div className="insight-card ambiance-card">
            <h3 className="card-title">Ambiance</h3>
            <div className="ambiance-tags">
              {ambianceTags.map((tag, index) => (
                <span key={index} className={`ambiance-tag ${tag.color}`}>
                  {tag.text}
                </span>
              ))}
            </div>
          </div>

          {/* Venue Information */}
          <div className="insight-card venue-info-card">
            <h3 className="card-title">Venue Information</h3>
            <div className="venue-details">
              <div className="venue-detail-item">
                <MapPin className="detail-icon" />
                <span className="detail-text">{venueInfo.address}</span>
              </div>
              <div className="venue-detail-item">
                <Phone className="detail-icon" />
                <span className="detail-text">{venueInfo.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
