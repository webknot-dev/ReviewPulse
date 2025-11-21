'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { reviewAPI } from '@/lib/api'
import { ArrowLeft, Loader2, TrendingUp, TrendingDown, MessageSquare, Star } from 'lucide-react'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'

const COLORS = ['#10b981', '#ef4444', '#6b7280']

export default function DashboardPage() {
  const params = useParams()
  const router = useRouter()
  const placeId = params.placeId as string
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year' | 'all'>('all')

  const { data, isLoading, error } = useQuery({
    queryKey: ['insights', placeId],
    queryFn: () => reviewAPI.getInsights(placeId),
    retry: 2,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading insights...</p>
        </div>
      </div>
    )
  }

  if (error || !data?.insight) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error instanceof Error ? error.message : 'Failed to load insights'}
          </p>
          <button
            onClick={() => router.push('/')}
            className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            Go back to home
          </button>
        </div>
      </div>
    )
  }

  const { insight, place } = data

  // Prepare chart data
  const sentimentData = [
    { name: 'Positive', value: insight.sentimentBreakdown.positive, color: '#10b981' },
    { name: 'Negative', value: insight.sentimentBreakdown.negative, color: '#ef4444' },
    { name: 'Neutral', value: insight.sentimentBreakdown.neutral, color: '#6b7280' },
  ]

  const topicData = insight.topics
    .slice(0, 10)
    .map((topic) => ({
      name: topic.name,
      count: topic.count,
      sentiment: topic.sentiment,
    }))

  const trendData = insight.trends[dateRange]
    ? [
        {
          name: dateRange.charAt(0).toUpperCase() + dateRange.slice(1),
          rating: insight.trends[dateRange]?.averageRating || 0,
          reviews: insight.trends[dateRange]?.totalReviews || 0,
        },
      ]
    : []

  const trendComparison = insight.trends.all
    ? [
        {
          period: 'All Time',
          rating: insight.trends.all.averageRating,
          positive: insight.trends.all.sentimentBreakdown.positive,
          negative: insight.trends.all.sentimentBreakdown.negative,
        },
        ...(insight.trends.year
          ? [
              {
                period: 'Last Year',
                rating: insight.trends.year.averageRating,
                positive: insight.trends.year.sentimentBreakdown.positive,
                negative: insight.trends.year.sentimentBreakdown.negative,
              },
            ]
          : []),
        ...(insight.trends.month
          ? [
              {
                period: 'Last Month',
                rating: insight.trends.month.averageRating,
                positive: insight.trends.month.sentimentBreakdown.positive,
                negative: insight.trends.month.sentimentBreakdown.negative,
              },
            ]
          : []),
        ...(insight.trends.week
          ? [
              {
                period: 'Last Week',
                rating: insight.trends.week.averageRating,
                positive: insight.trends.week.sentimentBreakdown.positive,
                negative: insight.trends.week.sentimentBreakdown.negative,
              },
            ]
          : []),
      ]
    : []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {place?.name || 'Review Insights'}
          </h1>
          {place?.address && (
            <p className="text-gray-600 dark:text-gray-400">{place.address}</p>
          )}
        </div>

        {/* Date Range Selector */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {['all', 'year', 'month', 'week'].map((range) => {
            const isAvailable = insight.trends[range as keyof typeof insight.trends]
            if (!isAvailable) return null
            return (
              <button
                key={range}
                onClick={() => setDateRange(range as 'week' | 'month' | 'year' | 'all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  dateRange === range
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {range === 'all' ? 'All Time' : `Last ${range.charAt(0).toUpperCase() + range.slice(1)}`}
              </button>
            )
          })}
        </div>

        {/* Summary Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            AI Summary
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {insight.summary}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Positive Reviews
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {insight.sentimentBreakdown.positive}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Negative Reviews
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {insight.sentimentBreakdown.negative}
                </p>
              </div>
              <TrendingDown className="w-12 h-12 text-red-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Neutral Reviews
                </p>
                <p className="text-3xl font-bold text-gray-600">
                  {insight.sentimentBreakdown.neutral}
                </p>
              </div>
              <MessageSquare className="w-12 h-12 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Positive Highlights */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-green-600" />
              Positive Highlights
            </h2>
            <ul className="space-y-3">
              {insight.positiveHighlights.length > 0 ? (
                insight.positiveHighlights.map((highlight, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                  >
                    <span className="text-green-600 mt-1">✓</span>
                    <span>{highlight}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 dark:text-gray-400">No positive highlights found</li>
              )}
            </ul>
          </div>

          {/* Negative Highlights */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingDown className="w-6 h-6 text-red-600" />
              Common Complaints
            </h2>
            <ul className="space-y-3">
              {insight.negativeHighlights.length > 0 ? (
                insight.negativeHighlights.map((highlight, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                  >
                    <span className="text-red-600 mt-1">✗</span>
                    <span>{highlight}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 dark:text-gray-400">No complaints found</li>
              )}
            </ul>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Sentiment Pie Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Sentiment Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Topics Bar Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Top Topics
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topicData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend Comparison */}
        {trendComparison.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Trend Comparison
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke="#6366f1"
                  strokeWidth={2}
                  name="Average Rating"
                />
                <Line
                  type="monotone"
                  dataKey="positive"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Positive"
                />
                <Line
                  type="monotone"
                  dataKey="negative"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Negative"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Last Processed */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Last processed: {new Date(insight.lastProcessed).toLocaleString()}
        </div>
      </div>
    </div>
  )
}

