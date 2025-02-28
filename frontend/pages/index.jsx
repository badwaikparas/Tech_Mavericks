"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/router"
import { User, Lock, ChevronRight } from "lucide-react"
import ParticleBackground from "../components/ParticleBackground"
import { users } from "../data/users"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "instructor", // Default role
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user types
    if (error) setError("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call with timeout
    setTimeout(() => {
      const { username, password, role } = formData
      const user = users.find((u) => u.username === username && u.password === password && u.role === role)

      if (user) {
        // Store user info in localStorage (in a real app, use secure methods)
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: user.username,
            role: user.role,
          }),
        )

        // Redirect based on role
        if (user.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/dashboard")
        }
      } else {
        setError("Invalid username, password, or role")
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleBackground />

      <div className="absolute inset-0 pointer-events-none">
        {/* 3D decorative elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 270, 180, 90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-72 h-72 rounded-full bg-pink-500/10 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      <div className="z-10 w-full max-w-md px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-orbitron font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
            CyberLab Access
          </h1>
          <p className="text-gray-300">Enter your credentials to access the reservation system</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gray-900/40 backdrop-blur-lg rounded-2xl border border-gray-800/50 shadow-neon-purple-sm overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-300">Select Role</label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role: "instructor" }))}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    formData.role === "instructor"
                      ? "bg-cyan-600/80 text-white shadow-neon-cyan-sm"
                      : "bg-gray-800/80 text-gray-300 hover:bg-gray-700/80"
                  }`}
                >
                  Instructor
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role: "admin" }))}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    formData.role === "admin"
                      ? "bg-purple-600/80 text-white shadow-neon-purple-sm"
                      : "bg-gray-800/80 text-gray-300 hover:bg-gray-700/80"
                  }`}
                >
                  Administrator
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder={formData.role === "admin" ? "admin" : "instructor"}
                  className="w-full bg-gray-800/50 border border-gray-700/50 focus:border-purple-500/70 text-white rounded-lg pl-10 pr-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder={formData.role === "admin" ? "admin" : "password"}
                  className="w-full bg-gray-800/50 border border-gray-700/50 focus:border-purple-500/70 text-white rounded-lg pl-10 pr-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-medium transition-all shadow-neon-purple-sm hover:shadow-neon-purple flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Access System
                  <ChevronRight className="ml-2" size={18} />
                </>
              )}
            </motion.button>

            <div className="text-xs text-center text-gray-500 mt-4">
              <p>Demo Credentials:</p>
              <p>Admin: username "admin" / password "admin"</p>
              <p>Instructor: username "instructor" / password "password"</p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

