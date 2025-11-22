'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Download, Bell, Moon, TrendingUp, Star, Users, Clock, Sparkles, Heart, Pill, CheckCircle2, Building, MapPin, Phone, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react'
import { reviewAPI, PlaceDataResponse } from '@/lib/api'
import './health-medical-analytics.css'

interface HealthMedicalAnalyticsProps {
  institutionName?: string
  placeName?: string
  onNavigateBack?: () => void
}

export default function HealthMedicalAnalytics({ 
  institutionName,
  placeName: placeNameProp,
  onNavigateBack 
}: HealthMedicalAnalyticsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  // Get placeName from prop, query param, or undefined (for template mode)
  const placeName = placeNameProp || searchParams.get('place') || undefined
  const [selectedPeriod, setSelectedPeriod] = useState('All Time')
  // Only show loading if we have a placeName to fetch
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [data, setData] = useState<PlaceDataResponse['placeData'] | null>(null)

  useEffect(() => {
    if (placeName) {
      console.log('🔄 useEffect triggered, fetching data for:', placeName)
      fetchData(placeName)
    }
  }, [placeName])

  const fetchData = async (place: string) => {
    setLoading(true)
    setError('')
    try {
      console.log('🔍 Fetching data for place:', place)
      const response = await reviewAPI.fetchAndAnalyze(place)
      console.log('📦 Response received:', response)
      if (response.success) {
        console.log('✅ Setting data:', response.placeData)
        setData(response.placeData)
      } else {
        console.error('❌ Response not successful')
        setError('Failed to fetch data')
      }
    } catch (err: any) {
      console.error('❌ Error fetching data:', err)
      setError(err.message || 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const handleBackNavigation = () => {
    if (onNavigateBack) {
      onNavigateBack()
    } else {
      router.push('/')
    }
  }

  // Helper function to check if an attribute exists in attributes_analyzed
  const hasAttribute = (key: string): boolean => {
    if (!data?.attributes_analyzed) return false
    const value = data.attributes_analyzed[key]
    return !!value && 
           typeof value === 'string' &&
           value.trim() !== '' &&
           value.toLowerCase() !== 'not enough information from the reviews to analyze'
  }

  // Parse staff names from attributes_analyzed
  const getAppreciatedStaff = (): string[] => {
    if (!hasAttribute('appreciated staffs')) return []
    const text = data!.attributes_analyzed['appreciated staffs']
    // Extract staff names - improved regex to catch Dr., Prof. Dr., etc.
    const matches = text.match(/(?:Prof\.\s+)?(?:Dr\.|Mr\.|Mrs\.|Ms\.|Miss)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+Ma'am)?/g)
    if (matches) {
      // Clean up the names (remove extra spaces, normalize)
      return matches.map(name => name.trim()).filter((name, index, self) => self.indexOf(name) === index)
    }
    return []
  }

  // Parse waiting time sentiment
  const getWaitingTimeData = () => {
    if (!hasAttribute('waiting time experience')) return null
    const text = data!.attributes_analyzed['waiting time experience'].toLowerCase()
    const isPositive = text.includes('positive') || text.includes('good') || text.includes('excellent')
    const isNegative = text.includes('negative') || text.includes('poor') || text.includes('bad') || text.includes('long')
    
    // Try to extract percentage if mentioned
    const percentageMatch = text.match(/(\d+)%/)
    const percentage = percentageMatch ? parseInt(percentageMatch[1]) : (isPositive ? 75 : isNegative ? 25 : 50)
    
    return {
      feedback: isPositive ? 'Positive Feedback' : isNegative ? 'Negative Feedback' : 'Mixed Feedback',
      percentage: isPositive ? Math.max(percentage, 60) : isNegative ? Math.min(percentage, 40) : percentage
    }
  }

  // Parse cleanliness percentage
  const getCleanlinessData = () => {
    if (!hasAttribute('hygiene')) return null
    const text = data!.attributes_analyzed['hygiene'].toLowerCase()
    const isPositive = text.includes('positive') || text.includes('clean') || text.includes('good')
    const percentageMatch = text.match(/(\d+)%/)
    const percentage = percentageMatch ? parseInt(percentageMatch[1]) : (isPositive ? 90 : 50)
    return {
      percentage: isPositive ? Math.max(percentage, 70) : percentage,
    description: 'of reviews mentioned positive cleanliness.'
    }
  }

  // Parse patient care sentiment
  const getPatientCareSentiment = () => {
    if (!hasAttribute('patient care sentiment')) return null
    const text = data!.attributes_analyzed['patient care sentiment'].toLowerCase()
    // Try to extract percentages
    const positiveMatch = text.match(/positive[:\s]+(\d+)%?/i)
    const negativeMatch = text.match(/negative[:\s]+(\d+)%?/i)
    const neutralMatch = text.match(/neutral[:\s]+(\d+)%?/i)
    
    const positive = positiveMatch ? parseInt(positiveMatch[1]) : 
                     text.includes('excellent') || text.includes('positive') ? 85 : 60
    const negative = negativeMatch ? parseInt(negativeMatch[1]) : 
                     text.includes('poor') || text.includes('negative') ? 15 : 10
    const neutral = neutralMatch ? parseInt(neutralMatch[1]) : 100 - positive - negative
    
    return [
      { label: 'Positive', percentage: Math.min(positive, 95), color: '#10b981' },
      { label: 'Neutral', percentage: Math.min(neutral, 20), color: '#f59e0b' },
      { label: 'Negative', percentage: Math.min(negative, 20), color: '#ef4444' }
    ]
  }

  // Parse pharmacy experience
  const getPharmacyExperience = () => {
    if (!hasAttribute('pharmacy experience')) return null
    const text = data!.attributes_analyzed['pharmacy experience'].toLowerCase()
    const isPositive = text.includes('positive') || text.includes('good') || text.includes('praise')
    const percentageMatch = text.match(/(\d+)%/)
    const percentage = percentageMatch ? parseInt(percentageMatch[1]) : (isPositive ? 95 : 50)
    return {
      description: text.length > 100 ? text.substring(0, 100) + '...' : text,
      positive: isPositive ? Math.max(percentage, 80) : percentage
    }
  }

  // Parse diagnosis accuracy
  const getDiagnosisAccuracy = () => {
    if (!hasAttribute('diagnosis accuracy')) return null
    const text = data!.attributes_analyzed['diagnosis accuracy'].toLowerCase()
    const isPositive = text.includes('positive') || text.includes('high') || text.includes('good') || text.includes('satisfaction')
    const percentageMatch = text.match(/(\d+)%/)
    const percentage = percentageMatch ? parseInt(percentageMatch[1]) : (isPositive ? 98 : 50)
    return {
      description: text.length > 100 ? text.substring(0, 100) + '...' : text,
      satisfaction: isPositive ? Math.max(percentage, 80) : percentage
    }
  }

  // Calculate max mentions for highlights
  const maxPositiveMentions = data?.pos_reviews && data.pos_reviews.length > 0
    ? Math.max(...data.pos_reviews.map(r => r.mentions))
    : 1
  const maxNegativeMentions = data?.neg_reviews && data.neg_reviews.length > 0
    ? Math.max(...data.neg_reviews.map(r => r.mentions))
    : 1

  if (loading) {
    return (
      <div className="health-analytics-container">
        <div className="health-analytics-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <div style={{ textAlign: 'center' }}>
            <Loader2 className="landing-spinner" style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#ffffff', fontSize: '1.125rem' }}>Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="health-analytics-container">
        <div className="health-analytics-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#ef4444', fontSize: '1.125rem', marginBottom: '1rem' }}>Error: {error}</p>
            <button 
              onClick={() => placeName && fetchData(placeName)}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Use data if available, otherwise use template defaults
  const isTemplateMode = !placeName
  const hasData = !!data
  const displayName = data?.place_name || placeName || institutionName || 'Review Insights'
  const metricsData = {
    totalReviews: { 
      value: hasData && data.total_reviews ? data.total_reviews.toLocaleString() : (isTemplateMode ? '1,284' : '0'), 
      trend: 'up' as const, 
      change: isTemplateMode ? '12%' : '0%' 
    },
    averageRating: { 
      value: hasData && data.rating ? data.rating.toFixed(1) : (isTemplateMode ? '4.8' : '0.0'), 
      trend: 'up' as const, 
      change: isTemplateMode ? '0.1' : '0.0' 
    },
    sentimentTrend: { 
      value: hasData && data.overall_sentiment ? data.overall_sentiment.charAt(0).toUpperCase() + data.overall_sentiment.slice(1) : (isTemplateMode ? 'Positive' : 'Neutral'), 
      trend: (hasData && data.overall_sentiment === 'positive' || isTemplateMode) ? 'up' as const : 'down' as const, 
      change: isTemplateMode ? '3%' : '0%' 
    }
  }

  const timePeriods = hasData && data.possible_filters ? data.possible_filters : ['Weekly', 'Monthly', 'Yearly', 'All Time']

  // Template data when no placeName
  const templateAppreciatedStaff = ['Dr. Emily Carter', 'Nurse David Chen', 'Dr. Sarah Lee']
  const templateWaitingTime = { feedback: 'Positive Feedback', percentage: 78 }
  const templateCleanliness = { percentage: 92, description: 'of reviews mentioned positive cleanliness.' }
  const templatePatientCareSentiment = [
    { label: 'Positive', percentage: 85, color: '#10b981' },
    { label: 'Neutral', percentage: 10, color: '#f59e0b' },
    { label: 'Negative', percentage: 5, color: '#ef4444' }
  ]
  const templatePharmacyExperience = { description: 'Praise for pharmacist helpfulness and prescription speed.', positive: 95 }
  const templateDiagnosisAccuracy = { description: 'High satisfaction with accuracy and explanations.', satisfaction: 98 }

  const appreciatedStaff = isTemplateMode ? templateAppreciatedStaff : (hasData ? getAppreciatedStaff() : [])
  const waitingTime = isTemplateMode ? templateWaitingTime : (hasData ? getWaitingTimeData() : null)
  const cleanliness = isTemplateMode ? templateCleanliness : (hasData ? getCleanlinessData() : null)
  const patientCareSentiment = isTemplateMode ? templatePatientCareSentiment : (hasData ? getPatientCareSentiment() : null)
  const pharmacyExperience = isTemplateMode ? templatePharmacyExperience : (hasData ? getPharmacyExperience() : null)
  const diagnosisAccuracy = isTemplateMode ? templateDiagnosisAccuracy : (hasData ? getDiagnosisAccuracy() : null)

  return (
    <div className="health-analytics-container">
      <div className="health-analytics-content">
        {/* Header */}
        <div className="health-header">
          <div className="health-header-left">
            <div className="medical-icon">
              <div className="medical-cross">+</div>
            </div>
            <h1 className="health-logo">{displayName}</h1>
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
              {[1, 2, 3, 4, 5].map((star) => {
                const rating = hasData && data.rating ? data.rating : (isTemplateMode ? 4.8 : 0)
                const isFilled = star <= Math.floor(rating)
                return (
                  <Star 
                    key={star} 
                    className={`star-icon ${isFilled ? 'filled' : ''}`}
                    style={isFilled ? { fill: '#fbbf24', color: '#fbbf24' } : {}}
                  />
                )
              })}
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
              <TrendingUp className={`trend-icon ${metricsData.sentimentTrend.trend}`} />
              <span className="trend-text">{metricsData.sentimentTrend.change}</span>
            </div>
          </div>
        </div>

        {/* Top Positive and Negative Highlights - Only show when we have real data */}
        {!isTemplateMode && data && (data.pos_reviews.length > 0 || data.neg_reviews.length > 0) && (
          <div className="highlights-container" style={{ marginBottom: '2rem' }}>
            {/* Positive Highlights */}
            {data.pos_reviews.length > 0 && (
              <div className="highlights-card positive-card">
                <div className="card-header-section">
                  <ThumbsUp className="card-icon positive-icon" />
                  <div className="card-title-section">
                    <h2 className="card-title">Top Positive Highlights</h2>
                    <p className="card-subtitle">What patients appreciate the most</p>
                  </div>
                </div>
                <div className="highlights-list">
                  {data.pos_reviews.slice(0, 5).map((review, index) => {
                    const percentage = (review.mentions / maxPositiveMentions) * 100
                    return (
                      <div key={index} className="highlight-item positive-item">
                        <div className="highlight-content">
                          <p className="highlight-text">{review.text}</p>
                          <div className="highlight-bar-container">
                            <div 
                              className="highlight-bar positive-bar" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        <div className="highlight-meta">
                          <span className="highlight-mentions positive-badge">
                            {review.mentions} mentions
                          </span>
                          <TrendingUp className="trend-icon-small positive" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Negative Highlights */}
            {data && data.neg_reviews.length > 0 && (
              <div className="highlights-card negative-card">
                <div className="card-header-section">
                  <ThumbsDown className="card-icon negative-icon" />
                  <div className="card-title-section">
                    <h2 className="card-title">Top Negative Highlights</h2>
                    <p className="card-subtitle">Common complaints and issues</p>
                  </div>
                </div>
                <div className="highlights-list">
                  {data.neg_reviews.slice(0, 5).map((review, index) => {
                    const percentage = (review.mentions / maxNegativeMentions) * 100
                    return (
                      <div key={index} className="highlight-item negative-item">
                        <div className="highlight-content">
                          <p className="highlight-text">{review.text}</p>
                          <div className="highlight-bar-container">
                            <div 
                              className="highlight-bar negative-bar" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        <div className="highlight-meta">
                          <span className="highlight-mentions negative-badge">
                            {review.mentions} mentions
                          </span>
                          <TrendingUp className="trend-icon-small negative" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Detailed Insights Row - Show cards with data or template data */}
        <div className="insights-row">
          {/* Appreciated Staff */}
          {(appreciatedStaff.length > 0 || isTemplateMode || (hasData && hasAttribute('appreciated staffs'))) && (
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
          )}

          {/* Waiting Time */}
          {(waitingTime || isTemplateMode || (hasData && hasAttribute('waiting time experience'))) && (
          <div className="insight-card waiting-card">
            <div className="card-icon-wrapper">
              <Clock className="card-icon" />
            </div>
            <h3 className="card-title">Waiting Time</h3>
            <p className="waiting-feedback">{(waitingTime || templateWaitingTime).feedback}</p>
            <div className="waiting-progress">
              <div className="waiting-progress-bar">
                <div 
                  className="waiting-progress-fill" 
                  style={{ width: `${(waitingTime || templateWaitingTime).percentage}%` }}
                />
              </div>
              <span className="waiting-percentage">{(waitingTime || templateWaitingTime).percentage}%</span>
            </div>
          </div>
          )}

          {/* Cleanliness */}
          {(cleanliness || isTemplateMode || (hasData && hasAttribute('hygiene'))) && (
          <div className="insight-card cleanliness-card">
            <div className="card-icon-wrapper">
              <Sparkles className="card-icon" />
            </div>
            <h3 className="card-title">Cleanliness</h3>
            <div className="cleanliness-display">
              <div className="cleanliness-circle">
                <div className="cleanliness-progress" style={{ '--percentage': (cleanliness || templateCleanliness).percentage } as React.CSSProperties}>
                  <span className="cleanliness-percentage">{(cleanliness || templateCleanliness).percentage}%</span>
                </div>
              </div>
              <p className="cleanliness-description">{(cleanliness || templateCleanliness).description}</p>
            </div>
          </div>
          )}
        </div>

        {/* Specific Feedback Row - Show cards with data or template data */}
        <div className="feedback-row">
          {/* Patient Care Sentiment */}
          {(patientCareSentiment || isTemplateMode || (hasData && hasAttribute('patient care sentiment'))) && (
          <div className="insight-card care-card">
            <div className="card-icon-wrapper">
              <Heart className="card-icon" />
            </div>
            <h3 className="card-title">Patient Care Sentiment</h3>
            <div className="sentiment-bars">
              {(patientCareSentiment || templatePatientCareSentiment).map((item, index) => (
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
          )}

          {/* Pharmacy Experience */}
          {(pharmacyExperience || isTemplateMode || (hasData && hasAttribute('pharmacy experience'))) && (
          <div className="insight-card pharmacy-card">
            <div className="card-icon-wrapper">
              <Pill className="card-icon" />
            </div>
            <h3 className="card-title">Pharmacy Experience</h3>
            <p className="pharmacy-description">{(pharmacyExperience || templatePharmacyExperience).description}</p>
            <div className="pharmacy-metric">
              <span className="pharmacy-percentage">{(pharmacyExperience || templatePharmacyExperience).positive}%</span>
              <span className="pharmacy-label">Positive</span>
            </div>
          </div>
          )}

          {/* Diagnosis Accuracy */}
          {(diagnosisAccuracy || isTemplateMode || (hasData && hasAttribute('diagnosis accuracy'))) && (
          <div className="insight-card diagnosis-card">
            <div className="card-icon-wrapper">
              <CheckCircle2 className="card-icon" />
            </div>
            <h3 className="card-title">Diagnosis Accuracy</h3>
            <p className="diagnosis-description">{(diagnosisAccuracy || templateDiagnosisAccuracy).description}</p>
            <div className="diagnosis-metric">
              <span className="diagnosis-percentage">{(diagnosisAccuracy || templateDiagnosisAccuracy).satisfaction}%</span>
              <span className="diagnosis-label">Satisfaction</span>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  )
}
