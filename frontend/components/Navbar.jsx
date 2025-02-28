"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/router"
import { Menu, X, Bell, Calendar, User, LogOut } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(null)
  const router = useRouter()

  // Get user data
  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/welcome" className="flex items-center">
              <span className="text-xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                CyberLab
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <NavLinks userRole={user?.role} />

            <div className="flex items-center ml-4 space-x-2">
              <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors relative">
                <Bell size={18} />
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-pink-500"></span>
              </button>

              <div className="relative group">
                <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors">
                  <User size={18} />
                </button>

                <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg border border-gray-800 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="px-4 py-3 border-b border-gray-800">
                    <p className="text-sm font-medium text-white">{user?.username || "Guest"}</p>
                    <p className="text-xs text-gray-400 capitalize">{user?.role || "Not logged in"}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md bg-gray-800 text-gray-300">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          height: isOpen ? "auto" : 0,
        }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden"
      >
        <div className="px-4 pt-2 pb-4 space-y-1 bg-gray-900/90 backdrop-blur-md">
          <MobileNavLinks userRole={user?.role} />
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </button>
        </div>
      </motion.div>
    </nav>
  )
}

function NavLinks({ userRole }) {
  const router = useRouter()

  // Define links based on user role
  const getLinks = () => {
    const commonLinks = [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/reservations", label: "Reserve" },
      { href: "/calendar", label: "Calendar" },
    ]

    const adminLinks = [
      { href: "/attendance", label: "Attendance" },
      { href: "/admin", label: "Admin" },
    ]

    return userRole === "admin" ? [...commonLinks, ...adminLinks] : commonLinks
  }

  const links = getLinks()

  return (
    <div className="flex items-center space-x-1">
      {links.map((link) => {
        const isActive = router.pathname === link.href

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              isActive
                ? "text-white bg-purple-600/20 shadow-neon-purple-sm"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
          >
            {link.label}
            {isActive && (
              <motion.div
                layoutId="navbar-indicator"
                className="h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 mt-0.5 rounded-full"
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
          </Link>
        )
      })}
    </div>
  )
}

function MobileNavLinks({ userRole }) {
  const router = useRouter()

  // Define links based on user role
  const getLinks = () => {
    const commonLinks = [
      { href: "/dashboard", label: "Dashboard", icon: Calendar },
      { href: "/reservations", label: "Reserve", icon: Calendar },
      { href: "/calendar", label: "Calendar", icon: Calendar },
    ]

    const adminLinks = [
      { href: "/attendance", label: "Attendance", icon: Calendar },
      { href: "/admin", label: "Admin", icon: Calendar },
    ]

    return userRole === "admin" ? [...commonLinks, ...adminLinks] : commonLinks
  }

  const links = getLinks()

  return (
    <div className="flex flex-col space-y-2">
      {links.map((link) => {
        const isActive = router.pathname === link.href
        const Icon = link.icon

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              isActive
                ? "text-white bg-purple-600/20 shadow-neon-purple-sm"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
          >
            <Icon size={18} className="mr-2" />
            {link.label}
          </Link>
        )
      })}
    </div>
  )
}

