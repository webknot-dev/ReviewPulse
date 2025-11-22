'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Download, TrendingUp, TrendingDown, Users, Clock, Star, CheckCircle, AlertTriangle, MapPin, Phone, Utensils, X } from 'lucide-react'
import './restaurant-analytics.css'

interface RestaurantAnalyticsProps {
  restaurantName?: string
  onNavigateBack?: () => void
}

export default function RestaurantAnalytics({ 
  restaurantName = 'Flavorlytics', 
  onNavigateBack 
}: RestaurantAnalyticsProps) {
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState('Weekly')

  const handleBackNavigation = () => {
    if (onNavigateBack) {
      onNavigateBack()
    } else {
      router.push('/')
    }
  }

  // Mock data matching the new design
  const metricsData = {
    reviews: { value: '1,204', trend: 'up', change: 'vs. last period' },
    averageRating: { value: '4.7', trend: 'up', change: 'vs. last period' },
    avgWaitingTime: { value: '25 min', trend: 'down', change: 'vs. last period' },
    priceSentiment: { value: 'Value for Money', trend: 'up', change: 'vs. last period' }
  }

  const timePeriods = ['Weekly', 'Monthly', 'Yearly', 'All Time']

  const topDishes = [
    { rank: 1, name: 'Truffle Pasta', mentions: 87 },
    { rank: 2, name: 'Spicy Tuna Roll', mentions: 62 },
    { rank: 3, name: 'Classic Burger', mentions: 45 }
  ]

  const mostMentionedStaff = {
    name: 'Jessica',
    avatar: '👩‍🦰',
    mentions: 32,
    type: 'positive'
  }

  const ambianceData = {
    excellent: 70,
    medium: 20,
    poor: 10
  }

  const restaurantInfo = {
    name: 'The Gourmet Grove',
    address: '123 Culinary Lane, Foodie City, 90210',
    contact: '(555) 123-4567'
  }

  const serviceQuotes = [
    { text: "Staff is consistently friendly and welcoming.", type: 'positive' },
    { text: "Very attentive to details and special requests.", type: 'positive' },
    { text: "Quick to refill drinks and clear plates.", type: 'positive' },
    { text: "Service can be slow when the restaurant is busy.", type: 'warning' },
    { text: "Occasional mix-ups with orders.", type: 'negative' }
  ]

  return (
    <div className="restaurant-analytics-container">
      <div className="restaurant-analytics-content">
        {/* Header */}
        <div className="restaurant-header">
          <div className="restaurant-header-left">
            <div className="restaurant-logo">
              <span className="restaurant-logo-text">0</span>
            </div>
            <div className="restaurant-title-section">
              <h1 className="restaurant-title">{restaurantName}</h1>
              <p className="restaurant-subtitle">Summary of customer feedback and key metrics.</p>
            </div>
          </div>
          <div className="restaurant-header-right">
            <button className="export-button">
              <Download className="export-icon" />
              Export Report
            </button>
          </div>
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

          <div className="metric-card waiting-card">
            <span className="metric-label">Avg. Waiting Time</span>
            <div className="metric-value">{metricsData.avgWaitingTime.value}</div>
            <div className="metric-trend">
              <TrendingDown className="trend-icon down" />
              <span className="trend-text">{metricsData.avgWaitingTime.change}</span>
            </div>
          </div>

          <div className="metric-card price-card">
            <span className="metric-label">Price Sentiment</span>
            <div className="metric-value">{metricsData.priceSentiment.value}</div>
            <div className="metric-trend">
              <TrendingUp className="trend-icon up" />
              <span className="trend-text">{metricsData.priceSentiment.change}</span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="content-grid">
          {/* Most Mentioned Staff */}
          <div className="content-card staff-card">
            <h3 className="card-title">Most Mentioned Staff</h3>
            <div className="staff-profile">
              <div className="staff-avatar">{mostMentionedStaff.avatar}</div>
              <div className="staff-info">
                <span className="staff-name">{mostMentionedStaff.name}</span>
                <span className="staff-mentions">{mostMentionedStaff.mentions} positive mentions</span>
              </div>
            </div>
          </div>

          {/* Service Quality Summary */}
          <div className="content-card service-card">
            <h3 className="card-title">Service Quality Summary</h3>
            <p className="service-summary">
              Overall, customers praise the staff for being attentive and friendly, though some reviews mention 
              occasional slowness during peak hours and rare mix-ups with orders.
            </p>
            <div className="service-quotes">
              {serviceQuotes.map((quote, index) => (
                <div key={index} className={`service-quote ${quote.type}`}>
                  {quote.type === 'positive' ? (
                    <CheckCircle className="quote-icon positive" />
                  ) : quote.type === 'warning' ? (
                    <AlertTriangle className="quote-icon warning" />
                  ) : (
                    <X className="quote-icon negative" />
                  )}
                  <span className="quote-text">"{quote.text}"</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ambiance Sentiment */}
          <div className="content-card ambiance-card">
            <h3 className="card-title">Ambiance Sentiment</h3>
            <div className="ambiance-bar-container">
              <div className="ambiance-bar-main">
                <div className="ambiance-segment excellent" style={{ width: `${ambianceData.excellent}%` }}></div>
                <div className="ambiance-segment medium" style={{ width: `${ambianceData.medium}%` }}></div>
                <div className="ambiance-segment poor" style={{ width: `${ambianceData.poor}%` }}></div>
              </div>
              <div className="ambiance-percentages">
                <span className="percentage excellent">{ambianceData.excellent}%</span>
                <span className="percentage medium">{ambianceData.medium}%</span>
                <span className="percentage poor">{ambianceData.poor}%</span>
              </div>
            </div>
            <div className="ambiance-legend">
              <div className="legend-item">
                <div className="legend-dot excellent"></div>
                <span>Good/Excellent</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot medium"></div>
                <span>Average/Medium</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot poor"></div>
                <span>Bad/Worst</span>
              </div>
            </div>
          </div>

          {/* Restaurant Information */}
          <div className="content-card restaurant-info-card">
            <h3 className="card-title">Restaurant Information</h3>
            <div className="restaurant-details">
              <div className="detail-item">
                <Utensils className="detail-icon" />
                <div className="detail-info">
                  <span className="detail-label">Name</span>
                  <span className="detail-value">{restaurantInfo.name}</span>
                </div>
              </div>
              <div className="detail-item">
                <MapPin className="detail-icon" />
                <div className="detail-info">
                  <span className="detail-label">Address</span>
                  <span className="detail-value">{restaurantInfo.address}</span>
                </div>
              </div>
              <div className="detail-item">
                <Phone className="detail-icon" />
                <div className="detail-info">
                  <span className="detail-label">Contact</span>
                  <span className="detail-value">{restaurantInfo.contact}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Dishes */}
          <div className="content-card dishes-card">
            <h3 className="card-title">Top Dishes</h3>
            <div className="dishes-list">
              {topDishes.map((dish) => (
                <div key={dish.rank} className="dish-item">
                  <span className="dish-rank">{dish.rank}</span>
                  <div className="dish-info">
                    <span className="dish-name">{dish.name}</span>
                    <span className="dish-mentions">{dish.mentions} mentions</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
