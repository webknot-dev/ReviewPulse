'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, Cloud, TrendingUp, TrendingDown, Star, MapPin, Phone } from 'lucide-react'
import './financial-services-analytics.css'

interface FinancialServicesAnalyticsProps {
  institutionName?: string
  onNavigateBack?: () => void
}

export default function FinancialServicesAnalytics({ 
  institutionName = 'Review Insights', 
  onNavigateBack 
}: FinancialServicesAnalyticsProps) {
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
    totalReviews: { value: '1,204', trend: 'up', change: '+15%' },
    averageRating: { value: '4.8', trend: 'up', change: '+0.2' }
  }

  const timePeriods = ['Weekly', 'Monthly', 'Yearly']

  const serviceItems = [
    { name: 'Loan Application', mentions: 182 },
    { name: 'Customer Service', mentions: 156 },
    { name: 'Wait Time', mentions: 121 },
    { name: 'Parking', mentions: 98 },
    { name: 'Online App', mentions: 77 }
  ]

  const serviceSpeedSentiment = {
    overall: 85,
    trend: { direction: 'up', change: '+5%' },
    distribution: [
      { label: 'Slow', percentage: 10, color: '#ef4444' },
      { label: 'Average', percentage: 5, color: '#f59e0b' },
      { label: 'Fast', percentage: 85, color: '#10b981' }
    ]
  }

  const professionalSkillsSentiment = {
    overall: 92,
    trend: { direction: 'down', change: '-1%' },
    distribution: [
      { label: 'Poor', percentage: 2, color: '#ef4444' },
      { label: 'Average', percentage: 6, color: '#9ca3af' },
      { label: 'Good', percentage: 25, color: '#10b981' },
      { label: 'Excellent', percentage: 67, color: '#10b981' }
    ]
  }

  const staffFriendliness = {
    overall: 95,
    trend: { direction: 'up', change: '+3%' },
    distribution: [
      { label: 'Good / Excellent', percentage: 95, color: '#10b981' },
      { label: 'Average / Medium', percentage: 3, color: '#f59e0b' },
      { label: 'Bad / Worst', percentage: 2, color: '#ef4444' }
    ]
  }

  const pricingFairness = {
    overall: 78,
    trend: { direction: 'up', change: '+2%' },
    distribution: [
      { label: 'Unfair', percentage: 8, color: '#ef4444' },
      { label: 'Fair', percentage: 14, color: '#f59e0b' },
      { label: 'Great', percentage: 78, color: '#10b981' }
    ]
  }

  const cleanlinessEnvironment = {
    overall: 98,
    trend: { direction: 'up', change: '+1%' },
    distribution: [
      { label: 'Good / Excellent', percentage: 98, color: '#10b981' },
      { label: 'Average / Medium', percentage: 2, color: '#f59e0b' },
      { label: 'Bad / Worst', percentage: 0, color: '#ef4444' }
    ]
  }

  const officeInfo = {
    address: '123 Market Street, Suite 450 San Francisco, CA 94103',
    phone: '(415) 555-0199'
  }

  // Calculate max mentions for bar chart scaling
  const maxMentions = Math.max(...serviceItems.map(item => item.mentions))

  return (
    <div className="financial-analytics-container">
      <div className="financial-analytics-content">
        {/* Header */}
        <div className="financial-header">
          <h1 className="financial-title">{institutionName}</h1>
          <button className="export-button">
            <Cloud className="export-icon" />
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
              <Star className="metric-star-icon" />
            </div>
            <div className="metric-value">{metricsData.totalReviews.value}</div>
            <div className="metric-trend">
              <TrendingUp className="trend-icon up" />
              <span className="trend-text">{metricsData.totalReviews.change}</span>
            </div>
          </div>

          <div className="metric-card rating-card">
            <div className="metric-header">
              <span className="metric-label">Average Rating</span>
              <Star className="metric-star-icon" />
            </div>
            <div className="metric-value">{metricsData.averageRating.value}</div>
            <div className="metric-trend">
              <TrendingUp className="trend-icon up" />
              <span className="trend-text">{metricsData.averageRating.change}</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="main-content-grid">
          {/* Most-mentioned Service Items */}
          <div className="service-items-card insight-card">
            <h3 className="card-title">Most-mentioned service items</h3>
            <div className="service-items-chart">
              {serviceItems.map((item, index) => (
                <div key={index} className="service-item">
                  <div className="service-item-info">
                    <span className="service-item-name">{item.name}</span>
                    <span className="service-item-mentions">{item.mentions} mentions</span>
                  </div>
                  <div className="service-item-bar">
                    <div 
                      className="service-item-bar-fill" 
                      style={{ width: `${(item.mentions / maxMentions) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sentiment Cards */}
          {/* Service Speed Sentiment */}
          <div className="sentiment-card insight-card">
            <h3 className="card-title">Service Speed Sentiment</h3>
            <div className="sentiment-overall">
              <span className="sentiment-value">{serviceSpeedSentiment.overall}%</span>
              <div className="sentiment-trend">
                <TrendingUp className="trend-icon up" />
                <span className="trend-text">{serviceSpeedSentiment.trend.change}</span>
              </div>
            </div>
            <div className="sentiment-bars">
              {serviceSpeedSentiment.distribution.map((item, index) => (
                <div key={index} className="sentiment-bar-item">
                  <div className="sentiment-bar-info">
                    <span className="sentiment-bar-label">{item.label}</span>
                  </div>
                  <div className="sentiment-bar">
                    <div 
                      className="sentiment-bar-fill" 
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

          {/* Professional Skills Sentiment */}
          <div className="sentiment-card insight-card">
            <h3 className="card-title">Professional Skills Sentiment</h3>
            <div className="sentiment-overall">
              <span className="sentiment-value">{professionalSkillsSentiment.overall}%</span>
              <div className="sentiment-trend">
                <TrendingDown className="trend-icon down" />
                <span className="trend-text">{professionalSkillsSentiment.trend.change}</span>
              </div>
            </div>
            <div className="sentiment-bars">
              {professionalSkillsSentiment.distribution.map((item, index) => (
                <div key={index} className="sentiment-bar-item">
                  <div className="sentiment-bar-info">
                    <span className="sentiment-bar-label">{item.label}</span>
                  </div>
                  <div className="sentiment-bar">
                    <div 
                      className="sentiment-bar-fill" 
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

          {/* Staff Friendliness */}
          <div className="sentiment-card insight-card">
            <h3 className="card-title">Staff Friendliness</h3>
            <div className="sentiment-overall">
              <span className="sentiment-value">{staffFriendliness.overall}%</span>
              <div className="sentiment-trend">
                <TrendingUp className="trend-icon up" />
                <span className="trend-text">{staffFriendliness.trend.change}</span>
              </div>
            </div>
            <div className="sentiment-bars">
              {staffFriendliness.distribution.map((item, index) => (
                <div key={index} className="sentiment-bar-item">
                  <div className="sentiment-bar-info">
                    <span className="sentiment-bar-label">{item.label}</span>
                    <span className="sentiment-bar-percentage">{item.percentage}%</span>
                  </div>
                  <div className="sentiment-bar">
                    <div 
                      className="sentiment-bar-fill" 
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

          {/* Pricing Fairness */}
          <div className="sentiment-card insight-card">
            <h3 className="card-title">Pricing Fairness</h3>
            <div className="sentiment-overall">
              <span className="sentiment-value">{pricingFairness.overall}%</span>
              <div className="sentiment-trend">
                <TrendingUp className="trend-icon up" />
                <span className="trend-text">{pricingFairness.trend.change}</span>
              </div>
            </div>
            <div className="sentiment-bars">
              {pricingFairness.distribution.map((item, index) => (
                <div key={index} className="sentiment-bar-item">
                  <div className="sentiment-bar-info">
                    <span className="sentiment-bar-label">{item.label}</span>
                  </div>
                  <div className="sentiment-bar">
                    <div 
                      className="sentiment-bar-fill" 
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

          {/* Cleanliness & Environment */}
          <div className="sentiment-card insight-card">
            <h3 className="card-title">Cleanliness & Environment</h3>
            <div className="sentiment-overall">
              <span className="sentiment-value">{cleanlinessEnvironment.overall}%</span>
              <div className="sentiment-trend">
                <TrendingUp className="trend-icon up" />
                <span className="trend-text">{cleanlinessEnvironment.trend.change}</span>
              </div>
            </div>
            <div className="sentiment-bars">
              {cleanlinessEnvironment.distribution.map((item, index) => (
                <div key={index} className="sentiment-bar-item">
                  <div className="sentiment-bar-info">
                    <span className="sentiment-bar-label">{item.label}</span>
                    <span className="sentiment-bar-percentage">{item.percentage}%</span>
                  </div>
                  <div className="sentiment-bar">
                    <div 
                      className="sentiment-bar-fill" 
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

          {/* Office Information */}
          <div className="office-info-card insight-card">
            <h3 className="card-title">Office Information</h3>
            <div className="office-details">
              <div className="office-detail-item">
                <MapPin className="detail-icon" />
                <span className="detail-text">{officeInfo.address}</span>
              </div>
              <div className="office-detail-item">
                <Phone className="detail-icon" />
                <span className="detail-text">{officeInfo.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
