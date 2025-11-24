'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Star, TrendingUp, ThumbsUp, ThumbsDown, Loader2, Download } from 'lucide-react'
import { reviewAPI, PlaceDataResponse } from '@/lib/api'
import jsPDF from 'jspdf'
import './otheranalytics.css'

interface OtherAnalyticsProps {
  placeName?: string
  onNavigateBack?: () => void
}

export default function OtherAnalytics({ 
  placeName: placeNameProp,
  onNavigateBack 
}: OtherAnalyticsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const placeName = placeNameProp || searchParams.get('place') || undefined
  const [selectedPeriod, setSelectedPeriod] = useState('All Time')
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
      <div className="other-analytics-container">
        <div className="other-analytics-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
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
      <div className="other-analytics-container">
        <div className="other-analytics-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#ef4444', fontSize: '1.125rem', marginBottom: '1rem' }}>Error: {error}</p>
            <button onClick={() => placeName && fetchData(placeName)} style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: 'white', border: 'none', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Retry</button>
          </div>
        </div>
      </div>
    )
  }

  const templatePositiveHighlights = [
    { text: 'Exceptional customer service and friendly staff', mentions: 1247, percentage: 100 },
    { text: 'Clean and well-maintained facilities', mentions: 1089, percentage: 87 },
    { text: 'Great location with easy access to attractions', mentions: 892, percentage: 72 },
    { text: 'Delicious breakfast with variety of options', mentions: 743, percentage: 60 },
    { text: 'Comfortable beds and spacious rooms', mentions: 621, percentage: 50 }
  ]

  const templateNegativeHighlights = [
    { text: 'Slow Wi-Fi connection in some rooms', mentions: 456, percentage: 100 },
    { text: 'Long wait times during check-in', mentions: 389, percentage: 85 },
    { text: 'Parking is limited and expensive', mentions: 312, percentage: 68 },
    { text: 'Air conditioning not working properly', mentions: 267, percentage: 59 },
    { text: 'Noisy due to street traffic', mentions: 198, percentage: 43 }
  ]

  const metrics = {
    reviews: hasData && data.total_reviews ? data.total_reviews.toLocaleString() : '8,547',
    avgRating: hasData && data.rating ? data.rating.toFixed(1) : '4.2',
    sentiment: hasData && data.overall_sentiment ? data.overall_sentiment : 'positive',
    change: '0%'
  }

  const timePeriods = hasData && data.possible_filters ? data.possible_filters : ['Weekly', 'Monthly', 'Yearly', 'All Time']

  const positiveHighlights = hasData && data.pos_reviews ? data.pos_reviews.slice(0, 5) : (isTemplateMode ? templatePositiveHighlights : [])
  const negativeHighlights = hasData && data.neg_reviews ? data.neg_reviews.slice(0, 5) : (isTemplateMode ? templateNegativeHighlights : [])

  const maxPositiveMentions = positiveHighlights.length > 0 ? Math.max(...positiveHighlights.map(h => h.mentions)) : 1
  const maxNegativeMentions = negativeHighlights.length > 0 ? Math.max(...negativeHighlights.map(h => h.mentions)) : 1

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
    doc.text(data?.place_name || placeName || 'Review Analytics', margin, 25)
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
    addText(`Total Reviews: ${metrics.reviews}`, 11, true)
    addText(`Average Rating: ${metrics.avgRating} / 5.0`, 11, true)
    addText(`Sentiment: ${metrics.sentiment.charAt(0).toUpperCase() + metrics.sentiment.slice(1)}`, 11, true)
    addText(`Selected Time Period: ${selectedPeriod}`, 10, false, [100, 100, 100])
    yPosition += sectionSpacing

    // Positive Highlights
    if (positiveHighlights.length > 0) {
      addText('TOP POSITIVE HIGHLIGHTS', 12, true, [30, 27, 75])
      yPosition += 5
      positiveHighlights.forEach((highlight, index) => {
        addText(`${index + 1}. ${highlight.text.substring(0, 150)}${highlight.text.length > 150 ? '...' : ''}`, 9)
        addText(`   Mentions: ${highlight.mentions}`, 8, false, [16, 185, 129])
        yPosition += 3
      })
      yPosition += sectionSpacing
    }

    // Negative Highlights
    if (negativeHighlights.length > 0) {
      addText('TOP NEGATIVE HIGHLIGHTS', 12, true, [30, 27, 75])
      yPosition += 5
      negativeHighlights.forEach((highlight, index) => {
        addText(`${index + 1}. ${highlight.text.substring(0, 150)}${highlight.text.length > 150 ? '...' : ''}`, 9)
        addText(`   Mentions: ${highlight.mentions}`, 8, false, [239, 68, 68])
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

    const fileName = `${data?.place_name || placeName || 'Review'}_Analytics_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
  }

  return (
    <div className="other-analytics-container">
      <div className="other-analytics-content">
        {/* Header with Export Button */}
        <div className="other-analytics-header">
          <div className="other-header-left">
            <h1 className="other-header-title">
              {data?.place_name || placeName || 'Review Analytics'}
            </h1>
          </div>
          <div className="other-header-right">
            <button className="export-button" onClick={handleExportPDF}>
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

        {/* Header Metrics */}
        <div className="metrics-header">
          <div className="metric-card-header">
            <span className="metric-label-header">Reviews</span>
            <span className="metric-value-header">{metrics.reviews}</span>
          </div>
          <div className="metric-card-header">
            <span className="metric-label-header">Avg Rating</span>
            <div className="rating-header">
              <span className="metric-value-header">{metrics.avgRating}</span>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {[1, 2, 3, 4, 5].map((star) => {
                  const rating = hasData && data.rating ? data.rating : 4.2
                  const isFilled = star <= Math.floor(rating)
                  return <Star key={star} className={`star-icon-header ${isFilled ? 'filled' : ''}`} style={isFilled ? { fill: '#fbbf24', color: '#fbbf24' } : {}} />
                })}
              </div>
            </div>
          </div>
          <div className="metric-card-header">
            <span className="metric-label-header">Sentiment</span>
            <div className="sentiment-header">
              <span className="metric-value-header sentiment-positive">{metrics.sentiment}</span>
              <TrendingUp className="trend-icon-header positive" />
            </div>
          </div>
          <div className="metric-card-header">
            <span className="metric-label-header">Change</span>
            <span className="metric-value-header">{metrics.change}</span>
          </div>
        </div>

        {/* Main Content - Two Columns */}
        <div className="highlights-container">
          {/* Left Column: Positive Highlights */}
          <div className="highlights-card positive-card">
            <div className="card-header-section">
              <ThumbsUp className="card-icon positive-icon" />
              <div className="card-title-section">
                <h2 className="card-title">Top Positive Highlights</h2>
                <p className="card-subtitle">What customers love the most</p>
              </div>
            </div>
            <div className="highlights-list">
              {positiveHighlights.length > 0 ? positiveHighlights.map((highlight, index) => {
                const percentage = (highlight.mentions / maxPositiveMentions) * 100
                return (
                  <div key={index} className="highlight-item positive-item">
                    <div className="highlight-content">
                      <p className="highlight-text">{highlight.text}</p>
                      <div className="highlight-bar-container">
                        <div 
                          className="highlight-bar positive-bar" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="highlight-meta">
                      <span className="highlight-mentions positive-badge">
                        {highlight.mentions} mentions
                      </span>
                      <TrendingUp className="trend-icon-small positive" />
                    </div>
                  </div>
                )
              }) : (
                <p style={{ color: '#a1a1aa', textAlign: 'center', padding: '2rem' }}>No positive highlights available</p>
              )}
            </div>
          </div>

          {/* Right Column: Negative Highlights */}
          <div className="highlights-card negative-card">
            <div className="card-header-section">
              <ThumbsDown className="card-icon negative-icon" />
              <div className="card-title-section">
                <h2 className="card-title">Top Negative Highlights</h2>
                <p className="card-subtitle">Common complaints and issues</p>
              </div>
            </div>
            <div className="highlights-list">
              {negativeHighlights.length > 0 ? negativeHighlights.map((highlight, index) => {
                const percentage = (highlight.mentions / maxNegativeMentions) * 100
                return (
                  <div key={index} className="highlight-item negative-item">
                    <div className="highlight-content">
                      <p className="highlight-text">{highlight.text}</p>
                      <div className="highlight-bar-container">
                        <div 
                          className="highlight-bar negative-bar" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="highlight-meta">
                      <span className="highlight-mentions negative-badge">
                        {highlight.mentions} mentions
                      </span>
                      <TrendingUp className="trend-icon-small negative" />
                    </div>
                  </div>
                )
              }) : (
                <p style={{ color: '#a1a1aa', textAlign: 'center', padding: '2rem' }}>No negative highlights available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
