'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Download, TrendingUp, TrendingDown, Star, MapPin, Phone, Clock, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react'
import { reviewAPI, PlaceDataResponse } from '@/lib/api'
import jsPDF from 'jspdf'
import './service-center-analytics.css'

interface ServiceCenterAnalyticsProps {
  centerName?: string
  onNavigateBack?: () => void
}

export default function ServiceCenterAnalytics({ 
  centerName: centerNameProp,
  onNavigateBack 
}: ServiceCenterAnalyticsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const placeName = centerNameProp || searchParams.get('place') || undefined
  const [selectedPeriod, setSelectedPeriod] = useState('Weekly')
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
  const displayName = data?.place_name || placeName || 'Service Center'

  const handleBackNavigation = () => {
    if (onNavigateBack) {
      onNavigateBack()
    } else {
      router.push('/')
    }
  }

  if (loading) {
    return (
      <div className="service-center-container">
        <div className="service-center-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
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
      <div className="service-center-container">
        <div className="service-center-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#ef4444', fontSize: '1.125rem', marginBottom: '1rem' }}>Error: {error}</p>
            <button onClick={() => placeName && fetchData(placeName)} style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: 'white', border: 'none', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Retry</button>
          </div>
        </div>
      </div>
    )
  }

  const metricsData = {
    totalReviews: { value: hasData && data.total_reviews ? data.total_reviews.toLocaleString() : '1,204', trend: 'up' as const, change: '+5.2%' },
    averageRating: { value: hasData && data.rating ? data.rating.toFixed(1) : '4.7', trend: 'down' as const, change: '-0.1%' }
  }

  const timePeriods = hasData && data.possible_filters ? data.possible_filters : ['Weekly', 'Monthly', 'Yearly', 'All Time']
  
  // Safely calculate max mentions with type checking
  const maxPositiveMentions = data?.pos_reviews && Array.isArray(data.pos_reviews) && data.pos_reviews.length > 0 
    ? Math.max(...data.pos_reviews.map((r: any) => (typeof r === 'object' && r?.mentions) ? r.mentions : 0).filter((m: number) => !isNaN(m))) 
    : 1
  const maxNegativeMentions = data?.neg_reviews && Array.isArray(data.neg_reviews) && data.neg_reviews.length > 0 
    ? Math.max(...data.neg_reviews.map((r: any) => (typeof r === 'object' && r?.mentions) ? r.mentions : 0).filter((m: number) => !isNaN(m))) 
    : 1

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
    doc.text(displayName || 'Service Center Analytics', margin, 25)
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
    addText(`Average Rating: ${metricsData.averageRating.value} / 5.0`, 11, true)
    addText(`Selected Time Period: ${selectedPeriod}`, 10, false, [100, 100, 100])
    yPosition += sectionSpacing

    // Service Center Info
    if (isTemplateMode) {
      addText('SERVICE CENTER INFO', 12, true, [30, 27, 75])
      yPosition += 5
      addText(`Address: ${serviceCenterInfo.address}`, 10)
      addText(`Phone: ${serviceCenterInfo.phone}`, 10)
      yPosition += sectionSpacing
    }

    // Rating Distribution
    if (isTemplateMode) {
      addText('OVERALL RATING DISTRIBUTION', 12, true, [30, 27, 75])
      yPosition += 5
      addText(`Average: ${ratingDistribution.average} / 5.0`, 11, true)
      addText(`Based on ${ratingDistribution.basedOn.toLocaleString()} reviews`, 10)
      ratingDistribution.distribution.forEach((item) => {
        addText(`${item.stars} stars: ${item.percentage}%`, 10)
      })
      yPosition += sectionSpacing
    }

    // Top Praised Staff
    if (isTemplateMode) {
      addText('TOP PRAISED STAFF', 12, true, [30, 27, 75])
      yPosition += 5
      topPraisedStaff.forEach((staff, index) => {
        addText(`${index + 1}. ${staff.name} - ${staff.mentions} mentions`, 10)
      })
      yPosition += sectionSpacing
    } else if (hasData && hasAttribute('employee praised')) {
      addText('TOP PRAISED STAFF', 12, true, [30, 27, 75])
      yPosition += 5
      addText(data.attributes_analyzed['employee praised'], 10)
      yPosition += sectionSpacing
    }

    // Service Quality
    if (isTemplateMode) {
      addText('SERVICE QUALITY MENTIONS', 12, true, [30, 27, 75])
      yPosition += 5
      serviceQualityMentions.forEach((item) => {
        addText(`${item.label}: ${item.percentage}%`, 10)
      })
      yPosition += sectionSpacing
    } else if (hasData && hasAttribute('service quality mentions')) {
      addText('SERVICE QUALITY MENTIONS', 12, true, [30, 27, 75])
      yPosition += 5
      addText(data.attributes_analyzed['service quality mentions'], 10)
      yPosition += sectionSpacing
    }

    // Pricing Sentiment
    if (isTemplateMode) {
      addText('PRICING SENTIMENT', 12, true, [30, 27, 75])
      yPosition += 5
      addText(`${pricingSentiment.sentiment}`, 11, true)
      addText(pricingSentiment.change, 10)
      yPosition += sectionSpacing
    }

    // Average Service Time
    if (isTemplateMode) {
      addText('AVERAGE SERVICE TIME', 12, true, [30, 27, 75])
      yPosition += 5
      addText(`Current: ${averageServiceTime.current}`, 11, true)
      addText(`Previous: ${averageServiceTime.previous}`, 10)
      yPosition += sectionSpacing
    } else if (hasData && hasAttribute('service time')) {
      addText('AVERAGE SERVICE TIME', 12, true, [30, 27, 75])
      yPosition += 5
      addText(data.attributes_analyzed['service time'], 10)
      yPosition += sectionSpacing
    }

    // Fuel Quality
    if (isTemplateMode) {
      addText('FUEL QUALITY FEEDBACK', 12, true, [30, 27, 75])
      yPosition += 5
      addText(`Positive: ${fuelQualityFeedback.positive}%`, 10, false, [16, 185, 129])
      addText(`Negative: ${fuelQualityFeedback.negative}%`, 10, false, [239, 68, 68])
      yPosition += sectionSpacing
    } else if (hasData && hasAttribute('fuel quality')) {
      addText('FUEL QUALITY FEEDBACK', 12, true, [30, 27, 75])
      yPosition += 5
      addText(data.attributes_analyzed['fuel quality'], 10)
      yPosition += sectionSpacing
    }

    // Positive Reviews
    if (data && data.pos_reviews && Array.isArray(data.pos_reviews) && data.pos_reviews.length > 0) {
      addText('TOP POSITIVE HIGHLIGHTS', 12, true, [30, 27, 75])
      yPosition += 5
      data.pos_reviews.slice(0, 5).forEach((review: any, index: number) => {
        const reviewText = typeof review === 'string' ? review : (review?.text || '')
        const safeText = typeof reviewText === 'string' ? reviewText : String(reviewText || '')
        const truncatedText = safeText.length > 150 ? safeText.substring(0, 150) + '...' : safeText
        addText(`${index + 1}. ${truncatedText}`, 9)
        addText(`   Mentions: ${review?.mentions || 0}`, 8, false, [16, 185, 129])
        yPosition += 3
      })
      yPosition += sectionSpacing
    }

    // Negative Reviews
    if (data && data.neg_reviews && Array.isArray(data.neg_reviews) && data.neg_reviews.length > 0) {
      addText('TOP NEGATIVE HIGHLIGHTS', 12, true, [30, 27, 75])
      yPosition += 5
      data.neg_reviews.slice(0, 5).forEach((review: any, index: number) => {
        const reviewText = typeof review === 'string' ? review : (review?.text || '')
        const safeText = typeof reviewText === 'string' ? reviewText : String(reviewText || '')
        const truncatedText = safeText.length > 150 ? safeText.substring(0, 150) + '...' : safeText
        addText(`${index + 1}. ${truncatedText}`, 9)
        addText(`   Mentions: ${review?.mentions || 0}`, 8, false, [239, 68, 68])
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

    doc.save(`${displayName || 'Service_Center'}_Analytics_${new Date().toISOString().split('T')[0]}.pdf`)
  }

  return (
    <div className="service-center-container">
      <div className="service-center-content">
        {/* Main Header with Title and Export Button */}
        <div className="service-center-main-header">
          <div className="service-center-title-section">
            <h1 className="service-center-title">{displayName}</h1>
          </div>
          <div className="service-center-header-right">
            <button className="export-button" onClick={handleExportPDF}>
              <Download className="export-icon" />
              Export Data
            </button>
          </div>
        </div>

        {/* Time Period Tabs */}
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
              {[1, 2, 3, 4, 5].map((star) => {
                const rating = hasData && data.rating ? data.rating : 4.7
                const isFilled = star <= Math.floor(rating)
                return <Star key={star} className={`star-icon ${isFilled ? 'filled' : ''}`} style={isFilled ? { fill: '#fbbf24', color: '#fbbf24' } : {}} />
              })}
            </div>
            <div className="metric-trend">
              <TrendingDown className="trend-icon down" />
              <span className="trend-text">{metricsData.averageRating.change}</span>
            </div>
          </div>
        </div>

        {/* Top Positive and Negative Highlights */}
        {!isTemplateMode && data && Array.isArray(data.pos_reviews) && Array.isArray(data.neg_reviews) && (data.pos_reviews.length > 0 || data.neg_reviews.length > 0) && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
            {data.pos_reviews && data.pos_reviews.length > 0 && (
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '1rem', padding: '2rem', border: '2px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <ThumbsUp style={{ width: '2.5rem', height: '2.5rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.2)', padding: '0.5rem', borderRadius: '0.75rem' }} />
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.5rem 0' }}>Top Positive Highlights</h2>
                    <p style={{ fontSize: '0.875rem', color: '#a1a1aa', margin: 0 }}>What customers appreciate the most</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {data.pos_reviews.slice(0, 5).map((review: any, index: number) => {
                    const reviewText = typeof review === 'string' ? review : (review?.text || '')
                    const safeText = typeof reviewText === 'string' ? reviewText : String(reviewText || '')
                    const mentions = review?.mentions || 0
                    const percentage = maxPositiveMentions > 0 ? (mentions / maxPositiveMentions) * 100 : 0
                    return (
                      <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', borderRadius: '0.75rem' }}>
                        <p style={{ fontSize: '0.9375rem', color: '#ffffff', fontWeight: 500, margin: 0, lineHeight: 1.5 }}>{safeText}</p>
                        <div style={{ width: '100%', height: '0.5rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '0.25rem', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${percentage}%`, background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)', borderRadius: '0.25rem' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.375rem 0.75rem', borderRadius: '0.5rem', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#10b981' }}>{mentions} mentions</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {data.neg_reviews && data.neg_reviews.length > 0 && (
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '1rem', padding: '2rem', border: '2px solid rgba(239, 68, 68, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <ThumbsDown style={{ width: '2.5rem', height: '2.5rem', color: '#ef4444', background: 'rgba(239, 68, 68, 0.2)', padding: '0.5rem', borderRadius: '0.75rem' }} />
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.5rem 0' }}>Top Negative Highlights</h2>
                    <p style={{ fontSize: '0.875rem', color: '#a1a1aa', margin: 0 }}>Common complaints and issues</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {data.neg_reviews.slice(0, 5).map((review: any, index: number) => {
                    const reviewText = typeof review === 'string' ? review : (review?.text || '')
                    const safeText = typeof reviewText === 'string' ? reviewText : String(reviewText || '')
                    const mentions = review?.mentions || 0
                    const percentage = maxNegativeMentions > 0 ? (mentions / maxNegativeMentions) * 100 : 0
                    return (
                      <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', borderRadius: '0.75rem' }}>
                        <p style={{ fontSize: '0.9375rem', color: '#ffffff', fontWeight: 500, margin: 0, lineHeight: 1.5 }}>{safeText}</p>
                        <div style={{ width: '100%', height: '0.5rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '0.25rem', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${percentage}%`, background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)', borderRadius: '0.25rem' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.375rem 0.75rem', borderRadius: '0.5rem', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444' }}>{mentions} mentions</span>
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
          {/* Service Center Info */}
          {isTemplateMode && (
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
          )}

          {/* Overall Rating Distribution */}
          {isTemplateMode && (
            <div className="insight-card rating-distribution-card">
              <h3 className="card-title">Overall Rating Distribution</h3>
              <div className="rating-summary">
                <div className="rating-average">
                  <span className="average-value">{ratingDistribution.average}</span>
                  <div className="stars-display-small">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const rating = 4.7
                      const isFilled = star <= Math.floor(rating)
                      return <Star key={star} className={`star-icon ${isFilled ? 'filled' : ''}`} style={isFilled ? { fill: '#fbbf24', color: '#fbbf24' } : {}} />
                    })}
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
          )}

          {/* Top Praised Staff */}
          {(isTemplateMode || (hasData && hasAttribute('employee praised'))) && (
            <div className="insight-card staff-card">
              <h3 className="card-title">Top Praised Staff</h3>
              {isTemplateMode ? (
                <div className="staff-list">
                  {topPraisedStaff.map((staff, index) => (
                    <div key={index} className="staff-item">
                      <span className="staff-rank">{index + 1}.</span>
                      <span className="staff-name">{staff.name}</span>
                      <span className="staff-mentions">- {staff.mentions} mentions</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>{data?.attributes_analyzed?.['employee praised'] || ''}</p>
              )}
            </div>
          )}

          {/* Service Quality Mentions */}
          {(isTemplateMode || (hasData && hasAttribute('service quality mentions'))) && (
            <div className="insight-card quality-card">
              <h3 className="card-title">Service Quality Mentions</h3>
              {isTemplateMode ? (
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
              ) : (
                <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>{data?.attributes_analyzed?.['service quality mentions'] || ''}</p>
              )}
            </div>
          )}

          {/* Pricing Sentiment */}
          {(isTemplateMode || (hasData && data?.highlights?.some((h: string) => h.toLowerCase().includes('pricing') || h.toLowerCase().includes('price')))) && (
            <div className="insight-card pricing-card">
              <h3 className="card-title">Pricing Sentiment</h3>
              {isTemplateMode ? (
                <>
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
                </>
              ) : (
                <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>Mentioned in reviews</p>
              )}
            </div>
          )}

          {/* Parts Quality Feedback */}
          {(isTemplateMode || (hasData && hasAttribute('parts quality feedback'))) && (
            <div className="insight-card parts-card">
              <h3 className="card-title">Parts Quality Feedback</h3>
              {isTemplateMode ? (
                <div className="parts-labels">
                  <span className="parts-label">OEM</span>
                  <span className="parts-label">Aftermarket</span>
                </div>
              ) : (
                <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>{data?.attributes_analyzed?.['parts quality feedback'] || ''}</p>
              )}
            </div>
          )}

          {/* Average Service Time */}
          {(isTemplateMode || (hasData && hasAttribute('service time'))) && (
            <div className="insight-card service-time-card">
              <h3 className="card-title">Average Service Time</h3>
              {isTemplateMode ? (
                <div className="service-time-display">
                  <Clock className="service-time-icon" />
                  <div className="service-time-info">
                    <span className="service-time-value">{averageServiceTime.current}</span>
                    <span className="service-time-comparison">vs. {averageServiceTime.previous} last month</span>
                  </div>
                </div>
              ) : (
                <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>{data?.attributes_analyzed?.['service time'] || ''}</p>
              )}
            </div>
          )}

          {/* Fuel Quality Feedback */}
          {(isTemplateMode || (hasData && hasAttribute('fuel quality'))) && (
            <div className="insight-card fuel-card">
              <h3 className="card-title">Fuel Quality Feedback (Petrol Stations)</h3>
              {isTemplateMode ? (
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
              ) : (
                <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>{data?.attributes_analyzed?.['fuel quality'] || ''}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
