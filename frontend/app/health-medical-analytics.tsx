'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, Bell, Moon, TrendingUp, Star, Users, Clock, Sparkles, Heart, Pill, CheckCircle2, Building, MapPin, Phone } from 'lucide-react'
import './health-medical-analytics.css'

interface HealthMedicalAnalyticsProps {
  institutionName?: string
  onNavigateBack?: () => void
}

export default function HealthMedicalAnalytics({ 
  institutionName = 'Review Insights', 
  onNavigateBack 
}: HealthMedicalAnalyticsProps) {
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
    totalReviews: { value: '1,284', trend: 'up', change: '12%' },
    averageRating: { value: '4.8', trend: 'up', change: '0.1' },
    sentimentTrend: { value: 'Positive', trend: 'up', change: '3%' }
  }

  const timePeriods = ['Weekly', 'Monthly', 'Yearly', 'All Time']

  const appreciatedStaff = [
    'Dr. Emily Carter',
    'Nurse David Chen',
    'Dr. Sarah Lee'
  ]

  const waitingTime = {
    feedback: 'Positive Feedback',
    percentage: 78
  }

  const cleanliness = {
    percentage: 92,
    description: 'of reviews mentioned positive cleanliness.'
  }

  const patientCareSentiment = [
    { label: 'Positive', percentage: 85, color: '#10b981' },
    { label: 'Neutral', percentage: 10, color: '#f59e0b' },
    { label: 'Negative', percentage: 5, color: '#ef4444' }
  ]

  const pharmacyExperience = {
    description: 'Praise for pharmacist helpfulness and prescription speed.',
    positive: 95
  }

  const diagnosisAccuracy = {
    description: 'High satisfaction with accuracy and explanations.',
    satisfaction: 98
  }

  const institutionInfo = {
    address: '123 Health St, Wellness City, 12345',
    phone: '(123) 456-7890'
  }

  return (
    <div className="health-analytics-container">
      <div className="health-analytics-content">
        {/* Header */}
        <div className="health-header">
          <div className="health-header-left">
            <div className="medical-icon">
              <div className="medical-cross">+</div>
            </div>
            <h1 className="health-logo">{institutionName}</h1>
          </div>
          <div className="health-header-right">
            <button className="export-button">
              <Download className="export-icon" />
              Export Data
            </button>
            <button className="header-icon-button">
              <Bell className="header-icon" />
            </button>
            <button className="header-icon-button">
              <Moon className="header-icon" />
            </button>
          </div>
        </div>

        {/* Dashboard Title and Filters */}
        <div className="dashboard-header">
          <div className="dashboard-title-section">
            <h2 className="dashboard-title">Dashboard</h2>
            <p className="dashboard-subtitle">Key insights from patient and medical reviews.</p>
          </div>
          <div className="time-period-filters">
            {timePeriods.map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`time-filter-button ${selectedPeriod === period ? 'active' : ''}`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics Row */}
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
            <div className="metric-value-with-star">
              <span className="metric-value">{metricsData.averageRating.value}</span>
            </div>
            <div className="stars-display">
              <Star className="star-icon filled" />
              <Star className="star-icon filled" />
              <Star className="star-icon filled" />
              <Star className="star-icon filled" />
              <Star className="star-icon filled" />
            </div>
            <div className="metric-trend">
              <TrendingUp className="trend-icon up" />
              <span className="trend-text">{metricsData.averageRating.change}</span>
            </div>
          </div>

          <div className="metric-card sentiment-card">
            <span className="metric-label">Sentiment Trend</span>
            <div className="metric-value">{metricsData.sentimentTrend.value}</div>
            <div className="metric-trend">
              <TrendingUp className="trend-icon up" />
              <span className="trend-text">{metricsData.sentimentTrend.change}</span>
            </div>
          </div>
        </div>

        {/* Detailed Insights Row */}
        <div className="insights-row">
          {/* Appreciated Staff */}
          <div className="insight-card staff-card">
            <div className="card-icon-wrapper">
              <Users className="card-icon" />
            </div>
            <h3 className="card-title">Appreciated Staff</h3>
            <div className="staff-list">
              {appreciatedStaff.map((staff, index) => (
                <span key={index} className="staff-tag">
                  {staff}
                </span>
              ))}
            </div>
          </div>

          {/* Waiting Time */}
          <div className="insight-card waiting-card">
            <div className="card-icon-wrapper">
              <Clock className="card-icon" />
            </div>
            <h3 className="card-title">Waiting Time</h3>
            <p className="waiting-feedback">{waitingTime.feedback}</p>
            <div className="waiting-progress">
              <div className="waiting-progress-bar">
                <div 
                  className="waiting-progress-fill" 
                  style={{ width: `${waitingTime.percentage}%` }}
                />
              </div>
              <span className="waiting-percentage">{waitingTime.percentage}%</span>
            </div>
          </div>

          {/* Cleanliness */}
          <div className="insight-card cleanliness-card">
            <div className="card-icon-wrapper">
              <Sparkles className="card-icon" />
            </div>
            <h3 className="card-title">Cleanliness</h3>
            <div className="cleanliness-display">
              <div className="cleanliness-circle">
                <div className="cleanliness-progress" style={{ '--percentage': cleanliness.percentage } as React.CSSProperties}>
                  <span className="cleanliness-percentage">{cleanliness.percentage}%</span>
                </div>
              </div>
              <p className="cleanliness-description">{cleanliness.description}</p>
            </div>
          </div>
        </div>

        {/* Specific Feedback Row */}
        <div className="feedback-row">
          {/* Patient Care Sentiment */}
          <div className="insight-card care-card">
            <div className="card-icon-wrapper">
              <Heart className="card-icon" />
            </div>
            <h3 className="card-title">Patient Care Sentiment</h3>
            <div className="sentiment-bars">
              {patientCareSentiment.map((item, index) => (
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

          {/* Pharmacy Experience */}
          <div className="insight-card pharmacy-card">
            <div className="card-icon-wrapper">
              <Pill className="card-icon" />
            </div>
            <h3 className="card-title">Pharmacy Experience</h3>
            <p className="pharmacy-description">{pharmacyExperience.description}</p>
            <div className="pharmacy-metric">
              <span className="pharmacy-percentage">{pharmacyExperience.positive}%</span>
              <span className="pharmacy-label">Positive</span>
            </div>
          </div>

          {/* Diagnosis Accuracy */}
          <div className="insight-card diagnosis-card">
            <div className="card-icon-wrapper">
              <CheckCircle2 className="card-icon" />
            </div>
            <h3 className="card-title">Diagnosis Accuracy</h3>
            <p className="diagnosis-description">{diagnosisAccuracy.description}</p>
            <div className="diagnosis-metric">
              <span className="diagnosis-percentage">{diagnosisAccuracy.satisfaction}%</span>
              <span className="diagnosis-label">Satisfaction</span>
            </div>
          </div>
        </div>

        {/* Institution Info */}
        <div className="institution-info-card insight-card">
          <div className="card-icon-wrapper">
            <Building className="card-icon" />
          </div>
          <h3 className="card-title">Institution Info</h3>
          <div className="institution-details">
            <div className="institution-detail-item">
              <MapPin className="detail-icon" />
              <span className="detail-text">{institutionInfo.address}</span>
            </div>
            <div className="institution-detail-item">
              <Phone className="detail-icon" />
              <span className="detail-text">{institutionInfo.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}