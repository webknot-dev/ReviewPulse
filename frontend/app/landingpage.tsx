'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TrendingUp, Search, Loader2, Brain, Clock, BarChart3 } from 'lucide-react'
import { reviewAPI } from '@/lib/api'
import { LoginButton } from '@/components/LoginButton'
import { useAuth } from '@/app/providers/AuthProvider'
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
  const { isAuthenticated } = useAuth()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Only proceed if a search result is selected
    if (selectedQuery.trim()) {
      setIsLoading(true)
      setError('')
      
      try {
        console.log('🔍 Starting API call for selected place:', selectedQuery);
        
        // Try native fetch first to test connectivity
        console.log('🧪 Trying native fetch first...');
        const testResponse = await reviewAPI.testFetch(selectedQuery);
        console.log('🧪 Native fetch successful:', testResponse);
        
        // If fetch works, use it instead of axios
        const response = testResponse;
        
        console.log('📋 API Response:', response);
        
        if (response && response.success) {
          console.log('✅ Success! Navigating to analytics...');
          // Navigate to analytics with the selected place
          if (onNavigateToAnalytics) {
            onNavigateToAnalytics(selectedQuery)
          } else {
            router.push(`/dashboard/${encodeURIComponent(selectedQuery)}`)
          }
        } else {
          console.log('❌ API returned success: false');
          setError('Failed to fetch reviews. Please try again.')
        }
      } catch (err: any) {
        console.error('💥 API Error caught:', err)
        
        // Provide more specific error messages
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
          setError('Network error: Cannot connect to backend server. Please ensure the backend is running on localhost:3001')
        } else if (err.response) {
          // Server responded with error status
          const status = err.response.status;
          const message = err.response.data?.message || err.response.statusText;
          if (status === 401) {
            setError('Authentication required. Please sign in with Google to analyze reviews.')
          } else {
            setError(`Server error (${status}): ${message}`)
          }
        } else if (err.request) {
          // Request was made but no response received
          console.error('📡 No response received:', err.request);
          setError('No response from server. Please check if the backend is running on localhost:3001')
        } else if (err.message.includes('CORS')) {
          setError('CORS error: Please check if the backend allows requests from localhost:3000')
        } else if (err.message && err.message.includes('401')) {
          setError('Authentication required. Please sign in with Google to analyze reviews.')
        } else {
          // Something else happened
          setError(`Connection error: ${err.message}. Please check your network connection.`)
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
      {/* Header with Login Button */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        right: 0, 
        padding: '1rem', 
        zIndex: 1000,
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderRadius: '0 0 0 8px'
      }}>
        <LoginButton />
      </div>
      
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
                  disabled={isLoading || !selectedQuery.trim()} 
                  className="landing-submit-button"
                  title={!selectedQuery.trim() ? 'Please select a search result first' : 'Analyze selected place'}
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
                {error.includes('Authentication required') && !isAuthenticated && (
                  <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    Please sign in using the button in the top right corner.
                  </p>
                )}
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  )
}

