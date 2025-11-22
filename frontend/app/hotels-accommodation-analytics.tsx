'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Download, TrendingUp, TrendingDown, MapPin, Phone, Waves, Flower2, Car, ThumbsUp, ThumbsDown, Star, Loader2 } from 'lucide-react'
import { reviewAPI, PlaceDataResponse } from '@/lib/api'
import './hotels-accommodation-analytics.css'

interface HotelsAccommodationAnalyticsProps {
  hotelName?: string
  onNavigateBack?: () => void
}

export default function HotelsAccommodationAnalytics({ 
  hotelName: hotelNameProp,
  onNavigateBack 
}: HotelsAccommodationAnalyticsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const placeName = hotelNameProp || searchParams.get('place') || undefined
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
  const displayName = data?.place_name || placeName || 'Grand Hotel'

  const handleBackNavigation = () => {
    if (onNavigateBack) {
      onNavigateBack()
    } else {
      router.push('/')
    }
  }

  if (loading) {
    return (
      <div className="hotel-analytics-container">
        <div className="hotel-analytics-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
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
      <div className="hotel-analytics-container">
        <div className="hotel-analytics-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#ef4444', fontSize: '1.125rem', marginBottom: '1rem' }}>Error: {error}</p>
            <button onClick={() => placeName && fetchData(placeName)} style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: 'white', border: 'none', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Retry</button>
          </div>
        </div>
      </div>
    )
  }

  const metricsData = {
    reviews: { value: hasData && data.total_reviews ? data.total_reviews.toLocaleString() : '1,250', trend: 'up' as const, change: '15.2%' },
    averageRating: { value: hasData && data.rating ? data.rating.toFixed(1) : '4.6', maxValue: '5', trend: 'up' as const, change: '0.3' },
    locationConvenience: { value: '9.2', maxValue: '10', trend: 'down' as const, change: '0.5%' },
    averageRoomPrice: { value: '$235', trend: 'up' as const, change: '2.5%' }
  }

  const timePeriods = hasData && data.possible_filters ? data.possible_filters : ['Weekly', 'Monthly', 'Yearly', 'All Time']
  const maxPositiveMentions = data?.pos_reviews && data.pos_reviews.length > 0 ? Math.max(...data.pos_reviews.map(r => r.mentions)) : 1
  const maxNegativeMentions = data?.neg_reviews && data.neg_reviews.length > 0 ? Math.max(...data.neg_reviews.map(r => r.mentions)) : 1

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
          <h1 className="hotel-title">{displayName}</h1>
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
            <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map((star) => {
                const rating = hasData && data.rating ? data.rating : 4.6
                const isFilled = star <= Math.floor(rating)
                return <Star key={star} style={isFilled ? { fill: '#fbbf24', color: '#fbbf24', width: '1.25rem', height: '1.25rem' } : { width: '1.25rem', height: '1.25rem' }} />
              })}
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

        {/* Detailed Insights Section */}
        <div className="detailed-insights">
          <h2 className="section-title">Detailed Insights</h2>
          
          <div className="insights-grid">
            {/* Top 3 Appreciated Facilities */}
            {(isTemplateMode || (hasData && data.highlights.some(h => h.toLowerCase().includes('facility') || h.toLowerCase().includes('pool') || h.toLowerCase().includes('spa')))) && (
              <div className="insight-card facilities-card">
                <h3 className="card-title">Top 3 Appreciated Facilities</h3>
                {isTemplateMode ? (
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
                ) : (
                  <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>Mentioned in reviews</p>
                )}
              </div>
            )}

            {/* Room Cleanliness & Comfort */}
            {(isTemplateMode || (hasData && hasAttribute('hygiene'))) && (
              <div className="insight-card cleanliness-card">
                <h3 className="card-title">Room Cleanliness & Comfort</h3>
                {isTemplateMode ? (
                  <>
                    <div className="cleanliness-score">
                      <span className="score-value">{roomCleanliness.score}</span>
                      <span className="score-max">/{roomCleanliness.maxScore}</span>
                    </div>
                    <p className="score-description">Based on {roomCleanliness.basedOn} mentions</p>
                  </>
                ) : (
                  <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>{data.attributes_analyzed['hygiene']}</p>
                )}
              </div>
            )}

            {/* Top 5 Best Features */}
            {(isTemplateMode || (hasData && data.highlights.length > 0)) && (
              <div className="insight-card features-card">
                <h3 className="card-title">Top 5 Best Features</h3>
                {isTemplateMode ? (
                  <div className="features-list">
                    {topFeatures.map((feature, index) => (
                      <div key={index} className="feature-item">
                        <span className="feature-name">{feature.name}</span>
                        <span className="feature-rank">{feature.rank}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="features-list">
                    {data.highlights.slice(0, 5).map((highlight, index) => (
                      <div key={index} className="feature-item">
                        <span className="feature-name">{highlight}</span>
                        <span className="feature-rank">#{index + 1}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Complimentary Breakfast */}
            {(isTemplateMode || (hasData && data.highlights.some(h => h.toLowerCase().includes('breakfast')))) && (
              <div className="insight-card breakfast-card">
                <h3 className="card-title">Complimentary breakfast</h3>
                <div className="breakfast-status">
                  <span className="status-value">{isTemplateMode ? complimentaryBreakfast : 'Mentioned'}</span>
                </div>
              </div>
            )}

            {/* Hotel Information */}
            {isTemplateMode && (
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
            )}
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
