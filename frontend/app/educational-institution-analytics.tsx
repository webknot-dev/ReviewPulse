'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Download, TrendingUp, GraduationCap, BookOpen, Building, ClipboardList, Headphones, MapPin, Phone, Globe, Star, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react'
import { reviewAPI, PlaceDataResponse } from '@/lib/api'
import './educational-institution-analytics.css'

interface EducationalInstitutionAnalyticsProps {
  institutionName?: string
  onNavigateBack?: () => void
}

export default function EducationalInstitutionAnalytics({ 
  institutionName: institutionNameProp,
  onNavigateBack 
}: EducationalInstitutionAnalyticsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const placeName = institutionNameProp || searchParams.get('place') || undefined
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [data, setData] = useState<PlaceDataResponse['placeData'] | null>(null)

  useEffect(() => {
    if (placeName) {
      fetchData(placeName)
    }
  }, [placeName])

  const fetchData = async (place: string) => {
    setLoading(true)
    setError('')
    try {
      const response = await reviewAPI.fetchAndAnalyze(place)
      if (response.success) {
        setData(response.placeData)
      } else {
        setError('Failed to fetch data')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const hasAttribute = (key: string): boolean => {
    if (!data?.attributes_analyzed) return false
    const value = data.attributes_analyzed[key]
    return !!value && typeof value === 'string' && value.trim() !== '' && value.toLowerCase() !== 'not enough information from the reviews to analyze'
  }

  const isTemplateMode = !placeName
  const hasData = !!data
  const displayName = data?.place_name || placeName || 'Edutech Analytics'

  const handleBackNavigation = () => {
    if (onNavigateBack) {
      onNavigateBack()
    } else {
      router.push('/')
    }
  }

  if (loading) {
    return (
      <div className="education-analytics-container">
        <div className="education-analytics-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
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
      <div className="education-analytics-container">
        <div className="education-analytics-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#ef4444', fontSize: '1.125rem', marginBottom: '1rem' }}>Error: {error}</p>
            <button onClick={() => placeName && fetchData(placeName)} style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: 'white', border: 'none', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Retry</button>
          </div>
        </div>
      </div>
    )
  }

  const metricsData = {
    reviews: { value: hasData && data.total_reviews ? data.total_reviews.toLocaleString() : '1,284', trend: 'up' as const, change: '+12% from last month' },
    averageRating: { value: hasData && data.rating ? data.rating.toFixed(1) : '4.5', trend: 'up' as const, change: '+0.2 from last month' }
  }

  const timePeriods = hasData && data.possible_filters ? data.possible_filters : ['Weekly', 'Monthly', 'Yearly', 'All Time']
  const maxPositiveMentions = data?.pos_reviews && data.pos_reviews.length > 0 ? Math.max(...data.pos_reviews.map(r => r.mentions)) : 1
  const maxNegativeMentions = data?.neg_reviews && data.neg_reviews.length > 0 ? Math.max(...data.neg_reviews.map(r => r.mentions)) : 1

  const topTeachers = [
    { name: 'John Smith', subject: 'Mathematics', rating: '4.9', avatar: '👨‍🏫' },
    { name: 'Anna Doe', subject: 'Physics', rating: '4.8', avatar: '👩‍🏫' },
    { name: 'Maria Public', subject: 'History', rating: '4.8', avatar: '👩‍🏫' }
  ]

  const teachingQuality = {
    score: '8.5',
    maxScore: '10',
    sentiment: [
      { label: 'Positive', percentage: 75, color: '#10b981' },
      { label: 'Neutral', percentage: 15, color: '#f59e0b' },
      { label: 'Negative', percentage: 10, color: '#ef4444' }
    ]
  }

  const campusQuality = {
    score: '7.8',
    maxScore: '10',
    keywords: [
      { text: 'Modern Labs', color: 'green' },
      { text: 'Library', color: 'green' },
      { text: 'Wi-Fi', color: 'red' },
      { text: 'Cafeteria', color: 'red' }
    ]
  }

  const managementFeedback = {
    score: '6.2',
    maxScore: '10',
    keywords: [
      { text: 'Supportive', color: 'green' },
      { text: 'Slow Response', color: 'red' },
      { text: 'Bureaucratic', color: 'red' }
    ]
  }

  const studentSupport = {
    score: '9.1',
    maxScore: '10',
    responseTime: '24 Hours'
  }

  const institutionInfo = {
    address: '123 University Ave, Learnington, ED 54321',
    addressLabel: 'Main Campus Address',
    phone: '+1 (555) 123-4567',
    phoneLabel: 'Admissions Office',
    website: 'www.university-example.edu',
    websiteLabel: 'Official Website'
  }

  return (
    <div className="education-analytics-container">
      <div className="education-analytics-content">
        {/* Header */}
        <div className="education-header">
          <div className="education-header-left">
            <div className="education-logo">
              <GraduationCap className="logo-icon" />
            </div>
            <div className="education-title-section">
              <h1 className="education-title">{displayName}</h1>
              <p className="education-subtitle">Review Insights Dashboard</p>
            </div>
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
              <div className="stars-display">
                {[1, 2, 3, 4, 5].map((star) => {
                  const rating = hasData && data.rating ? data.rating : 4.5
                  const isFilled = star <= Math.floor(rating)
                  return <Star key={star} className={`star-icon ${isFilled ? 'filled' : ''}`} style={isFilled ? { fill: '#fbbf24', color: '#fbbf24' } : {}} />
                })}
              </div>
            </div>
            <div className="metric-trend">
              <TrendingUp className="trend-icon up" />
              <span className="trend-text">{metricsData.averageRating.change}</span>
            </div>
          </div>
        </div>

        {/* Top Positive and Negative Highlights */}
        {!isTemplateMode && data && (data.pos_reviews.length > 0 || data.neg_reviews.length > 0) && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
            {data.pos_reviews.length > 0 && (
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '1rem', padding: '2rem', border: '2px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <ThumbsUp style={{ width: '2.5rem', height: '2.5rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.2)', padding: '0.5rem', borderRadius: '0.75rem' }} />
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.5rem 0' }}>Top Positive Highlights</h2>
                    <p style={{ fontSize: '0.875rem', color: '#a1a1aa', margin: 0 }}>What customers appreciate the most</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {data.pos_reviews.slice(0, 5).map((review, index) => {
                    const percentage = (review.mentions / maxPositiveMentions) * 100
                    return (
                      <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', borderRadius: '0.75rem' }}>
                        <p style={{ fontSize: '0.9375rem', color: '#ffffff', fontWeight: 500, margin: 0, lineHeight: 1.5 }}>{review.text}</p>
                        <div style={{ width: '100%', height: '0.5rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '0.25rem', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${percentage}%`, background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)', borderRadius: '0.25rem' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.375rem 0.75rem', borderRadius: '0.5rem', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#10b981' }}>{review.mentions} mentions</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {data.neg_reviews.length > 0 && (
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '1rem', padding: '2rem', border: '2px solid rgba(239, 68, 68, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <ThumbsDown style={{ width: '2.5rem', height: '2.5rem', color: '#ef4444', background: 'rgba(239, 68, 68, 0.2)', padding: '0.5rem', borderRadius: '0.75rem' }} />
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.5rem 0' }}>Top Negative Highlights</h2>
                    <p style={{ fontSize: '0.875rem', color: '#a1a1aa', margin: 0 }}>Common complaints and issues</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {data.neg_reviews.slice(0, 5).map((review, index) => {
                    const percentage = (review.mentions / maxNegativeMentions) * 100
                    return (
                      <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', borderRadius: '0.75rem' }}>
                        <p style={{ fontSize: '0.9375rem', color: '#ffffff', fontWeight: 500, margin: 0, lineHeight: 1.5 }}>{review.text}</p>
                        <div style={{ width: '100%', height: '0.5rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '0.25rem', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${percentage}%`, background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)', borderRadius: '0.25rem' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.375rem 0.75rem', borderRadius: '0.5rem', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444' }}>{review.mentions} mentions</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Key Insights Section */}
        {(isTemplateMode || (hasData && data.attributes_analyzed && Object.keys(data.attributes_analyzed).length > 0)) && (
          <div className="key-insights-section">
            <h2 className="section-title">Key Insights</h2>
            
            <div className="insights-grid">
              {/* Top Recommended Teachers */}
              {(isTemplateMode || (hasData && (hasAttribute('top recommended teachers') || hasAttribute('appreciated staffs') || hasAttribute('top recommended teacher')))) && (
                <div className="insight-card teachers-card">
                  <div className="card-header">
                    <GraduationCap className="card-icon" />
                    <h3 className="card-title">Top Recommended Teachers</h3>
                  </div>
                  {isTemplateMode ? (
                    <div className="teachers-list">
                      {topTeachers.map((teacher, index) => (
                        <div key={index} className="teacher-item">
                          <div className="teacher-avatar">{teacher.avatar}</div>
                          <div className="teacher-info">
                            <span className="teacher-name">{teacher.name}</span>
                            <span className="teacher-subject">{teacher.subject}</span>
                          </div>
                          <div className="teacher-rating">
                            <span className="rating-value">{teacher.rating}</span>
                            <Star className="rating-star" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#a1a1aa', fontSize: '0.875rem', lineHeight: 1.6 }}>
                      {data?.attributes_analyzed['top recommended teachers'] || 
                       data?.attributes_analyzed['appreciated staffs'] || 
                       data?.attributes_analyzed['top recommended teacher']}
                    </p>
                  )}
                </div>
              )}

              {/* Quality of Teaching */}
              {(isTemplateMode || (hasData && (hasAttribute('quality of teaching') || hasAttribute('teaching quality')))) && (
                <div className="insight-card teaching-card">
                  <div className="card-header">
                    <BookOpen className="card-icon" />
                    <h3 className="card-title">Quality of Teaching</h3>
                  </div>
                  {isTemplateMode ? (
                    <>
                      <div className="score-display">
                        <span className="score-value">{teachingQuality.score}</span>
                        <span className="score-max">/{teachingQuality.maxScore}</span>
                        <span className="score-label">Overall Score</span>
                      </div>
                      <div className="sentiment-distribution">
                        {teachingQuality.sentiment.map((item, index) => (
                          <div key={index} className="sentiment-item">
                            <div className="sentiment-info">
                              <span className="sentiment-label">{item.label}</span>
                              <span className="sentiment-percentage">{item.percentage}%</span>
                            </div>
                            <div className="sentiment-bar">
                              <div 
                                className="sentiment-fill" 
                                style={{ 
                                  width: `${item.percentage}%`, 
                                  backgroundColor: item.color 
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p style={{ color: '#a1a1aa', fontSize: '0.875rem', lineHeight: 1.6 }}>
                      {data?.attributes_analyzed['quality of teaching'] || data?.attributes_analyzed['teaching quality']}
                    </p>
                  )}
                </div>
              )}

              {/* Overall Quality / Campus Quality */}
              {(isTemplateMode || (hasData && (hasAttribute('overall quality') || hasAttribute('campus quality') || hasAttribute('infrastructure quality')))) && (
                <div className="insight-card campus-card">
                  <div className="card-header">
                    <Building className="card-icon" />
                    <h3 className="card-title">Campus/Infrastructure Quality</h3>
                  </div>
                  {isTemplateMode ? (
                    <>
                      <div className="score-display">
                        <span className="score-value">{campusQuality.score}</span>
                        <span className="score-max">/{campusQuality.maxScore}</span>
                        <span className="score-label">Overall Score</span>
                      </div>
                      <div className="keywords-list">
                        {campusQuality.keywords.map((keyword, index) => (
                          <span 
                            key={index} 
                            className={`keyword-tag ${keyword.color}`}
                          >
                            {keyword.text}
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p style={{ color: '#a1a1aa', fontSize: '0.875rem', lineHeight: 1.6 }}>
                      {data?.attributes_analyzed['overall quality'] || 
                       data?.attributes_analyzed['campus quality'] || 
                       data?.attributes_analyzed['infrastructure quality']}
                    </p>
                  )}
                </div>
              )}

              {/* Student Quality */}
              {(isTemplateMode || (hasData && (hasAttribute('student quality') || hasAttribute('student support')))) && (
                <div className="insight-card support-card">
                  <div className="card-header">
                    <Headphones className="card-icon" />
                    <h3 className="card-title">Student Support & Quality</h3>
                  </div>
                  {isTemplateMode ? (
                    <>
                      <div className="score-display">
                        <span className="score-value">{studentSupport.score}</span>
                        <span className="score-max">/{studentSupport.maxScore}</span>
                        <span className="score-label">Satisfaction Score</span>
                      </div>
                      <div className="response-time">
                        <span className="response-label">Avg. Response Time</span>
                        <span className="response-value">{studentSupport.responseTime}</span>
                      </div>
                    </>
                  ) : (
                    <p style={{ color: '#a1a1aa', fontSize: '0.875rem', lineHeight: 1.6 }}>
                      {data?.attributes_analyzed['student quality'] || data?.attributes_analyzed['student support']}
                    </p>
                  )}
                </div>
              )}

              {/* Show any other attributes dynamically */}
              {hasData && !isTemplateMode && data && Object.entries(data.attributes_analyzed).map(([key, value]) => {
                // Skip already shown attributes
                const shownKeys = ['top recommended teachers', 'appreciated staffs', 'top recommended teacher', 
                                  'quality of teaching', 'teaching quality', 'overall quality', 'campus quality', 
                                  'infrastructure quality', 'student quality', 'student support']
                if (shownKeys.some(k => key.toLowerCase().includes(k.toLowerCase()))) return null
                if (!hasAttribute(key)) return null

                return (
                  <div key={key} className="insight-card">
                    <div className="card-header">
                      <BookOpen className="card-icon" />
                      <h3 className="card-title">{key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</h3>
                    </div>
                    <p style={{ color: '#a1a1aa', fontSize: '0.875rem', lineHeight: 1.6 }}>{value}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Institution Contact Information */}
        {isTemplateMode && (
          <div className="contact-section">
            <h2 className="section-title">Institution Contact Information</h2>
            <div className="contact-info-card">
              <div className="contact-item">
                <MapPin className="contact-icon" />
                <div className="contact-details">
                  <span className="contact-value">{institutionInfo.address}</span>
                  <span className="contact-label">{institutionInfo.addressLabel}</span>
                </div>
              </div>
              <div className="contact-item">
                <Phone className="contact-icon" />
                <div className="contact-details">
                  <span className="contact-value">{institutionInfo.phone}</span>
                  <span className="contact-label">{institutionInfo.phoneLabel}</span>
                </div>
              </div>
              <div className="contact-item">
                <Globe className="contact-icon" />
                <div className="contact-details">
                  <span className="contact-value">{institutionInfo.website}</span>
                  <span className="contact-label">{institutionInfo.websiteLabel}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
