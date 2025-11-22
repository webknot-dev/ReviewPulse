'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, TrendingUp, TrendingDown, Star, MapPin, Phone, Clock, ThumbsUp, ThumbsDown } from 'lucide-react'
import './service-center-analytics.css'

interface ServiceCenterAnalyticsProps {
  centerName?: string
  onNavigateBack?: () => void
}

export default function ServiceCenterAnalytics({ 
  centerName = 'Service Center', 
  onNavigateBack 
}: ServiceCenterAnalyticsProps) {
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
  const metricsData = {
    totalReviews: { value: '1,204', trend: 'up', change: '+5.2%' },
    averageRating: { value: '4.7', trend: 'down', change: '-0.1%' }
  }

  const timePeriods = ['Weekly', 'Monthly', 'Yearly', 'All Time']

  const serviceCenterInfo = {
    address: '123 Auto Lane, Mechanicville, USA 12345',
    phone: '(555) 123-4567'
  }

  const ratingDistribution = {
    average: '4.7',
    basedOn: 1204,
    distribution: [
      { stars: 5, percentage: 75 },
      { stars: 4, percentage: 15 },
      { stars: 3, percentage: 5 },
      { stars: 2, percentage: 3 },
      { stars: 1, percentage: 2 }
    ]
  }

  const topPraisedStaff = [
    { name: 'John D.', mentions: 124 },
    { name: 'Maria S.', mentions: 98 },
    { name: 'David L.', mentions: 71 },
    { name: 'Chris P.', mentions: 55 }
  ]

  const serviceQualityMentions = [
    { label: 'Positive', percentage: 82, color: '#10b981' },
    { label: 'Neutral', percentage: 11, color: '#f59e0b' },
    { label: 'Negative', percentage: 7, color: '#ef4444' }
  ]

  const pricingSentiment = {
    sentiment: 'Largely Positive',
    change: 'This month +3%',
    position: 85 // Position on gradient bar (0-100, where 100 is fully positive)
  }

  const averageServiceTime = {
    current: '45 mins',
    previous: '52 mins',
    improvement: true
  }

  const fuelQualityFeedback = {
    positive: 92,
    negative: 8
  }

  return (
    <div className="service-center-container">
      <div className="service-center-content">
        {/* Header with Tabs and Export Button */}
        <div className="service-center-header">
          <div className="time-period-tabs">
            {timePeriods.map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`time-tab-button ${selectedPeriod === period ? 'active' : ''}`}
              >
                {period}
              </button>
            ))}
          </div>
          <button className="export-button">
            <Download className="export-icon" />
            Export Data
          </button>
        </div>

        {/* Top Metrics Row */}
        <div className="metrics-row">
          <div className="metric-card reviews-card">
            <span className="metric-label">Total Reviews</span>
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
            </div>
            <div className="stars-display">
              <Star className="star-icon filled" />
              <Star className="star-icon filled" />
              <Star className="star-icon filled" />
              <Star className="star-icon filled" />
              <Star className="star-icon partial" />
            </div>
            <div className="metric-trend">
              <TrendingDown className="trend-icon down" />
              <span className="trend-text">{metricsData.averageRating.change}</span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="content-grid">
          {/* Service Center Info */}
          <div className="insight-card info-card">
            <h3 className="card-title">Service Center Info</h3>
            <div className="center-details">
              <div className="center-detail-item">
                <MapPin className="detail-icon" />
                <span className="detail-text">{serviceCenterInfo.address}</span>
              </div>
              <div className="center-detail-item">
                <Phone className="detail-icon" />
                <span className="detail-text">{serviceCenterInfo.phone}</span>
              </div>
            </div>
          </div>

          {/* Overall Rating Distribution */}
          <div className="insight-card rating-distribution-card">
            <h3 className="card-title">Overall Rating Distribution</h3>
            <div className="rating-summary">
              <div className="rating-average">
                <span className="average-value">{ratingDistribution.average}</span>
                <div className="stars-display-small">
                  <Star className="star-icon filled" />
                  <Star className="star-icon filled" />
                  <Star className="star-icon filled" />
                  <Star className="star-icon filled" />
                  <Star className="star-icon partial" />
                </div>
              </div>
              <p className="rating-context">Based on {ratingDistribution.basedOn.toLocaleString()} reviews</p>
            </div>
            <div className="rating-bars">
              {ratingDistribution.distribution.map((item, index) => (
                <div key={index} className="rating-bar-item">
                  <div className="rating-bar-info">
                    <span className="rating-bar-stars">{item.stars} stars</span>
                    <span className="rating-bar-percentage">{item.percentage}%</span>
                  </div>
                  <div className="rating-bar">
                    <div 
                      className="rating-bar-fill" 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Praised Staff */}
          <div className="insight-card staff-card">
            <h3 className="card-title">Top Praised Staff</h3>
            <div className="staff-list">
              {topPraisedStaff.map((staff, index) => (
                <div key={index} className="staff-item">
                  <span className="staff-rank">{index + 1}.</span>
                  <span className="staff-name">{staff.name}</span>
                  <span className="staff-mentions">- {staff.mentions} mentions</span>
                </div>
              ))}
            </div>
          </div>

          {/* Service Quality Mentions */}
          <div className="insight-card quality-card">
            <h3 className="card-title">Service Quality Mentions</h3>
            <div className="quality-bars">
              {serviceQualityMentions.map((item, index) => (
                <div key={index} className="quality-bar-item">
                  <div className="quality-bar-info">
                    <span className="quality-bar-label">{item.label}</span>
                    <span className="quality-bar-percentage">{item.percentage}%</span>
                  </div>
                  <div className="quality-bar">
                    <div 
                      className="quality-bar-fill" 
                      style={{ 
                        width: `${item.percentage}%`, 
                        backgroundColor: item.color 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Sentiment */}
          <div className="insight-card pricing-card">
            <h3 className="card-title">Pricing Sentiment</h3>
            <div className="pricing-sentiment-display">
              <span className="pricing-sentiment-value">{pricingSentiment.sentiment}</span>
              <span className="pricing-sentiment-change">{pricingSentiment.change}</span>
            </div>
            <div className="pricing-gradient-bar">
              <div className="gradient-bar">
                <div 
                  className="gradient-marker" 
                  style={{ left: `${pricingSentiment.position}%` }}
                />
              </div>
              <div className="gradient-labels">
                <span className="gradient-label negative">Negative</span>
                <span className="gradient-label positive">Positive</span>
              </div>
            </div>
          </div>

          {/* Parts Quality Feedback */}
          <div className="insight-card parts-card">
            <h3 className="card-title">Parts Quality Feedback</h3>
            <div className="parts-labels">
              <span className="parts-label">OEM</span>
              <span className="parts-label">Aftermarket</span>
            </div>
          </div>

          {/* Average Service Time */}
          <div className="insight-card service-time-card">
            <h3 className="card-title">Average Service Time</h3>
            <div className="service-time-display">
              <Clock className="service-time-icon" />
              <div className="service-time-info">
                <span className="service-time-value">{averageServiceTime.current}</span>
                <span className="service-time-comparison">vs. {averageServiceTime.previous} last month</span>
              </div>
            </div>
          </div>

          {/* Fuel Quality Feedback */}
          <div className="insight-card fuel-card">
            <h3 className="card-title">Fuel Quality Feedback (Petrol Stations)</h3>
            <div className="fuel-feedback">
              <div className="fuel-item positive">
                <ThumbsUp className="fuel-icon" />
                <div className="fuel-info">
                  <span className="fuel-percentage">{fuelQualityFeedback.positive}%</span>
                  <span className="fuel-label">Positive</span>
                </div>
              </div>
              <div className="fuel-item negative">
                <ThumbsDown className="fuel-icon" />
                <div className="fuel-info">
                  <span className="fuel-percentage">{fuelQualityFeedback.negative}%</span>
                  <span className="fuel-label">Negative</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
