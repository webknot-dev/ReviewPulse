'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, Bell, Settings, User, TrendingUp, TrendingDown, Star, Store, MapPin, Phone, Copy, Map, Rocket, Heart, Sparkles } from 'lucide-react'
import jsPDF from 'jspdf'
import './retail-shopping-analytics.css'

interface RetailShoppingAnalyticsProps {
  storeName?: string
  onNavigateBack?: () => void
}

export default function RetailShoppingAnalytics({ 
  storeName = 'Retail Insights', 
  onNavigateBack 
}: RetailShoppingAnalyticsProps) {
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
    totalReviews: { value: '12,456', trend: 'up', change: '+5.2% vs last month' },
    averageRating: { value: '4.2', trend: 'down', change: '-0.1% vs last month' }
  }

  const timePeriods = ['Weekly', 'Monthly', 'Yearly', 'All Time']

  const topProducts = [
    { name: 'T-Shirt', count: 1240 },
    { name: 'Sneakers', count: 980 },
    { name: 'Hoodie', count: 812 },
    { name: 'Jeans', count: 605 },
    { name: 'Jacket', count: 450 }
  ]

  const pricingSentiment = {
    value: 60,
    distribution: [
      { label: 'Value', percentage: 60, color: '#3b82f6' },
      { label: 'Fair', percentage: 24, color: '#8b5cf6' },
      { label: 'Expensive', percentage: 16, color: '#10b981' }
    ]
  }

  const returnExchange = {
    positive: 78,
    neutral: 15,
    negative: 7
  }

  const discounts = ['BOGO', '20% Off', 'Clearance Sale', 'Member Discount', 'Holiday Special']

  const storeInfo = {
    name: 'Flagship Store',
    address: '123 Market St, San Francisco, CA 94103',
    phone: '(415) 555-0199'
  }

  // Calculate max count for bar chart scaling
  const maxCount = Math.max(...topProducts.map(p => p.count))

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
    doc.text(storeName || 'Retail Shopping Analytics', margin, 25)
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

    // Top Products
    addText('TOP MENTIONED PRODUCTS', 12, true, [30, 27, 75])
    yPosition += 5
    topProducts.forEach((product, index) => {
      addText(`${index + 1}. ${product.name}: ${product.count.toLocaleString()} mentions`, 10)
    })
    yPosition += sectionSpacing

    // Pricing Sentiment
    addText('PRICING SENTIMENT', 12, true, [30, 27, 75])
    yPosition += 5
    addText(`Overall: ${pricingSentiment.value}% Value`, 11, true)
    pricingSentiment.distribution.forEach((item) => {
      addText(`${item.label}: ${item.percentage}%`, 10)
    })
    yPosition += sectionSpacing

    // Staff Behavior
    addText('STAFF BEHAVIOR', 12, true, [30, 27, 75])
    yPosition += 5
    addText('Helpful & Friendly', 10)
    addText('Customers frequently mention positive interactions with staff.', 9)
    yPosition += sectionSpacing

    // Checkout Speed
    addText('CHECKOUT SPEED', 12, true, [30, 27, 75])
    yPosition += 5
    addText('Generally Fast', 10)
    addText('Most reviews indicate a quick and efficient checkout process.', 9)
    yPosition += sectionSpacing

    // Store Cleanliness
    addText('STORE CLEANLINESS', 12, true, [30, 27, 75])
    yPosition += 5
    addText('4.8 / 5.0', 11, true)
    addText('Highly rated for cleanliness and organization.', 9)
    yPosition += sectionSpacing

    // Discounts
    addText('BEST DISCOUNTS / DEALS', 12, true, [30, 27, 75])
    yPosition += 5
    discounts.forEach((discount) => {
      addText(`- ${discount}`, 10)
    })
    yPosition += sectionSpacing

    // Return/Exchange
    addText('RETURN/EXCHANGE EXPERIENCE', 12, true, [30, 27, 75])
    yPosition += 5
    addText(`Positive: ${returnExchange.positive}%`, 10, false, [16, 185, 129])
    addText(`Neutral: ${returnExchange.neutral}%`, 10, false, [245, 158, 11])
    addText(`Negative: ${returnExchange.negative}%`, 10, false, [239, 68, 68])
    yPosition += sectionSpacing

    // Store Information
    addText('STORE INFORMATION', 12, true, [30, 27, 75])
    yPosition += 5
    addText(`Name: ${storeInfo.name}`, 10)
    addText(`Address: ${storeInfo.address}`, 10)
    addText(`Phone: ${storeInfo.phone}`, 10)

    // Footer
    const totalPages = doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' })
    }

    doc.save(`${storeName || 'Retail_Shopping'}_Analytics_${new Date().toISOString().split('T')[0]}.pdf`)
  }

  return (
    <div className="retail-analytics-container">
      <div className="retail-analytics-content">
        {/* Header */}
        <div className="retail-header">
          <div className="retail-header-left">
            <h1 className="retail-logo">{storeName}</h1>
          </div>
          <div className="retail-header-right">
            <button className="download-button" onClick={handleExportPDF}>
              <Download className="download-icon" />
              Download Report
            </button>
            <button className="header-icon-button">
              <Bell className="header-icon" />
            </button>
            <button className="header-icon-button">
              <Settings className="header-icon" />
            </button>
            <button className="header-icon-button">
              <User className="header-icon" />
            </button>
          </div>
        </div>

        {/* Main Title */}
        {/* <h2 className="dashboard-title">Retail Insights Dashboard</h2> */}

        {/* Time Period and Metrics Row */}
        <div className="top-row">
          <div className="time-period-card">
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
              <Star className="rating-star" />
            </div>
            <div className="metric-trend">
              <TrendingDown className="trend-icon down" />
              <span className="trend-text">{metricsData.averageRating.change}</span>
            </div>
          </div>
        </div>

        {/* Row 2: Products and Pricing */}
        <div className="second-row">
          {/* Top Mentioned Products */}
          <div className="products-card insight-card">
            <h3 className="card-title">Top Mentioned Products</h3>
            <div className="products-chart">
              {topProducts.map((product, index) => (
                <div key={index} className="product-item">
                  <div className="product-info">
                    <span className="product-name">{product.name}</span>
                    <span className="product-count">{product.count.toLocaleString()}</span>
                  </div>
                  <div className="product-bar">
                    <div 
                      className="product-bar-fill" 
                      style={{ width: `${(product.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Sentiment */}
          <div className="pricing-card insight-card">
            <h3 className="card-title">Pricing Sentiment</h3>
            <div className="pricing-chart-container">
              <div className="donut-chart">
                <div className="donut-center">
                  <span className="donut-value">{pricingSentiment.value}%</span>
                  <span className="donut-label">Value</span>
                </div>
              </div>
              <div className="pricing-legend">
                {pricingSentiment.distribution.map((item, index) => (
                  <div key={index} className="legend-item">
                    <div className="legend-dot" style={{ backgroundColor: item.color }}></div>
                    <span>{item.label} ({item.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Staff Behavior, Checkout Speed, Store Cleanliness */}
        <div className="behavior-row">
          <div className="behavior-card insight-card">
            <div className="behavior-icon">
              <Heart className="icon-large" />
            </div>
            <h3 className="card-title">Staff Behavior</h3>
            <p className="behavior-text">Helpful & Friendly</p>
            <p className="behavior-description">Customers frequently mention positive interactions with staff.</p>
          </div>

          <div className="behavior-card insight-card">
            <div className="behavior-icon">
              <Rocket className="icon-large" />
            </div>
            <h3 className="card-title">Checkout Speed</h3>
            <p className="behavior-text">Generally Fast</p>
            <p className="behavior-description">Most reviews indicate a quick and efficient checkout process.</p>
          </div>

          <div className="behavior-card insight-card">
            <div className="behavior-icon">
              <Sparkles className="icon-large" />
            </div>
            <h3 className="card-title">Store Cleanliness</h3>
            <p className="behavior-text">4.8 / 5.0</p>
            <p className="behavior-description">Highly rated for cleanliness and organization.</p>
          </div>
        </div>

        {/* Row 4: Discounts, Return, Store Info */}
        <div className="fourth-row">
          {/* Best Discounts / Deals */}
          <div className="discounts-card insight-card">
            <h3 className="card-title">Best Discounts / Deals</h3>
            <div className="discounts-list">
              {discounts.map((discount, index) => (
                <span key={index} className="discount-tag">
                  {discount}
                </span>
              ))}
            </div>
          </div>

          {/* Return/Exchange Experience */}
          <div className="return-card insight-card">
            <h3 className="card-title">Return/Exchange Experience</h3>
            <div className="return-stats">
              <div className="return-item positive">
                <span className="return-percentage">{returnExchange.positive}%</span>
                <span className="return-label">Positive</span>
              </div>
              <div className="return-item neutral">
                <span className="return-percentage">{returnExchange.neutral}%</span>
                <span className="return-label">Neutral</span>
              </div>
              <div className="return-item negative">
                <span className="return-percentage">{returnExchange.negative}%</span>
                <span className="return-label">Negative</span>
              </div>
            </div>
          </div>

          {/* Store Information */}
          <div className="store-info-card insight-card">
            <h3 className="card-title">Store Information</h3>
            <div className="store-details">
              <div className="store-detail-item">
                <Store className="detail-icon" />
                <span className="detail-text">{storeInfo.name}</span>
              </div>
              <div className="store-detail-item">
                <MapPin className="detail-icon" />
                <span className="detail-text">{storeInfo.address}</span>
              </div>
              <div className="store-detail-item">
                <Phone className="detail-icon" />
                <span className="detail-text">{storeInfo.phone}</span>
              </div>
            </div>
            <div className="store-actions">
              <button className="action-button">
                <Copy className="action-icon" />
                Copy
              </button>
              <button className="action-button">
                <Map className="action-icon" />
                Map
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
