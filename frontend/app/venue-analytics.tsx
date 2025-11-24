'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Download, TrendingUp, Star, MapPin, Phone, Activity, Gamepad2, Theater, LineChart, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react'
import { reviewAPI, PlaceDataResponse } from '@/lib/api'
import jsPDF from 'jspdf'
import './venue-analytics.css'

interface VenueAnalyticsProps {
  venueName?: string
  onNavigateBack?: () => void
}

export default function VenueAnalytics({ 
  venueName: venueNameProp,
  onNavigateBack 
}: VenueAnalyticsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const placeName = venueNameProp || searchParams.get('place') || undefined
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
  const displayName = data?.place_name || placeName || 'Venue Analytics'

  const handleBackNavigation = () => {
    if (onNavigateBack) {
      onNavigateBack()
    } else {
      router.push('/')
    }
  }

  if (loading) {
    return (
      <div className="venue-analytics-container">
        <div className="venue-analytics-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
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
      <div className="venue-analytics-container">
        <div className="venue-analytics-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#ef4444', fontSize: '1.125rem', marginBottom: '1rem' }}>Error: {error}</p>
            <button onClick={() => placeName && fetchData(placeName)} style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: 'white', border: 'none', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Retry</button>
          </div>
        </div>
      </div>
    )
  }

  const metricsData = {
    totalReviews: { value: hasData && data.total_reviews ? data.total_reviews.toLocaleString() : '1,287', trend: 'up' as const, change: '+12.5% vs last month' },
    averageRating: { value: hasData && data.rating ? data.rating.toFixed(1) : '4.7', maxValue: '5', trend: 'up' as const, change: '+0.2 vs last month' }
  }

  const timePeriods = hasData && data.possible_filters ? data.possible_filters : ['Weekly', 'Monthly', 'Yearly', 'All Time']
  const maxPositiveMentions = data?.pos_reviews && data.pos_reviews.length > 0 ? Math.max(...data.pos_reviews.map(r => r.mentions)) : 1
  const maxNegativeMentions = data?.neg_reviews && data.neg_reviews.length > 0 ? Math.max(...data.neg_reviews.map(r => r.mentions)) : 1

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

  // PDF Export Function
  const handleExportPDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let yPosition = 20
    const margin = 20
    const lineHeight = 7
    const sectionSpacing = 10

    const checkPageBreak = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        doc.addPage()
        yPosition = 20
      }
    }

    const addText = (text: string, fontSize: number = 10, isBold: boolean = false, color: number[] = [0, 0, 0]) => {
      checkPageBreak(lineHeight * 2)
      doc.setFontSize(fontSize)
      doc.setTextColor(color[0], color[1], color[2])
      doc.setFont('helvetica', isBold ? 'bold' : 'normal')
      const splitText = doc.splitTextToSize(text, pageWidth - 2 * margin)
      doc.text(splitText, margin, yPosition)
      yPosition += splitText.length * lineHeight
    }

    // Header
    doc.setFillColor(30, 27, 75)
    doc.rect(0, 0, pageWidth, 40, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text(displayName || 'Venue Analytics', margin, 25)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Analytics Report', margin, 35)
    yPosition = 50

    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    addText(`Generated on: ${currentDate}`, 9, false, [100, 100, 100])
    yPosition += sectionSpacing

    // Key Metrics
    addText('KEY METRICS', 14, true, [30, 27, 75])
    yPosition += 5
    addText(`Total Reviews: ${metricsData.totalReviews.value}`, 11, true)
    addText(`Average Rating: ${metricsData.averageRating.value} / ${metricsData.averageRating.maxValue}`, 11, true)
    addText(`Selected Time Period: ${selectedPeriod}`, 10, false, [100, 100, 100])
    yPosition += sectionSpacing

    // Top Activities
    if (isTemplateMode) {
      addText('TOP 3 MOST-LOVED ACTIVITIES', 12, true, [30, 27, 75])
      yPosition += 5
      topActivities.forEach((activity, index) => {
        addText(`${index + 1}. ${activity.name}`, 10)
        addText(`   ${activity.description}`, 9)
        yPosition += 3
      })
      yPosition += sectionSpacing
    } else if (hasData && hasAttribute('top movies/activities')) {
      addText('TOP 3 MOST-LOVED ACTIVITIES', 12, true, [30, 27, 75])
      yPosition += 5
      addText(data.attributes_analyzed['top movies/activities'], 10)
      yPosition += sectionSpacing
    }

    // Audio/Video Quality
    if (isTemplateMode) {
      addText('AUDIO/VIDEO QUALITY', 12, true, [30, 27, 75])
      yPosition += 5
      addText(`Score: ${audioVideoQuality.score} / ${audioVideoQuality.maxScore}`, 11, true)
      addText(`Rating: ${audioVideoQuality.label} (${audioVideoQuality.percentage}%)`, 10)
      yPosition += sectionSpacing
    } else if (hasData && hasAttribute('audio/video quality')) {
      addText('AUDIO/VIDEO QUALITY', 12, true, [30, 27, 75])
      yPosition += 5
      addText(data.attributes_analyzed['audio/video quality'], 10)
      yPosition += sectionSpacing
    }

    // Cleanliness
    if (isTemplateMode) {
      addText('CLEANLINESS', 12, true, [30, 27, 75])
      yPosition += 5
      addText(`Score: ${cleanliness.score} / ${cleanliness.maxScore}`, 11, true)
      addText(`Rating: ${cleanliness.label} (${cleanliness.percentage}%)`, 10)
      yPosition += sectionSpacing
    } else if (hasData && hasAttribute('hygiene')) {
      addText('CLEANLINESS', 12, true, [30, 27, 75])
      yPosition += 5
      addText(data.attributes_analyzed['hygiene'], 10)
      yPosition += sectionSpacing
    }

    // Parking Availability
    if (isTemplateMode) {
      addText('PARKING AVAILABILITY', 12, true, [30, 27, 75])
      yPosition += 5
      addText(`${parkingAvailability.percentage}% ${parkingAvailability.label}`, 10)
      yPosition += sectionSpacing
    } else if (hasData && hasAttribute('parking availability sentiment')) {
      addText('PARKING AVAILABILITY', 12, true, [30, 27, 75])
      yPosition += 5
      addText(data.attributes_analyzed['parking availability sentiment'], 10)
      yPosition += sectionSpacing
    }

    // Family-Friendly
    if (isTemplateMode) {
      addText('FAMILY-FRIENDLY', 12, true, [30, 27, 75])
      yPosition += 5
      addText(`${familyFriendly.percentage}% ${familyFriendly.label}`, 10)
      yPosition += sectionSpacing
    }

    // Ambiance
    if (isTemplateMode) {
      addText('AMBIANCE', 12, true, [30, 27, 75])
      yPosition += 5
      ambianceTags.forEach((tag) => {
        addText(`- ${tag.text}`, 10)
      })
      yPosition += sectionSpacing
    } else if (hasData && hasAttribute('ambiance')) {
      addText('AMBIANCE', 12, true, [30, 27, 75])
      yPosition += 5
      addText(data.attributes_analyzed['ambiance'], 10)
      yPosition += sectionSpacing
    }

    // Venue Information
    if (isTemplateMode) {
      addText('VENUE INFORMATION', 12, true, [30, 27, 75])
      yPosition += 5
      addText(`Address: ${venueInfo.address}`, 10)
      addText(`Phone: ${venueInfo.phone}`, 10)
      yPosition += sectionSpacing
    }

    // Positive Reviews
    if (data && data.pos_reviews && data.pos_reviews.length > 0) {
      addText('TOP POSITIVE HIGHLIGHTS', 12, true, [30, 27, 75])
      yPosition += 5
      data.pos_reviews.slice(0, 5).forEach((review, index) => {
        addText(`${index + 1}. ${review.text.substring(0, 150)}${review.text.length > 150 ? '...' : ''}`, 9)
        addText(`   Mentions: ${review.mentions}`, 8, false, [16, 185, 129])
        yPosition += 3
      })
      yPosition += sectionSpacing
    }

    // Negative Reviews
    if (data && data.neg_reviews && data.neg_reviews.length > 0) {
      addText('TOP NEGATIVE HIGHLIGHTS', 12, true, [30, 27, 75])
      yPosition += 5
      data.neg_reviews.slice(0, 5).forEach((review, index) => {
        addText(`${index + 1}. ${review.text.substring(0, 150)}${review.text.length > 150 ? '...' : ''}`, 9)
        addText(`   Mentions: ${review.mentions}`, 8, false, [239, 68, 68])
        yPosition += 3
      })
    }

    // Footer
    const totalPages = doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' })
    }

    doc.save(`${displayName || 'Venue'}_Analytics_${new Date().toISOString().split('T')[0]}.pdf`)
  }

  return (
    <div className="venue-analytics-container">
      <div className="venue-analytics-content">
        {/* Header */}
        <div className="venue-header">
          <div className="venue-header-left">
            <div className="venue-title-section">
              <h1 className="venue-title">{displayName}</h1>
              <p className="venue-subtitle">Key insights from customer reviews.</p>
            </div>
          </div>
          <div className="venue-header-right">
            <button className="export-button" onClick={handleExportPDF}>
              <Download className="export-icon" />
              Export Data
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
              {[1, 2, 3, 4, 5].map((star) => {
                const rating = hasData && data.rating ? data.rating : 4.7
                const isFilled = star <= Math.floor(rating)
                return <Star key={star} className={`star-icon ${isFilled ? 'filled' : ''}`} style={isFilled ? { fill: '#fbbf24', color: '#fbbf24' } : {}} />
              })}
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

        {/* Content Grid */}
        <div className="content-grid">
          {/* Top 3 Most-Loved Activities */}
          {(isTemplateMode || (hasData && hasAttribute('top movies/activities'))) && (
            <div className="insight-card activities-card">
              <h3 className="card-title">Top 3 Most-Loved Activities</h3>
              {isTemplateMode ? (
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
              ) : (
                <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>{data.attributes_analyzed['top movies/activities']}</p>
              )}
            </div>
          )}

          {/* Audio/Video Quality */}
          {(isTemplateMode || (hasData && hasAttribute('audio/video quality'))) && (
            <div className="insight-card quality-card">
              <h3 className="card-title">Audio/Video Quality</h3>
              {isTemplateMode ? (
                <>
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
                </>
              ) : (
                <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>{data.attributes_analyzed['audio/video quality']}</p>
              )}
            </div>
          )}

          {/* Cleanliness */}
          {(isTemplateMode || (hasData && hasAttribute('hygiene'))) && (
            <div className="insight-card cleanliness-card">
              <h3 className="card-title">Cleanliness</h3>
              {isTemplateMode ? (
                <>
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
                </>
              ) : (
                <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>{data.attributes_analyzed['hygiene']}</p>
              )}
            </div>
          )}

          {/* Parking Availability */}
          {(isTemplateMode || (hasData && hasAttribute('parking availability sentiment'))) && (
            <div className="insight-card parking-card">
              <h3 className="card-title">Parking Availability</h3>
              {isTemplateMode ? (
                <>
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
                </>
              ) : (
                <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>{data.attributes_analyzed['parking availability sentiment']}</p>
              )}
            </div>
          )}

          {/* Family-Friendly */}
          {(isTemplateMode || (hasData && data.highlights.some(h => h.toLowerCase().includes('family')))) && (
            <div className="insight-card family-card">
              <h3 className="card-title">Family-Friendly</h3>
              {isTemplateMode ? (
                <>
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
                </>
              ) : (
                <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>Mentioned in reviews</p>
              )}
            </div>
          )}

          {/* Ambiance */}
          {(isTemplateMode || (hasData && hasAttribute('ambiance'))) && (
            <div className="insight-card ambiance-card">
              <h3 className="card-title">Ambiance</h3>
              {isTemplateMode ? (
                <div className="ambiance-tags">
                  {ambianceTags.map((tag, index) => (
                    <span key={index} className={`ambiance-tag ${tag.color}`}>
                      {tag.text}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>{data.attributes_analyzed['ambiance']}</p>
              )}
            </div>
          )}

          {/* Venue Information */}
          {isTemplateMode && (
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
          )}
        </div>
      </div>
    </div>
  )
}
