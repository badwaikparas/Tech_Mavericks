"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export default function AuthCheck({ requiredRole = null, children }) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem("user")

      if (!userData) {
        router.push("/")
        return
      }

      const user = JSON.parse(userData)

      if (requiredRole && user.role !== requiredRole) {
        router.push("/welcome")
        return
      }

      setIsAuthorized(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [router, requiredRole])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return isAuthorized ? children : null
}

