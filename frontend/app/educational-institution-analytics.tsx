'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Download, TrendingUp, GraduationCap, BookOpen, Building, ClipboardList, Headphones, MapPin, Phone, Globe, Star } from 'lucide-react'
import jsPDF from 'jspdf'
import './educational-institution-analytics.css'

interface EducationalInstitutionAnalyticsProps {
  institutionName?: string
  onNavigateBack?: () => void
}

export default function EducationalInstitutionAnalytics({ 
  institutionName = 'Edutech Analytics', 
  onNavigateBack 
}: EducationalInstitutionAnalyticsProps) {
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
    reviews: { value: '1,284', trend: 'up', change: '+12% from last month' },
    averageRating: { value: '4.5', trend: 'up', change: '+0.2 from last month' }
  }

  const timePeriods = ['Weekly', 'Monthly', 'Yearly', 'All Time']

  const topTeachers = [
    { name: 'John Smith', subject: 'Mathematics', rating: '4.9', avatar: '👨‍🏫' },
    { name: 'Anna Doe', subject: 'Physics', rating: '4.8', avatar: '👩‍🏫' },
    { name: 'Maria Public', subject: 'History', rating: '4.8', avatar: '👩‍🏫' }
  ]

  const teachingQuality = {
    score: '8.5',
    maxScore: '10',
    sentiment: [
      { label: 'Positive', percentage: 75, color: '#10b981' },
      { label: 'Neutral', percentage: 15, color: '#f59e0b' },
      { label: 'Negative', percentage: 10, color: '#ef4444' }
    ]
  }

  const campusQuality = {
    score: '7.8',
    maxScore: '10',
    keywords: [
      { text: 'Modern Labs', color: 'green' },
      { text: 'Library', color: 'green' },
      { text: 'Wi-Fi', color: 'red' },
      { text: 'Cafeteria', color: 'red' }
    ]
  }

  const managementFeedback = {
    score: '6.2',
    maxScore: '10',
    keywords: [
      { text: 'Supportive', color: 'green' },
      { text: 'Slow Response', color: 'red' },
      { text: 'Bureaucratic', color: 'red' }
    ]
  }

  const studentSupport = {
    score: '9.1',
    maxScore: '10',
    responseTime: '24 Hours'
  }

  const institutionInfo = {
    address: '123 University Ave, Learnington, ED 54321',
    addressLabel: 'Main Campus Address',
    phone: '+1 (555) 123-4567',
    phoneLabel: 'Admissions Office',
    website: 'www.university-example.edu',
    websiteLabel: 'Official Website'
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
    doc.text(institutionName || 'Educational Institution Analytics', margin, 25)
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
    addText(`Total Reviews: ${metricsData.reviews.value}`, 11, true)
    addText(`Average Rating: ${metricsData.averageRating.value} / 5.0`, 11, true)
    addText(`Selected Time Period: ${selectedPeriod}`, 10, false, [100, 100, 100])
    yPosition += sectionSpacing

    // Top Teachers
    addText('TOP RECOMMENDED TEACHERS', 12, true, [30, 27, 75])
    yPosition += 5
    topTeachers.forEach((teacher, index) => {
      addText(`${index + 1}. ${teacher.name} - ${teacher.subject} (Rating: ${teacher.rating})`, 10)
    })
    yPosition += sectionSpacing

    // Teaching Quality
    addText('QUALITY OF TEACHING', 12, true, [30, 27, 75])
    yPosition += 5
    addText(`Overall Score: ${teachingQuality.score} / ${teachingQuality.maxScore}`, 11, true)
    teachingQuality.sentiment.forEach((item) => {
      addText(`${item.label}: ${item.percentage}%`, 10)
    })
    yPosition += sectionSpacing

    // Campus Quality
    addText('CAMPUS/INFRASTRUCTURE QUALITY', 12, true, [30, 27, 75])
    yPosition += 5
    addText(`Overall Score: ${campusQuality.score} / ${campusQuality.maxScore}`, 11, true)
    campusQuality.keywords.forEach((keyword) => {
      addText(`- ${keyword.text}`, 10)
    })
    yPosition += sectionSpacing

    // Management Feedback
    addText('MANAGEMENT FEEDBACK', 12, true, [30, 27, 75])
    yPosition += 5
    addText(`Satisfaction Score: ${managementFeedback.score} / ${managementFeedback.maxScore}`, 11, true)
    managementFeedback.keywords.forEach((keyword) => {
      addText(`- ${keyword.text}`, 10)
    })
    yPosition += sectionSpacing

    // Student Support
    addText('STUDENT SUPPORT & COUNSELLING QUALITY', 12, true, [30, 27, 75])
    yPosition += 5
    addText(`Satisfaction Score: ${studentSupport.score} / ${studentSupport.maxScore}`, 11, true)
    addText(`Average Response Time: ${studentSupport.responseTime}`, 10)
    yPosition += sectionSpacing

    // Contact Information
    addText('INSTITUTION CONTACT INFORMATION', 12, true, [30, 27, 75])
    yPosition += 5
    addText(`${institutionInfo.addressLabel}: ${institutionInfo.address}`, 10)
    addText(`${institutionInfo.phoneLabel}: ${institutionInfo.phone}`, 10)
    addText(`${institutionInfo.websiteLabel}: ${institutionInfo.website}`, 10)

    // Footer
    const totalPages = doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' })
    }

    doc.save(`${institutionName || 'Educational_Institution'}_Analytics_${new Date().toISOString().split('T')[0]}.pdf`)
  }

  return (
    <div className="education-analytics-container">
      <div className="education-analytics-content">
        {/* Header */}
        <div className="education-header">
          <div className="education-header-left">
            <div className="education-logo">
              <GraduationCap className="logo-icon" />
            </div>
            <div className="education-title-section">
              <h1 className="education-title">{institutionName}</h1>
              <p className="education-subtitle">Review Insights Dashboard</p>
            </div>
          </div>
          <div className="education-header-right">
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
              <div className="stars-display">
                <Star className="star-icon filled" />
                <Star className="star-icon filled" />
                <Star className="star-icon filled" />
                <Star className="star-icon filled" />
                <Star className="star-icon half-filled" />
              </div>
            </div>
            <div className="metric-trend">
              <TrendingUp className="trend-icon up" />
              <span className="trend-text">{metricsData.averageRating.change}</span>
            </div>
          </div>
        </div>

        {/* Key Insights Section */}
        <div className="key-insights-section">
          <h2 className="section-title">Key Insights</h2>
          
          <div className="insights-grid">
            {/* Top Recommended Teachers */}
            <div className="insight-card teachers-card">
              <div className="card-header">
                <GraduationCap className="card-icon" />
                <h3 className="card-title">Top Recommended Teachers</h3>
              </div>
              <div className="teachers-list">
                {topTeachers.map((teacher, index) => (
                  <div key={index} className="teacher-item">
                    <div className="teacher-avatar">{teacher.avatar}</div>
                    <div className="teacher-info">
                      <span className="teacher-name">{teacher.name}</span>
                      <span className="teacher-subject">{teacher.subject}</span>
                    </div>
                    <div className="teacher-rating">
                      <span className="rating-value">{teacher.rating}</span>
                      <Star className="rating-star" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality of Teaching */}
            <div className="insight-card teaching-card">
              <div className="card-header">
                <BookOpen className="card-icon" />
                <h3 className="card-title">Quality of Teaching</h3>
              </div>
              <div className="score-display">
                <span className="score-value">{teachingQuality.score}</span>
                <span className="score-max">/{teachingQuality.maxScore}</span>
                <span className="score-label">Overall Score</span>
              </div>
              <div className="sentiment-distribution">
                {teachingQuality.sentiment.map((item, index) => (
                  <div key={index} className="sentiment-item">
                    <div className="sentiment-info">
                      <span className="sentiment-label">{item.label}</span>
                      <span className="sentiment-percentage">{item.percentage}%</span>
                    </div>
                    <div className="sentiment-bar">
                      <div 
                        className="sentiment-fill" 
                        style={{ 
                          width: `${item.percentage}%`, 
                          backgroundColor: item.color 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campus/Infrastructure Quality */}
            <div className="insight-card campus-card">
              <div className="card-header">
                <Building className="card-icon" />
                <h3 className="card-title">Campus/Infrastructure Quality</h3>
              </div>
              <div className="score-display">
                <span className="score-value">{campusQuality.score}</span>
                <span className="score-max">/{campusQuality.maxScore}</span>
                <span className="score-label">Overall Score</span>
              </div>
              <div className="keywords-list">
                {campusQuality.keywords.map((keyword, index) => (
                  <span 
                    key={index} 
                    className={`keyword-tag ${keyword.color}`}
                  >
                    {keyword.text}
                  </span>
                ))}
              </div>
            </div>

            {/* Management Feedback */}
            <div className="insight-card management-card">
              <div className="card-header">
                <ClipboardList className="card-icon" />
                <h3 className="card-title">Management Feedback</h3>
              </div>
              <div className="score-display">
                <span className="score-value">{managementFeedback.score}</span>
                <span className="score-max">/{managementFeedback.maxScore}</span>
                <span className="score-label">Satisfaction Score</span>
              </div>
              <div className="keywords-list">
                {managementFeedback.keywords.map((keyword, index) => (
                  <span 
                    key={index} 
                    className={`keyword-tag ${keyword.color}`}
                  >
                    {keyword.text}
                  </span>
                ))}
              </div>
            </div>

            {/* Student Support & Counselling Quality */}
            <div className="insight-card support-card">
              <div className="card-header">
                <Headphones className="card-icon" />
                <h3 className="card-title">Student Support & Counselling Quality</h3>
              </div>
              <div className="score-display">
                <span className="score-value">{studentSupport.score}</span>
                <span className="score-max">/{studentSupport.maxScore}</span>
                <span className="score-label">Satisfaction Score</span>
              </div>
              <div className="response-time">
                <span className="response-label">Avg. Response Time</span>
                <span className="response-value">{studentSupport.responseTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Institution Contact Information */}
        <div className="contact-section">
          <h2 className="section-title">Institution Contact Information</h2>
          <div className="contact-info-card">
            <div className="contact-item">
              <MapPin className="contact-icon" />
              <div className="contact-details">
                <span className="contact-value">{institutionInfo.address}</span>
                <span className="contact-label">{institutionInfo.addressLabel}</span>
              </div>
            </div>
            <div className="contact-item">
              <Phone className="contact-icon" />
              <div className="contact-details">
                <span className="contact-value">{institutionInfo.phone}</span>
                <span className="contact-label">{institutionInfo.phoneLabel}</span>
              </div>
            </div>
            <div className="contact-item">
              <Globe className="contact-icon" />
              <div className="contact-details">
                <span className="contact-value">{institutionInfo.website}</span>
                <span className="contact-label">{institutionInfo.websiteLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
