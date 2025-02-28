"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/router"
import ParticleBackground from "../components/ParticleBackground"

export default function Welcome() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }

    setUser(JSON.parse(userData))
    setIsLoaded(true)
  }, [router])

  if (!isLoaded) return null

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden">
      <ParticleBackground />

      <div className="z-10 text-center px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-orbitron font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
            Welcome, {user?.username}
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            {user?.role === "admin"
              ? "Access the admin panel to manage classrooms and reservations."
              : "Book high-tech labs and classrooms with our futuristic reservation platform."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="px-8 py-4 text-lg font-medium rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-neon-pink hover:shadow-neon-pink-lg transition-all duration-300 relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(user?.role === "admin" ? "/admin" : "/dashboard")}
            >
              <span className="relative z-10">
                {user?.role === "admin" ? "Go to Admin Panel" : "Browse Classrooms"}
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </motion.button>

            <motion.button
              className="px-8 py-4 text-lg font-medium rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                localStorage.removeItem("user")
                router.push("/")
              }}
            >
              <span className="relative z-10">Logout</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-purple-500/20 blur-3xl"></div>
      <div className="absolute top-20 right-20 w-40 h-40 rounded-full bg-cyan-500/20 blur-3xl"></div>
    </div>
  )
}

