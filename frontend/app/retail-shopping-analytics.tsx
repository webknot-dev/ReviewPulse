'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Download, Bell, Settings, User, TrendingUp, TrendingDown, Star, Store, MapPin, Phone, Copy, Map, Rocket, Heart, Sparkles, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react'
import { reviewAPI, PlaceDataResponse } from '@/lib/api'
import './retail-shopping-analytics.css'

interface RetailShoppingAnalyticsProps {
  storeName?: string
  onNavigateBack?: () => void
}

export default function RetailShoppingAnalytics({ 
  storeName: storeNameProp,
  onNavigateBack 
}: RetailShoppingAnalyticsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const placeName = storeNameProp || searchParams.get('place') || undefined
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
  const displayName = data?.place_name || placeName || 'Retail Insights'

  const handleBackNavigation = () => {
    if (onNavigateBack) {
      onNavigateBack()
    } else {
      router.push('/')
    }
  }

  if (loading) {
    return (
      <div className="retail-analytics-container">
        <div className="retail-analytics-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
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
      <div className="retail-analytics-container">
        <div className="retail-analytics-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#ef4444', fontSize: '1.125rem', marginBottom: '1rem' }}>Error: {error}</p>
            <button onClick={() => placeName && fetchData(placeName)} style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: 'white', border: 'none', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Retry</button>
          </div>
        </div>
      </div>
    )
  }

  const metricsData = {
    totalReviews: { value: hasData && data.total_reviews ? data.total_reviews.toLocaleString() : '12,456', trend: 'up' as const, change: '+5.2% vs last month' },
    averageRating: { value: hasData && data.rating ? data.rating.toFixed(1) : '4.2', trend: 'down' as const, change: '-0.1% vs last month' }
  }

  const timePeriods = hasData && data.possible_filters ? data.possible_filters : ['Weekly', 'Monthly', 'Yearly', 'All Time']
  const maxPositiveMentions = data?.pos_reviews && data.pos_reviews.length > 0 ? Math.max(...data.pos_reviews.map(r => r.mentions)) : 1
  const maxNegativeMentions = data?.neg_reviews && data.neg_reviews.length > 0 ? Math.max(...data.neg_reviews.map(r => r.mentions)) : 1

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

  return (
    <div className="retail-analytics-container">
      <div className="retail-analytics-content">
        {/* Header */}
        <div className="retail-header">
          <div className="retail-header-left">
            <h1 className="retail-logo">{displayName}</h1>
          </div>
          <div className="retail-header-right">
            <button className="download-button">
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
        <h2 className="dashboard-title">Retail Insights Dashboard</h2>

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
            <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map((star) => {
                const rating = hasData && data.rating ? data.rating : 4.2
                const isFilled = star <= Math.floor(rating)
                return <Star key={star} style={isFilled ? { fill: '#fbbf24', color: '#fbbf24', width: '1.25rem', height: '1.25rem' } : { width: '1.25rem', height: '1.25rem' }} />
              })}
            </div>
            <div className="metric-trend">
              <TrendingDown className="trend-icon down" />
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

        {/* Row 2: Products and Pricing */}
        <div className="second-row">
          {/* Top Mentioned Products */}
          {(isTemplateMode || (hasData && data.highlights.some(h => h.toLowerCase().includes('product')))) && (
            <div className="products-card insight-card">
              <h3 className="card-title">Top Mentioned Products</h3>
              {isTemplateMode ? (
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
              ) : (
                <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>Mentioned in reviews</p>
              )}
            </div>
          )}

          {/* Pricing Sentiment */}
          {(isTemplateMode || (hasData && hasAttribute('pricing fairness'))) && (
            <div className="pricing-card insight-card">
              <h3 className="card-title">Pricing Sentiment</h3>
              {isTemplateMode ? (
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
              ) : (
                <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>{data.attributes_analyzed['pricing fairness']}</p>
              )}
            </div>
          )}
        </div>

          {/* Staff Behavior, Checkout Speed, Store Cleanliness */}
        <div className="behavior-row">
          {(isTemplateMode || (hasData && hasAttribute('staff friendliness'))) && (
            <div className="behavior-card insight-card">
              <div className="behavior-icon">
                <Heart className="icon-large" />
              </div>
              <h3 className="card-title">Staff Behavior</h3>
              {isTemplateMode ? (
                <>
                  <p className="behavior-text">Helpful & Friendly</p>
                  <p className="behavior-description">Customers frequently mention positive interactions with staff.</p>
                </>
              ) : (
                <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>{data.attributes_analyzed['staff friendliness']}</p>
              )}
            </div>
          )}

          {(isTemplateMode || (hasData && data.highlights.some(h => h.toLowerCase().includes('checkout') || h.toLowerCase().includes('speed')))) && (
            <div className="behavior-card insight-card">
              <div className="behavior-icon">
                <Rocket className="icon-large" />
              </div>
              <h3 className="card-title">Checkout Speed</h3>
              {isTemplateMode ? (
                <>
                  <p className="behavior-text">Generally Fast</p>
                  <p className="behavior-description">Most reviews indicate a quick and efficient checkout process.</p>
                </>
              ) : (
                <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>Mentioned in reviews</p>
              )}
            </div>
          )}

          {(isTemplateMode || (hasData && hasAttribute('hygiene'))) && (
            <div className="behavior-card insight-card">
              <div className="behavior-icon">
                <Sparkles className="icon-large" />
              </div>
              <h3 className="card-title">Store Cleanliness</h3>
              {isTemplateMode ? (
                <>
                  <p className="behavior-text">4.8 / 5.0</p>
                  <p className="behavior-description">Highly rated for cleanliness and organization.</p>
                </>
              ) : (
                <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>{data.attributes_analyzed['hygiene']}</p>
              )}
            </div>
          )}
        </div>

        {/* Row 4: Discounts, Return, Store Info */}
        <div className="fourth-row">
          {/* Best Discounts / Deals */}
          {(isTemplateMode || (hasData && data.highlights.some(h => h.toLowerCase().includes('discount') || h.toLowerCase().includes('deal')))) && (
            <div className="discounts-card insight-card">
              <h3 className="card-title">Best Discounts / Deals</h3>
              {isTemplateMode ? (
                <div className="discounts-list">
                  {discounts.map((discount, index) => (
                    <span key={index} className="discount-tag">
                      {discount}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>Mentioned in reviews</p>
              )}
            </div>
          )}

          {/* Return/Exchange Experience */}
          {(isTemplateMode || (hasData && data.highlights.some(h => h.toLowerCase().includes('return') || h.toLowerCase().includes('exchange')))) && (
            <div className="return-card insight-card">
              <h3 className="card-title">Return/Exchange Experience</h3>
              {isTemplateMode ? (
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
              ) : (
                <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>Mentioned in reviews</p>
              )}
            </div>
          )}

          {/* Store Information */}
          {isTemplateMode && (
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
          )}
        </div>
      </div>
    </div>
  )
}
