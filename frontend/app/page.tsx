'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { reviewAPI, type Review } from '@/lib/api'
import { Search, Loader2 } from 'lucide-react'

export default function Home() {
  const [placeId, setPlaceId] = useState('')
  const router = useRouter()

  const fetchMutation = useMutation({
    mutationFn: async () => {
      // Use a default placeId for testing if none provided
      const finalPlaceId = placeId.trim() || 'mock-place-id-123'
      return reviewAPI.fetchReviews(finalPlaceId, 'all')
    },
    onSuccess: async (data) => {
      // Process reviews after fetching
      await processMutation.mutateAsync({
        placeId: data.place.placeId,
        reviews: data.reviews,
      })
    },
  })

  const processMutation = useMutation({
    mutationFn: async ({ placeId, reviews }: { placeId: string; reviews: Review[] }) => {
      return reviewAPI.processReviews(placeId, reviews)
    },
    onSuccess: (_, variables) => {
      router.push(`/dashboard/${variables.placeId}`)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchMutation.mutate()
  }

  const isLoading = fetchMutation.isPending || processMutation.isPending

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              ReviewPulse
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              AI-Powered Review Analysis Engine
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Analyze thousands of reviews instantly and get meaningful insights
            </p>
          </div>

          {/* Input Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="placeId"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Google Place ID
                </label>
                <div className="relative">
                  <input
                    id="placeId"
                    type="text"
                    value={placeId}
                    onChange={(e) => setPlaceId(e.target.value)}
                    placeholder="Enter Google Place ID (e.g., ChIJN1t_tDeuEmsRUsoyG83frY4)"
                    className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    disabled={isLoading}
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Don't have a Place ID? Leave empty to test with mock data, or enter any valid Google Place ID.
                </p>
              </div>

              {fetchMutation.error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {fetchMutation.error instanceof Error
                      ? fetchMutation.error.message
                      : 'An error occurred'}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Reviews...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Analyze Reviews</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Info Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                📊 Sentiment Analysis
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Understand overall customer sentiment
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                🎯 Key Insights
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Extract positive and negative highlights
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                📈 Trends
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track changes over time
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

