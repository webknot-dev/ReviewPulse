'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Download, TrendingUp, TrendingDown, Users, Clock, Star, CheckCircle, AlertTriangle, MapPin, Phone, Utensils, X } from 'lucide-react'
import jsPDF from 'jspdf'
import './restaurant-analytics.css'

interface RestaurantAnalyticsProps {
  restaurantName?: string
  onNavigateBack?: () => void
  apiData?: any // Allow any structure to handle various API response formats
}

export default function RestaurantAnalytics({ 
  restaurantName = 'Flavorlytics', 
  onNavigateBack,
  apiData
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

  // Extract restaurant name from API if available
  // Extract data from API response - check placeData first (actual API structure)
  const placeData = apiData?.placeData || apiData?.data?.placeData || apiData
  const displayName = placeData?.place_name || restaurantName

  // Debug: Log API data
  console.log('🍽️ Restaurant Analytics - API Data received:', apiData)
  console.log('🍽️ PlaceData extracted:', placeData)
  
  // Format number with commas
  const formatNumber = (num: number | undefined | null): string => {
    if (num === undefined || num === null || isNaN(Number(num))) return '0'
    return Number(num).toLocaleString()
  }
  
  // Extract rating from placeData
  const rating = placeData?.rating || apiData?.rating || apiData?.data?.rating || apiData?.averageRating || apiData?.avg_rating
  
  // Extract total_reviews from placeData
  const totalReviews = placeData?.total_reviews || apiData?.total_reviews || apiData?.data?.total_reviews || apiData?.totalReviews || apiData?.reviews?.length || 0
  
  // Extract pos_reviews from placeData - handle array of objects with 'text' property
  const posReviewsRaw = placeData?.pos_reviews || apiData?.pos_reviews || apiData?.data?.pos_reviews || apiData?.positive_reviews || apiData?.positiveHighlights || []
  const posReviews = Array.isArray(posReviewsRaw) 
    ? posReviewsRaw.map((item: any) => typeof item === 'string' ? item : item?.text || item)
    : []
  
  // Extract neg_reviews from placeData - handle array of objects with 'text' property
  const negReviewsRaw = placeData?.neg_reviews || apiData?.neg_reviews || apiData?.data?.neg_reviews || apiData?.negative_reviews || apiData?.negativeHighlights || []
  const negReviews = Array.isArray(negReviewsRaw)
    ? negReviewsRaw.map((item: any) => typeof item === 'string' ? item : item?.text || item)
    : []

  console.log('📊 Extracted values:', {
    rating,
    totalReviews,
    posReviewsCount: posReviews.length,
    negReviewsCount: negReviews.length,
    posReviews,
    negReviews
  })

  // Extract attributes_analyzed data
  const attributesAnalyzed = placeData?.attributes_analyzed || {}
  
  // Extract overall_sentiment for price sentiment
  const overallSentiment = placeData?.overall_sentiment || 'neutral'
  const priceSentimentValue = overallSentiment.charAt(0).toUpperCase() + overallSentiment.slice(1)

  // Use API data or fallback to defaults
  const metricsData = {
    reviews: { 
      value: formatNumber(totalReviews), 
      trend: 'up', 
      change: 'vs. last period' 
    },
    averageRating: { 
      value: rating ? Number(rating).toFixed(1) : '0.0', 
      trend: 'up', 
      change: 'vs. last period' 
    },
    avgWaitingTime: { value: '25 min', trend: 'down', change: 'vs. last period' },
    priceSentiment: { value: priceSentimentValue, trend: overallSentiment === 'positive' ? 'up' : overallSentiment === 'negative' ? 'down' : 'neutral', change: 'vs. last period' }
  }

  // Extract possible_filters for time period buttons
  const possibleFilters = placeData?.possible_filters || []
  
  console.log('🔍 Possible Filters from API:', possibleFilters)
  
  // Map filter values from API to display names
  const filterToDisplayMap: Record<string, string> = {
    'weekly': 'Weekly',
    'monthly': 'Monthly',
    'yearly': 'Yearly',
    'all': 'All Time',
    'all time': 'All Time'
  }
  
  // Map display names to filter values
  const displayToFilterMap: Record<string, string> = {
    'Weekly': 'weekly',
    'Monthly': 'monthly',
    'Yearly': 'yearly',
    'All Time': 'all'
  }
  
  // Get available time periods based on possible_filters
  const getAvailableTimePeriods = (): string[] => {
    if (possibleFilters.length === 0) {
      // If no filters, show all periods
      return ['Weekly', 'Monthly', 'Yearly', 'All Time']
    }
    
    // Map filter values to display names and filter out undefined
    const availablePeriods = possibleFilters
      .map((filter: string) => {
        const lowerFilter = filter.toLowerCase()
        return filterToDisplayMap[lowerFilter] || null
      })
      .filter((period: string | null): period is string => period !== null)
    
    // If 'all' is in filters, show all periods
    if (possibleFilters.some((f: string) => f.toLowerCase() === 'all')) {
      return ['Weekly', 'Monthly', 'Yearly', 'All Time']
    }
    
    return availablePeriods.length > 0 ? availablePeriods : ['All Time']
  }
  
  const availableTimePeriods = getAvailableTimePeriods()
  console.log('📅 Available Time Periods:', availableTimePeriods)
  
  // Check if a period is enabled (available in possible_filters)
  const isPeriodEnabled = (period: string): boolean => {
    if (possibleFilters.length === 0) return true
    
    const filterKey = displayToFilterMap[period]?.toLowerCase()
    const isEnabled = possibleFilters.some((f: string) => {
      const lowerFilter = f.toLowerCase()
      return lowerFilter === filterKey || lowerFilter === 'all'
    })
    console.log(`🔘 Period "${period}" enabled:`, isEnabled)
    return isEnabled
  }
  
  // Extract most mentioned staff
  const mostMentionedStaffText = attributesAnalyzed['most mentioned staff'] || attributesAnalyzed['most_mentioned_staff'] || ''
  const mostMentionedStaff = {
    name: mostMentionedStaffText || 'Staff in general',
    avatar: '👨‍🍳',
    mentions: 0,
    type: 'positive',
    description: mostMentionedStaffText
  }

  // Extract top dishes from attributes_analyzed
  const topDishesText = attributesAnalyzed['top dishes'] || attributesAnalyzed['top_dishes'] || ''
  // Parse top dishes text to extract dish names
  const parseTopDishes = (text: string) => {
    if (!text) return []
    
    // Extract dish names - look for capitalized phrases followed by common dish terms
    const dishPatterns = [
      /([A-Z][a-zA-Z\s]+(?:Biryani|biriyani|biryani))/gi,
      /([A-Z][a-zA-Z\s]+(?:Chicken|Prawns|Pasta|Burger|Roll|Manchurian|Lollipop))/gi,
      /(?:Meghana\s+Special\s+Biryani|Lemon\s+Chicken|Chilli\s+Prawns|Guntur\s+Chicken)/gi
    ]
    
    const dishes: string[] = []
    dishPatterns.forEach(pattern => {
      const matches = text.match(pattern) || []
      matches.forEach(match => {
        const cleanDish = match.trim()
        if (cleanDish && !dishes.includes(cleanDish)) {
          dishes.push(cleanDish)
        }
      })
    })
    
    // If no matches found, try to extract from common patterns
    if (dishes.length === 0) {
      // Look for "X is the" or "X is described as" patterns
      const isPattern = /([A-Z][a-zA-Z\s]+(?:Biryani|Chicken|Prawns|Pasta|Burger|Roll))\s+is/gi
      const isMatches = text.match(isPattern) || []
      isMatches.forEach(match => {
        const dish = match.replace(/\s+is.*/i, '').trim()
        if (dish && !dishes.includes(dish)) {
          dishes.push(dish)
        }
      })
    }
    
    return dishes.slice(0, 3).map((dish, index) => ({
      rank: index + 1,
      name: dish,
      mentions: 0
    }))
  }
  const topDishes = parseTopDishes(topDishesText).length > 0 
    ? parseTopDishes(topDishesText)
    : [
        { rank: 1, name: 'Truffle Pasta', mentions: 87 },
        { rank: 2, name: 'Spicy Tuna Roll', mentions: 62 },
        { rank: 3, name: 'Classic Burger', mentions: 45 }
      ]

  // Extract ambience sentiment
  const ambienceSentimentText = attributesAnalyzed['ambience sentiment'] || attributesAnalyzed['ambience_sentiment'] || ''
  
  // Parse ambience sentiment to extract percentages
  const parseAmbienceSentiment = (text: string) => {
    if (!text) return { excellent: 70, medium: 20, poor: 10 }
    
    // Try to extract sentiment percentages from text
    // Look for patterns indicating positive/negative sentiment
    const lowerText = text.toLowerCase()
    let excellent = 0
    let medium = 0
    let poor = 0
    
    // Check for positive indicators
    if (lowerText.includes('positive') || lowerText.includes('good') || lowerText.includes('excellent')) {
      excellent = 70
      medium = 20
      poor = 10
    } else if (lowerText.includes('negative') || lowerText.includes('poor') || lowerText.includes('bad')) {
      excellent = 10
      medium = 20
      poor = 70
    } else if (lowerText.includes('neutral') || lowerText.includes('average')) {
      excellent = 30
      medium = 40
      poor = 30
    } else {
      // Default
      excellent = 50
      medium = 30
      poor = 20
    }
    
    return { excellent, medium, poor }
  }
  
  const ambianceData = parseAmbienceSentiment(ambienceSentimentText)

  const restaurantInfo = {
    name: 'The Gourmet Grove',
    address: '123 Culinary Lane, Foodie City, 90210',
    contact: '(555) 123-4567'
  }

  // Use API data for service quotes or fallback to defaults
  const serviceQuotes = (() => {
    const quotes: Array<{ text: string; type: 'positive' | 'warning' | 'negative' }> = []
    
    // Add positive reviews from API (first two)
    if (posReviews.length > 0) {
      posReviews.slice(0, 2).forEach((review: string) => {
        // Truncate long reviews for display
        const displayText = review.length > 200 ? review.substring(0, 200) + '...' : review
        quotes.push({ text: displayText, type: 'positive' })
      })
    } else {
      // Fallback defaults
      quotes.push(
        { text: "Staff is consistently friendly and welcoming.", type: 'positive' },
        { text: "Very attentive to details and special requests.", type: 'positive' }
      )
    }
    
    // Add negative reviews from API (first one)
    if (negReviews.length > 0) {
      negReviews.slice(0, 1).forEach((review: string) => {
        // Truncate long reviews for display
        const displayText = review.length > 200 ? review.substring(0, 200) + '...' : review
        quotes.push({ text: displayText, type: 'negative' })
      })
    } else {
      // Fallback default
      quotes.push({ text: "Service can be slow when the restaurant is busy.", type: 'warning' })
    }
    
    return quotes
  })()

  // PDF Export Function
  const handleExportPDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let yPosition = 20
    const margin = 20
    const lineHeight = 7
    const sectionSpacing = 10

    // Helper function to add a new page if needed
    const checkPageBreak = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        doc.addPage()
        yPosition = 20
      }
    }

    // Helper function to add text with word wrap
    const addText = (text: string, fontSize: number = 10, isBold: boolean = false, color: number[] = [0, 0, 0]) => {
      checkPageBreak(lineHeight * 2)
      doc.setFontSize(fontSize)
      doc.setTextColor(color[0], color[1], color[2])
      if (isBold) {
        doc.setFont('helvetica', 'bold')
      } else {
        doc.setFont('helvetica', 'normal')
      }
      
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
    doc.text(displayName || 'Restaurant Analytics', margin, 25)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Analytics Report', margin, 35)
    yPosition = 50

    // Date
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    addText(`Generated on: ${currentDate}`, 9, false, [100, 100, 100])
    yPosition += sectionSpacing

    // Key Metrics Section
    addText('KEY METRICS', 14, true, [30, 27, 75])
    yPosition += 5
    
    addText(`Total Reviews: ${metricsData.reviews.value}`, 11, true)
    addText(`Average Rating: ${metricsData.averageRating.value} / 5.0`, 11, true)
    addText(`Overall Sentiment: ${priceSentimentValue}`, 11, true)
    yPosition += sectionSpacing

    // Time Period
    addText(`Selected Time Period: ${selectedPeriod}`, 10, false, [100, 100, 100])
    addText(`Available Filters: ${possibleFilters.join(', ') || 'All'}`, 9, false, [100, 100, 100])
    yPosition += sectionSpacing

    // Most Mentioned Staff
    if (mostMentionedStaff.description) {
      addText('MOST MENTIONED STAFF', 12, true, [30, 27, 75])
      yPosition += 5
      addText(mostMentionedStaff.description, 10)
      yPosition += sectionSpacing
    }

    // Service Quality Summary
    addText('SERVICE QUALITY SUMMARY', 12, true, [30, 27, 75])
    yPosition += 5
    
    if (posReviews.length > 0 || negReviews.length > 0) {
      addText(`Overall, customers have provided ${posReviews.length} positive feedback${posReviews.length !== 1 ? 's' : ''} and ${negReviews.length} area${negReviews.length !== 1 ? 's' : ''} for improvement.`, 10)
    } else {
      addText('Overall, customers praise the staff for being attentive and friendly, though some reviews mention occasional slowness during peak hours and rare mix-ups with orders.', 10)
    }
    yPosition += 5

    // Positive Reviews
    if (posReviews.length > 0) {
      addText('Positive Feedback:', 10, true, [16, 185, 129])
      posReviews.slice(0, 2).forEach((review: string, index: number) => {
        addText(`${index + 1}. ${review.substring(0, 200)}${review.length > 200 ? '...' : ''}`, 9, false, [16, 185, 129])
      })
      yPosition += 5
    }

    // Negative Reviews
    if (negReviews.length > 0) {
      addText('Areas for Improvement:', 10, true, [239, 68, 68])
      negReviews.slice(0, 1).forEach((review: string, index: number) => {
        addText(`${index + 1}. ${review.substring(0, 200)}${review.length > 200 ? '...' : ''}`, 9, false, [239, 68, 68])
      })
    }
    yPosition += sectionSpacing

    // Top Dishes
    if (topDishes.length > 0) {
      addText('TOP DISHES', 12, true, [30, 27, 75])
      yPosition += 5
      topDishes.forEach((dish) => {
        addText(`${dish.rank}. ${dish.name}`, 10)
      })
      yPosition += sectionSpacing
    }

    // Ambiance Sentiment
    if (ambienceSentimentText) {
      addText('AMBIANCE SENTIMENT', 12, true, [30, 27, 75])
      yPosition += 5
      addText(ambienceSentimentText, 10)
      yPosition += sectionSpacing
    }

    // Top Dishes Details (from attributes)
    if (topDishesText) {
      addText('TOP DISHES DETAILS', 12, true, [30, 27, 75])
      yPosition += 5
      addText(topDishesText, 10)
      yPosition += sectionSpacing
    }

    // Highlights
    const highlights = placeData?.highlights || []
    if (highlights.length > 0) {
      addText('KEY HIGHLIGHTS', 12, true, [30, 27, 75])
      yPosition += 5
      highlights.forEach((highlight: string, index: number) => {
        addText(`${index + 1}. ${highlight}`, 10)
        yPosition += 3
      })
      yPosition += sectionSpacing
    }

    // Attributes Analyzed
    if (Object.keys(attributesAnalyzed).length > 0) {
      addText('DETAILED ANALYSIS', 12, true, [30, 27, 75])
      yPosition += 5
      
      Object.entries(attributesAnalyzed).forEach(([key, value]) => {
        if (value && typeof value === 'string') {
          addText(`${key.toUpperCase()}:`, 10, true)
          addText(value as string, 9)
          yPosition += 3
        }
      })
    }

    // Footer
    const totalPages = doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.text(
        `Page ${i} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      )
    }

    // Save the PDF
    const fileName = `${displayName || 'Restaurant'}_Analytics_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
  }

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
              <h1 className="restaurant-title">{displayName}</h1>
              <p className="restaurant-subtitle">Summary of customer feedback and key metrics.</p>
            </div>
          </div>
          <div className="restaurant-header-right">
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
            {['Weekly', 'Monthly', 'Yearly', 'All Time'].map((period) => {
              const isEnabled = isPeriodEnabled(period)
              return (
                <button
                  key={period}
                  onClick={() => isEnabled && setSelectedPeriod(period)}
                  disabled={!isEnabled}
                  className={`time-period-button ${selectedPeriod === period ? 'active' : ''} ${!isEnabled ? 'disabled' : ''}`}
                  title={!isEnabled ? 'This time period is not available in the data' : ''}
                >
                  {period}
                </button>
              )
            })}
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
            {mostMentionedStaff.description ? (
              <div className="staff-description">
                <p className="staff-text">{mostMentionedStaff.description}</p>
              </div>
            ) : (
              <div className="staff-profile">
                <div className="staff-avatar">{mostMentionedStaff.avatar}</div>
                <div className="staff-info">
                  <span className="staff-name">{mostMentionedStaff.name}</span>
                  <span className="staff-mentions">{mostMentionedStaff.mentions} positive mentions</span>
                </div>
              </div>
            )}
          </div>

          {/* Service Quality Summary */}
          <div className="content-card service-card">
            <h3 className="card-title">Service Quality Summary</h3>
            <p className="service-summary">
              {posReviews.length > 0 || negReviews.length > 0
                ? `Overall, customers have provided ${posReviews.length} positive feedback${posReviews.length !== 1 ? 's' : ''} and ${negReviews.length} area${negReviews.length !== 1 ? 's' : ''} for improvement.`
                : 'Overall, customers praise the staff for being attentive and friendly, though some reviews mention occasional slowness during peak hours and rare mix-ups with orders.'
              }
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
            <div className="ambiance-text-container">
              <p className="ambiance-text">
                {ambienceSentimentText || 'No ambiance sentiment data available.'}
              </p>
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
                    {/* <span className="dish-mentions">{dish.mentions} mentions</span> */}
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
