'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Download, TrendingUp, TrendingDown, MapPin, Phone, Waves, Flower2, Car, ThumbsUp, ThumbsDown, Star } from 'lucide-react'
import './hotels-accommodation-analytics.css'

interface HotelsAccommodationAnalyticsProps {
  hotelName?: string
  onNavigateBack?: () => void
}

export default function HotelsAccommodationAnalytics({ 
  hotelName = 'Grand Hotel', 
  onNavigateBack 
}: HotelsAccommodationAnalyticsProps) {
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly')

  const handleBackNavigation = () => {
    if (onNavigateBack) {
      onNavigateBack()
    } else {
      router.push('/')
    }
  }

  // Mock data matching the hotel design
  const metricsData = {
    reviews: { value: '1,250', trend: 'up', change: '15.2%' },
    averageRating: { value: '4.6', maxValue: '5', trend: 'up', change: '0.3' },
    locationConvenience: { value: '9.2', maxValue: '10', trend: 'down', change: '0.5%' },
    averageRoomPrice: { value: '$235', trend: 'up', change: '2.5%' }
  }

  const timePeriods = ['Weekly', 'Monthly', 'Yearly', 'All Time']

  const topFacilities = [
    { icon: Waves, name: 'Pool', mentions: 128, color: '#8b5cf6' },
    { icon: Flower2, name: 'Spa', mentions: 97, color: '#ec4899' },
    { icon: Car, name: 'Parking', mentions: 82, color: '#06b6d4' }
  ]

  const topFeatures = [
    { name: 'Excellent Location', rank: '#1' },
    { name: 'Friendly Staff', rank: '#2' },
    { name: 'Clean Rooms', rank: '#3' },
    { name: 'Great Pool Area', rank: '#4' },
    { name: 'Value for Money', rank: '#5' }
  ]

  const hotelInfo = {
    address: '123 Purple Ave, Design City, DC 12345',
    phone: '(123) 456-7890'
  }

  const safetyMentions = {
    positive: {
      count: 15,
      keywords: ['well-lit', 'secure parking', 'felt safe']
    },
    negative: {
      count: 2,
      keywords: ['dark hallway', 'lock broken']
    }
  }

  const roomCleanliness = {
    score: '8.8',
    maxScore: '10',
    basedOn: 890
  }

  const complimentaryBreakfast = 'Yes'

  return (
    <div className="hotel-analytics-container">
      <div className="hotel-analytics-content">
        {/* Header */}
        <div className="hotel-header">
          <h1 className="hotel-title">Hotels & Accommodation Insights</h1>
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
            <span className="metric-label">Reviews</span>
            <div className="metric-value">{metricsData.reviews.value}</div>
            <div className="metric-trend">
              <TrendingUp className="trend-icon up" />
              <span className="trend-text">{metricsData.reviews.change}</span>
            </div>
          </div>

          <div className="metric-card rating-card">
            <span className="metric-label">Average Rating</span>
            <div className="metric-value-with-star">
              <span className="metric-value">{metricsData.averageRating.value}</span>
              <Star className="rating-star" />
            </div>
            <div className="metric-trend">
              <TrendingUp className="trend-icon up" />
              <span className="trend-text">{metricsData.averageRating.change}</span>
            </div>
          </div>

          <div className="metric-card location-card">
            <span className="metric-label">Location Convenience</span>
            <div className="metric-value">
              {metricsData.locationConvenience.value}
              <span className="metric-max">/{metricsData.locationConvenience.maxValue}</span>
            </div>
            <div className="metric-trend">
              <TrendingDown className="trend-icon down" />
              <span className="trend-text">{metricsData.locationConvenience.change}</span>
            </div>
          </div>

          <div className="metric-card price-card">
            <span className="metric-label">Average Room Price</span>
            <div className="metric-value">{metricsData.averageRoomPrice.value}</div>
            <div className="metric-trend">
              <TrendingUp className="trend-icon up" />
              <span className="trend-text">{metricsData.averageRoomPrice.change}</span>
            </div>
          </div>
        </div>

        {/* Detailed Insights Section */}
        <div className="detailed-insights">
          <h2 className="section-title">Detailed Insights</h2>
          
          <div className="insights-grid">
            {/* Top 3 Appreciated Facilities */}
            <div className="insight-card facilities-card">
              <h3 className="card-title">Top 3 Appreciated Facilities</h3>
              <div className="facilities-list">
                {topFacilities.map((facility, index) => (
                  <div key={index} className="facility-item">
                    <div className="facility-icon" style={{ color: facility.color }}>
                      <facility.icon />
                    </div>
                    <div className="facility-info">
                      <span className="facility-name">{facility.name}</span>
                      <span className="facility-mentions">{facility.mentions} mentions</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Cleanliness & Comfort */}
            <div className="insight-card cleanliness-card">
              <h3 className="card-title">Room Cleanliness & Comfort</h3>
              <div className="cleanliness-score">
                <span className="score-value">{roomCleanliness.score}</span>
                <span className="score-max">/{roomCleanliness.maxScore}</span>
              </div>
              <p className="score-description">Based on {roomCleanliness.basedOn} mentions</p>
            </div>

            {/* Top 5 Best Features */}
            <div className="insight-card features-card">
              <h3 className="card-title">Top 5 Best Features</h3>
              <div className="features-list">
                {topFeatures.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <span className="feature-name">{feature.name}</span>
                    <span className="feature-rank">{feature.rank}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Complimentary Breakfast */}
            <div className="insight-card breakfast-card">
              <h3 className="card-title">Complimentary breakfast</h3>
              <div className="breakfast-status">
                <span className="status-value">{complimentaryBreakfast}</span>
              </div>
            </div>

            {/* Hotel Information */}
            <div className="insight-card hotel-info-card">
              <h3 className="card-title">Hotel Information</h3>
              <div className="hotel-details">
                <div className="detail-item">
                  <MapPin className="detail-icon" />
                  <span className="detail-text">{hotelInfo.address}</span>
                </div>
                <div className="detail-item">
                  <Phone className="detail-icon" />
                  <span className="detail-text">{hotelInfo.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Safety & Security Mentions */}
          <div className="safety-section">
            <div className="insight-card safety-card">
              <h3 className="card-title">Safety & Security Mentions</h3>
              <div className="safety-mentions">
                <div className="safety-item positive">
                  <div className="safety-icon">
                    <ThumbsUp />
                  </div>
                  <div className="safety-info">
                    <span className="safety-count">{safetyMentions.positive.count} Positive Mentions</span>
                    <p className="safety-keywords">
                      Keywords: "{safetyMentions.positive.keywords.join('", "')}"
                    </p>
                  </div>
                </div>
                <div className="safety-item negative">
                  <div className="safety-icon">
                    <ThumbsDown />
                  </div>
                  <div className="safety-info">
                    <span className="safety-count">{safetyMentions.negative.count} Negative Mentions</span>
                    <p className="safety-keywords">
                      Keywords: "{safetyMentions.negative.keywords.join('", "')}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
