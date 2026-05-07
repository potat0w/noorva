'use client'

import { useEffect } from 'react'

export default function AccountPage() {
  useEffect(() => {
    if (localStorage.getItem('token')) {
      window.location.href = '/account/profile'
      return
    }
    window.location.href = '/signin'
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  )
}
