'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Download, Cloud, TrendingUp, TrendingDown, Star, MapPin, Phone, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react'
import { reviewAPI, PlaceDataResponse } from '@/lib/api'
import jsPDF from 'jspdf'
import './financial-services-analytics.css'

interface FinancialServicesAnalyticsProps {
  institutionName?: string
  placeName?: string
  onNavigateBack?: () => void
}

export default function FinancialServicesAnalytics({ 
  institutionName,
  placeName: placeNameProp,
  onNavigateBack 
}: FinancialServicesAnalyticsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const placeName = placeNameProp || searchParams.get('place') || undefined
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

  const handleBackNavigation = () => {
    if (onNavigateBack) {
      onNavigateBack()
    } else {
      router.push('/')
    }
  }

  if (loading) {
    return (
      <div className="financial-analytics-container">
        <div className="financial-analytics-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
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
      <div className="financial-analytics-container">
        <div className="financial-analytics-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#ef4444', fontSize: '1.125rem', marginBottom: '1rem' }}>Error: {error}</p>
            <button onClick={() => placeName && fetchData(placeName)} style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: 'white', border: 'none', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Retry</button>
          </div>
        </div>
      </div>
    )
  }

  const displayName = data?.place_name || placeName || institutionName || 'Review Insights'
  const metricsData = {
    totalReviews: { value: hasData && data.total_reviews ? data.total_reviews.toLocaleString() : '1,204', trend: 'up' as const, change: '+15%' },
    averageRating: { value: hasData && data.rating ? data.rating.toFixed(1) : '4.8', trend: 'up' as const, change: '+0.2' }
  }

  const timePeriods = hasData && data.possible_filters ? data.possible_filters : ['Weekly', 'Monthly', 'Yearly']
  const maxPositiveMentions = data?.pos_reviews && data.pos_reviews.length > 0 ? Math.max(...data.pos_reviews.map(r => r.mentions)) : 1
  const maxNegativeMentions = data?.neg_reviews && data.neg_reviews.length > 0 ? Math.max(...data.neg_reviews.map(r => r.mentions)) : 1

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
    doc.text(displayName || 'Financial Services Analytics', margin, 25)
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

    // Service Items
    if (isTemplateMode) {
      addText('MOST-MENTIONED SERVICE ITEMS', 12, true, [30, 27, 75])
      yPosition += 5
      serviceItems.forEach((item, index) => {
        addText(`${index + 1}. ${item.name}: ${item.mentions} mentions`, 10)
      })
      yPosition += sectionSpacing
    } else if (hasData && hasAttribute('most mentioned service teams')) {
      addText('MOST-MENTIONED SERVICE ITEMS', 12, true, [30, 27, 75])
      yPosition += 5
      addText(data.attributes_analyzed['most mentioned service teams'], 10)
      yPosition += sectionSpacing
    }

    // Service Speed
    if (isTemplateMode) {
      addText('SERVICE SPEED SENTIMENT', 12, true, [30, 27, 75])
      yPosition += 5
      addText(`Overall: ${serviceSpeedSentiment.overall}%`, 11, true)
      serviceSpeedSentiment.distribution.forEach((item) => {
        addText(`${item.label}: ${item.percentage}%`, 10)
      })
      yPosition += sectionSpacing
    } else if (hasData && hasAttribute('service speed')) {
      addText('SERVICE SPEED SENTIMENT', 12, true, [30, 27, 75])
      yPosition += 5
      addText(data.attributes_analyzed['service speed'], 10)
      yPosition += sectionSpacing
    }

    // Professional Skills
    if (isTemplateMode) {
      addText('PROFESSIONAL SKILLS SENTIMENT', 12, true, [30, 27, 75])
      yPosition += 5
      addText(`Overall: ${professionalSkillsSentiment.overall}%`, 11, true)
      professionalSkillsSentiment.distribution.forEach((item) => {
        addText(`${item.label}: ${item.percentage}%`, 10)
      })
      yPosition += sectionSpacing
    } else if (hasData && hasAttribute('professional skills sentiment')) {
      addText('PROFESSIONAL SKILLS SENTIMENT', 12, true, [30, 27, 75])
      yPosition += 5
      addText(data.attributes_analyzed['professional skills sentiment'], 10)
      yPosition += sectionSpacing
    }

    // Staff Friendliness
    if (isTemplateMode) {
      addText('STAFF FRIENDLINESS', 12, true, [30, 27, 75])
      yPosition += 5
      addText(`Overall: ${staffFriendliness.overall}%`, 11, true)
      staffFriendliness.distribution.forEach((item) => {
        addText(`${item.label}: ${item.percentage}%`, 10)
      })
      yPosition += sectionSpacing
    } else if (hasData && hasAttribute('staff friendliness')) {
      addText('STAFF FRIENDLINESS', 12, true, [30, 27, 75])
      yPosition += 5
      addText(data.attributes_analyzed['staff friendliness'], 10)
      yPosition += sectionSpacing
    }

    // Pricing Fairness
    if (isTemplateMode) {
      addText('PRICING FAIRNESS', 12, true, [30, 27, 75])
      yPosition += 5
      addText(`Overall: ${pricingFairness.overall}%`, 11, true)
      pricingFairness.distribution.forEach((item) => {
        addText(`${item.label}: ${item.percentage}%`, 10)
      })
      yPosition += sectionSpacing
    } else if (hasData && hasAttribute('pricing fairness')) {
      addText('PRICING FAIRNESS', 12, true, [30, 27, 75])
      yPosition += 5
      addText(data.attributes_analyzed['pricing fairness'], 10)
      yPosition += sectionSpacing
    }

    // Cleanliness
    if (isTemplateMode) {
      addText('CLEANLINESS & ENVIRONMENT', 12, true, [30, 27, 75])
      yPosition += 5
      addText(`Overall: ${cleanlinessEnvironment.overall}%`, 11, true)
      cleanlinessEnvironment.distribution.forEach((item) => {
        addText(`${item.label}: ${item.percentage}%`, 10)
      })
      yPosition += sectionSpacing
    } else if (hasData && hasAttribute('hygiene')) {
      addText('CLEANLINESS & ENVIRONMENT', 12, true, [30, 27, 75])
      yPosition += 5
      addText(data.attributes_analyzed['hygiene'], 10)
      yPosition += sectionSpacing
    }

    // Office Information
    if (isTemplateMode) {
      addText('OFFICE INFORMATION', 12, true, [30, 27, 75])
      yPosition += 5
      addText(`Address: ${officeInfo.address}`, 10)
      addText(`Phone: ${officeInfo.phone}`, 10)
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

    doc.save(`${displayName || 'Financial_Services'}_Analytics_${new Date().toISOString().split('T')[0]}.pdf`)
  }

  return (
    <div className="financial-analytics-container">
      <div className="financial-analytics-content">
        {/* Header */}
        <div className="financial-header">
          <div className="financial-header-left">
            <h1 className="financial-title">{displayName}</h1>
          </div>
          <div className="financial-header-right">
            <button className="export-button" onClick={handleExportPDF}>
              <Cloud className="export-icon" />
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
            <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map((star) => {
                const rating = hasData && data.rating ? data.rating : 4.8
                const isFilled = star <= Math.floor(rating)
                return <Star key={star} style={isFilled ? { fill: '#fbbf24', color: '#fbbf24', width: '1.25rem', height: '1.25rem' } : { width: '1.25rem', height: '1.25rem' }} />
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

        {/* Main Content Grid */}
        <div className="main-content-grid">
          {/* Most-mentioned Service Items */}
          {(isTemplateMode || (hasData && hasAttribute('most mentioned service teams'))) && (
            <div className="service-items-card insight-card">
              <h3 className="card-title">Most-mentioned service items</h3>
              <div className="service-items-chart">
                {isTemplateMode ? serviceItems.map((item, index) => (
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
                )) : (
                  <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>{data.attributes_analyzed['most mentioned service teams']}</p>
                )}
              </div>
            </div>
          )}

          {/* Sentiment Cards */}
          {/* Service Speed Sentiment */}
          {(isTemplateMode || (hasData && hasAttribute('service speed'))) && (
            <div className="sentiment-card insight-card">
              <h3 className="card-title">Service Speed Sentiment</h3>
              {isTemplateMode ? (
                <>
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
                </>
              ) : (
                <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>{data.attributes_analyzed['service speed']}</p>
              )}
            </div>
          )}

          {/* Professional Skills Sentiment */}
          {(isTemplateMode || (hasData && hasAttribute('professional skills sentiment'))) && (
            <div className="sentiment-card insight-card">
              <h3 className="card-title">Professional Skills Sentiment</h3>
              {isTemplateMode ? (
                <>
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
                </>
              ) : (
                <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>{data.attributes_analyzed['professional skills sentiment']}</p>
              )}
            </div>
          )}

          {/* Staff Friendliness */}
          {(isTemplateMode || (hasData && hasAttribute('staff friendliness'))) && (
            <div className="sentiment-card insight-card">
              <h3 className="card-title">Staff Friendliness</h3>
              {isTemplateMode ? (
                <>
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
                </>
              ) : (
                <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>{data.attributes_analyzed['staff friendliness']}</p>
              )}
            </div>
          )}

          {/* Pricing Fairness */}
          {(isTemplateMode || (hasData && hasAttribute('pricing fairness'))) && (
            <div className="sentiment-card insight-card">
              <h3 className="card-title">Pricing Fairness</h3>
              {isTemplateMode ? (
                <>
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
                </>
              ) : (
                <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>{data.attributes_analyzed['pricing fairness']}</p>
              )}
            </div>
          )}

          {/* Cleanliness & Environment */}
          {(isTemplateMode || (hasData && hasAttribute('hygiene'))) && (
            <div className="sentiment-card insight-card">
              <h3 className="card-title">Cleanliness & Environment</h3>
              {isTemplateMode ? (
                <>
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
                </>
              ) : (
                <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>{data.attributes_analyzed['hygiene']}</p>
              )}
            </div>
          )}

          {/* Office Information */}
          {isTemplateMode && (
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
          )}
        </div>
      </div>
    </div>
  )
}
