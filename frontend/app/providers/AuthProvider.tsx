'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI, tokenStorage, type User } from '@/lib/auth'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  logout: () => void
  isAuthenticated: boolean
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = tokenStorage.get()
    if (token) {
      authAPI
        .getCurrentUser(token)
        .then((data) => {
          setUser(data.user)
        })
        .catch(() => {
          // Token is invalid, remove it
          tokenStorage.remove()
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  const logout = () => {
    tokenStorage.remove()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        logout,
        isAuthenticated: !!user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
