'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TrendingUp, Search, Loader2, Brain, Clock, BarChart3 } from 'lucide-react'
import { reviewAPI } from '@/lib/api'
import './landingpage.css'

const highlightCards = [
  {
    title: 'Smart Summaries',
    description: 'Get top positive and negative highlights instantly',
    icon: Brain,
    gradient: 'from-purple-500 to-pink-500',
    hoverColor: 'hover:shadow-purple-200',
  },
  {
    title: 'Time-Based Analysis',
    description: 'Compare reviews from last week, month, year, or all time',
    icon: Clock,
    gradient: 'from-blue-500 to-cyan-500',
    hoverColor: 'hover:shadow-blue-200',
  },
  {
    title: 'Sentiment Trends',
    description: 'Track how opinions change over time with visual charts',
    icon: BarChart3,
    gradient: 'from-green-500 to-emerald-500',
    hoverColor: 'hover:shadow-green-200',
  },
]


interface LandingPageProps {
  onNavigateToAnalytics?: (placeId: string) => void
}

export default function LandingPage(props: LandingPageProps = {}) {
  const { onNavigateToAnalytics } = props
  const [query, setQuery] = useState('')
  const [selectedQuery, setSelectedQuery] = useState('')
  const [submittedQueries, setSubmittedQueries] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Use query if available, otherwise use selectedQuery
    const placeToSearch = query.trim() || selectedQuery.trim()
    
    if (placeToSearch) {
      setIsLoading(true)
      setError('')
      
      try {
        console.log('🔍 Starting API call for place:', placeToSearch);
        
        // Try native fetch first to test connectivity
        console.log('🧪 Trying native fetch first...');
        const testResponse = await reviewAPI.testFetch(placeToSearch);
        console.log('🧪 Native fetch successful:', testResponse);
        
        // If fetch works, use it instead of axios
        const response = testResponse;
        
        console.log('📋 API Response:', response);
        
        if (response && response.success) {
          console.log('✅ Success! Navigating to analytics...');
          
          // Get category from response and redirect accordingly
          const category = response.placeData?.category?.toLowerCase() || 'other'
          // Use the original search query, not the API's place_name
          const placeName = placeToSearch
          
          // Map category to route
          const categoryRoutes: Record<string, string> = {
            'restaurant': '/restaurant',
            'hotel': '/hotel',
            'education': '/education',
            'retail': '/retail',
            'health': '/health',
            'financial': '/financial',
            'venue': '/venue',
            'service-center': '/service-center',
            'other': '/other'
          }
          
          const route = categoryRoutes[category] || '/other'
          const url = `${route}?place=${encodeURIComponent(placeName)}`
          
          console.log(`📍 Redirecting to: ${url} (category: ${category})`)
          router.push(url)
        } else {
          console.log('❌ API returned success: false');
          setError('Failed to fetch reviews. Please try again.')
        }
      } catch (err: any) {
        console.error('💥 API Error caught:', err)
        
        // Provide more specific error messages
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
          setError('Network error: Cannot connect to backend server. Please ensure the backend is running on localhost:3001')
        } else if (err.message?.includes('timeout') || err.message?.includes('Timeout') || err.code === 'ECONNABORTED') {
          setError('Request timed out. The server is taking too long to respond. Please try again or check if the backend is processing the request.')
        } else if (err.response) {
          // Server responded with error status
          const status = err.response.status;
          const message = err.response.data?.message || err.response.statusText;
          setError(`Server error (${status}): ${message}`)
        } else if (err.request) {
          // Request was made but no response received
          console.error('📡 No response received:', err.request);
          setError('No response from server. Please check if the backend is running on localhost:3001')
        } else if (err.message?.includes('CORS')) {
          setError('CORS error: Please check if the backend allows requests from localhost:3000')
        } else {
          // Something else happened
          setError(`Connection error: ${err.message || 'Unknown error'}. Please check your network connection.`)
        }
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setQuery(value)
    // Clear selected query when user starts typing (forces them to select again)
    setSelectedQuery('')
    // Clear any previous errors
    setError('')
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && query.trim()) {
      event.preventDefault()
      const trimmedQuery = query.trim()
      // Add to search results but don't auto-select (user must click to select)
      if (!submittedQueries.includes(trimmedQuery)) {
        setSubmittedQueries(prev => [...prev, trimmedQuery])
      }
      // Clear the input field after adding to results
      setQuery('')
    }
  }

  const handleSelectQuery = (value: string) => {
    setSelectedQuery(value)
    setQuery(value)
  }

  return (
    <div className="landing-container">
      <div className="landing-content">
        <div className="landing-header">
          <div className="landing-badge">
            <TrendingUp className="landing-badge-icon" />
            AI-Powered Review Analysis
          </div>
          <h3 className="landing-title">
            Understand Thousands of Reviews in Seconds
          </h3>
          <p className="landing-description">
            Don&apos;t waste hours reading reviews. Get instant AI-powered insights on what people love,
            what they complain about, and how sentiment has changed over time.
          </p>
        </div>

        <div className="landing-cards-grid">
          {highlightCards.map((card, index) => {
            const IconComponent = card.icon
            return (
              <div key={card.title} className={`landing-card ${card.hoverColor}`} data-index={index}>
                <div className="landing-card-icon-wrapper">
                  <div className={`landing-card-icon bg-gradient-to-br ${card.gradient}`}>
                    <IconComponent className="landing-card-icon-svg" />
                  </div>
                </div>
                <div className="landing-card-content">
                  <h3 className="landing-card-title">{card.title}</h3>
                  <p className="landing-card-description">{card.description}</p>
                </div>
                <div className="landing-card-hover-overlay"></div>
              </div>
            )
          })}
        </div>

        <div className="landing-form-container">
          <form className="landing-form" onSubmit={handleSubmit}>
            <div>
              <div className="landing-form-input-container">
                <div className="landing-input-wrapper">
                  <Search className="landing-input-icon" />
                  <input
                    value={query}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter place name (hotel, school, restaurant, etc.)"
                    disabled={isLoading}
                    className="landing-input"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading || !query.trim()} 
                  className="landing-submit-button"
                  title={!query.trim() ? 'Please enter a place name' : 'Analyze place'}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="landing-input-icon landing-spinner" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Search className="landing-input-icon" />
                      <span>Analyze</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {submittedQueries.length > 0 && (
              <div>
                <p className="landing-form-label">Search Results:</p>
                <div className="landing-examples-container">
                  {submittedQueries.map((searchQuery, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelectQuery(searchQuery)}
                      disabled={isLoading}
                      className={`landing-example-button ${selectedQuery === searchQuery ? 'active' : ''}`}
                    >
                      {searchQuery}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="landing-error">
                <p className="landing-error-text">{error}</p>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  )
}

