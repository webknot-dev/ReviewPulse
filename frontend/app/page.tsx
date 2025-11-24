'use client'

import LandingPage from './landingpage'
import AnalyticsPage from './analyticspage'
import RestaurantAnalytics from './restaurant-analytics'
import HotelsAccommodationAnalytics from './hotels-accommodation-analytics'
import EducationalInstitutionAnalytics from './educational-institution-analytics'
import RetailShoppingAnalytics from './retail-shopping-analytics'
import HealthMedicalAnalytics from './health-medical-analytics'
import FinancialServicesAnalytics from './financial-services-analytics'
import VenueAnalytics from './venue-analytics'
import ServiceCenterAnalytics from './service-center-analytics'
import OtherAnalytics from './otheranalytics'
import { useState } from 'react'
import './page.css'

export default function MainPage() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'analytics' | 'restaurant' | 'hotel' | 'education' | 'retail' | 'health' | 'financial' | 'venue' | 'service-center'>('landing')
  const [analyticsPlaceId, setAnalyticsPlaceId] = useState<string>('')
  const [apiResponseData, setApiResponseData] = useState<any>(null)

  const navigateToAnalytics = (placeId: string, category?: string, apiData?: any) => {
    setAnalyticsPlaceId(placeId)
    if (apiData) {
      setApiResponseData(apiData)
    }
    
    // If category is provided from API response, use it directly
    if (category) {
      const categoryMap: Record<string, 'restaurant' | 'hotel' | 'education' | 'retail' | 'health' | 'financial' | 'venue' | 'service-center' | 'analytics'> = {
        'restaurant': 'restaurant',
        'hotel': 'hotel',
        'education': 'education',
        'retail': 'retail',
        'health': 'health',
        'financial': 'financial',
        'venue': 'venue',
        'service-center': 'service-center',
        'service_center': 'service-center',
      }
      
      const mappedCategory = categoryMap[category.toLowerCase()]
      if (mappedCategory) {
        setCurrentPage(mappedCategory)
        return
      }
    }
    
    // Fallback to keyword matching if no category provided
    const restaurantKeywords = ['restaurant', 'cafe', 'coffee', 'bar', 'bistro', 'diner', 'eatery', 'food']
    const hotelKeywords = ['hotel', 'resort', 'inn', 'lodge', 'motel', 'accommodation', 'hostel', 'suite']
    const educationKeywords = ['school', 'university', 'college', 'academy', 'institute', 'education', 'learning', 'campus']
    const retailKeywords = ['store', 'shop', 'retail', 'mall', 'outlet', 'market', 'boutique', 'shopping']
    const healthKeywords = ['hospital', 'clinic', 'medical', 'health', 'doctor', 'physician', 'healthcare', 'pharmacy', 'diagnosis']
    const financialKeywords = ['bank', 'financial', 'loan', 'credit', 'mortgage', 'investment', 'banking', 'finance', 'atm', 'branch']
    const venueKeywords = ['venue', 'event', 'amusement', 'park', 'theme', 'entertainment', 'stadium', 'arena', 'theater', 'cinema', 'concert', 'hall']
    const serviceCenterKeywords = ['service center', 'service center', 'auto', 'mechanic', 'garage', 'repair', 'maintenance', 'service', 'automotive', 'car service', 'auto repair']
    
    const isRestaurant = restaurantKeywords.some(keyword => 
      placeId.toLowerCase().includes(keyword)
    )
    const isHotel = hotelKeywords.some(keyword => 
      placeId.toLowerCase().includes(keyword)
    )
    const isEducation = educationKeywords.some(keyword => 
      placeId.toLowerCase().includes(keyword)
    )
    const isRetail = retailKeywords.some(keyword => 
      placeId.toLowerCase().includes(keyword)
    )
    const isHealth = healthKeywords.some(keyword => 
      placeId.toLowerCase().includes(keyword)
    )
    const isFinancial = financialKeywords.some(keyword => 
      placeId.toLowerCase().includes(keyword)
    )
    const isVenue = venueKeywords.some(keyword => 
      placeId.toLowerCase().includes(keyword)
    )
    const isServiceCenter = serviceCenterKeywords.some(keyword => 
      placeId.toLowerCase().includes(keyword)
    )
    
    if (isRestaurant) {
      setCurrentPage('restaurant')
    } else if (isHotel) {
      setCurrentPage('hotel')
    } else if (isEducation) {
      setCurrentPage('education')
    } else if (isRetail) {
      setCurrentPage('retail')
    } else if (isHealth) {
      setCurrentPage('health')
    } else if (isFinancial) {
      setCurrentPage('financial')
    } else if (isVenue) {
      setCurrentPage('venue')
    } else if (isServiceCenter) {
      setCurrentPage('service-center')
    } else {
      setCurrentPage('analytics')
    }
  }

  const navigateToLanding = () => {
    setCurrentPage('landing')
  }

  // If we're on restaurant analytics page
  if (currentPage === 'restaurant') {
    // Log API response data for debugging
    console.log('🍽️ Page.tsx - Full API Response Data:', apiResponseData)
    
    // Pass the full API response - the component will extract from placeData
    // This allows the component to handle the actual API structure
    return (
      <RestaurantAnalytics 
        restaurantName={apiResponseData?.placeData?.place_name || analyticsPlaceId || 'Flavorlytics'} 
        onNavigateBack={navigateToLanding}
        apiData={apiResponseData}
      />
    )
  }

  // If we're on hotel analytics page
  if (currentPage === 'hotel') {
    return (
      <HotelsAccommodationAnalytics 
        hotelName={analyticsPlaceId || 'Grand Hotel'} 
        onNavigateBack={navigateToLanding}
        apiData={apiResponseData} // Pass the full API response
      />
    )
  }

  // If we're on education analytics page
  if (currentPage === 'education') {
    return (
      <EducationalInstitutionAnalytics 
        institutionName={analyticsPlaceId || 'Edutech Analytics'} 
        onNavigateBack={navigateToLanding}
      />
    )
  }

  // If we're on retail analytics page
  if (currentPage === 'retail') {
    return (
      <RetailShoppingAnalytics 
        storeName={analyticsPlaceId || 'Retail Insights'} 
        onNavigateBack={navigateToLanding}
      />
    )
  }

  // If we're on health analytics page
  if (currentPage === 'health') {
    return (
      <HealthMedicalAnalytics 
        institutionName={analyticsPlaceId || 'Review Insights'} 
        onNavigateBack={navigateToLanding}
      />
    )
  }

  // If we're on financial analytics page
  if (currentPage === 'financial') {
    return (
      <FinancialServicesAnalytics 
        institutionName={analyticsPlaceId || 'Review Insights'} 
        onNavigateBack={navigateToLanding}
      />
    )
  }

  // If we're on venue analytics page
  if (currentPage === 'venue') {
    return (
      <VenueAnalytics 
        venueName={analyticsPlaceId || 'Venue Analytics'} 
        onNavigateBack={navigateToLanding}
      />
    )
  }

  // If we're on service center analytics page
  if (currentPage === 'service-center') {
    return (
      <ServiceCenterAnalytics 
        centerName={analyticsPlaceId || 'Service Center'} 
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
