"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/router"
import { LayoutDashboard, CalendarDays, Users, Calendar, Settings, ChevronLeft, ChevronRight } from "lucide-react"

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <motion.div
      initial={{ width: 240 }}
      animate={{ width: isCollapsed ? 80 : 240 }}
      transition={{ duration: 0.3 }}
      className="hidden md:block h-screen bg-gray-900/60 backdrop-blur-sm border-r border-gray-800 sticky top-0 z-40"
    >
      <div className="flex flex-col h-full">
        <div className="p-4 flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"
            >
              CyberLab
            </motion.div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <div className="flex-1 py-6 flex flex-col gap-2">
          <SidebarLinks isCollapsed={isCollapsed} />
        </div>

        <div className="p-4">
          <div className={`flex items-center p-3 rounded-lg bg-gray-800/80 ${isCollapsed ? "justify-center" : ""}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
              A
            </div>

            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="ml-3"
              >
                <div className="text-sm font-medium text-white">Admin User</div>
                <div className="text-xs text-gray-400">admin@cyberlab.com</div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function SidebarLinks({ isCollapsed }) {
  const router = useRouter()
  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/reservations", label: "Reservations", icon: CalendarDays },
    { href: "/attendance", label: "Attendance", icon: Users },
    { href: "/calendar", label: "Calendar", icon: Calendar },
    { href: "/admin", label: "Admin", icon: Settings },
  ]

  return (
    <div className="px-3 space-y-1">
      {links.map((link) => {
        const isActive = router.pathname === link.href
        const Icon = link.icon

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${
              isCollapsed ? "justify-center" : ""
            } ${
              isActive
                ? "bg-purple-600/20 text-white shadow-neon-purple-sm"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
          >
            <Icon size={20} className={isActive ? "text-purple-400" : ""} />

            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="ml-3 text-sm font-medium"
              >
                {link.label}
              </motion.span>
            )}

            {!isCollapsed && isActive && (
              <motion.div
                layoutId="sidebar-indicator"
                className="absolute left-0 w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-r-full"
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
          </Link>
        )
      })}
    </div>
  )
}

