'use client'

import LandingPage from './landingpage'
import AnalyticsPage from './analyticspage'
import RestaurantAnalytics from './restaurant-analytics'
import HotelsAccommodationAnalytics from './hotels-accommodation-analytics'
import { useState } from 'react'
import './page.css'

export default function MainPage() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'analytics' | 'restaurant' | 'hotel'>('landing')
  const [analyticsPlaceId, setAnalyticsPlaceId] = useState<string>('')

  const navigateToAnalytics = (placeId: string) => {
    setAnalyticsPlaceId(placeId)
    
    // Check if it's a restaurant/cafe to show restaurant analytics
    const restaurantKeywords = ['restaurant', 'cafe', 'coffee', 'bar', 'bistro', 'diner', 'eatery', 'food']
    const hotelKeywords = ['hotel', 'resort', 'inn', 'lodge', 'motel', 'accommodation', 'hostel', 'suite']
    
    const isRestaurant = restaurantKeywords.some(keyword => 
      placeId.toLowerCase().includes(keyword)
    )
    const isHotel = hotelKeywords.some(keyword => 
      placeId.toLowerCase().includes(keyword)
    )
    
    if (isRestaurant) {
      setCurrentPage('restaurant')
    } else if (isHotel) {
      setCurrentPage('hotel')
    } else {
      setCurrentPage('analytics')
    }
  }

  const navigateToLanding = () => {
    setCurrentPage('landing')
  }

  // If we're on restaurant analytics page
  if (currentPage === 'restaurant') {
    return (
      <RestaurantAnalytics 
        restaurantName={analyticsPlaceId || 'Flavorlytics'} 
        onNavigateBack={navigateToLanding}
      />
    )
  }

  // If we're on hotel analytics page
  if (currentPage === 'hotel') {
    return (
      <HotelsAccommodationAnalytics 
        hotelName={analyticsPlaceId || 'Grand Hotel'} 
        onNavigateBack={navigateToLanding}
      />
    )
  }

  // If we're on analytics page, render it with the placeId
  if (currentPage === 'analytics') {
    return (
      <AnalyticsPage 
        placeId={analyticsPlaceId || 'mock-place-id-123'} 
        onNavigateBack={navigateToLanding}
      />
    )
  }

  // Default: render landing page
  return (
    <LandingPage onNavigateToAnalytics={navigateToAnalytics} />
  )
}
