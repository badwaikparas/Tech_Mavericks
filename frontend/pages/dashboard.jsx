"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ClassroomCard from "../components/ClassroomCard"
import { classrooms } from "../data/classrooms"
import { reservations } from "../data/reservations"

export default function Dashboard() {
  const [filteredRooms, setFilteredRooms] = useState(classrooms)
  const [filter, setFilter] = useState("all")

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0]

  // Find rooms that are booked today
  const getAvailability = (roomId) => {
    const isBooked = reservations.some((res) => res.roomId === roomId && res.date === today)
    return !isBooked
  }

  useEffect(() => {
    if (filter === "all") {
      setFilteredRooms(classrooms)
    } else if (filter === "available") {
      setFilteredRooms(classrooms.filter((room) => getAvailability(room.id)))
    } else if (filter === "booked") {
      setFilteredRooms(classrooms.filter((room) => !getAvailability(room.id)))
    }
  }, [filter]) // Removed unnecessary dependencies from useEffect

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container mx-auto">
      <div className="mb-8">
        <title>CyberLab</title>
        <link rel="icon" href="../public/favicon.png" />
        <h1 className="text-3xl font-orbitron font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          Classroom Dashboard
        </h1>
        <p className="text-gray-400 mb-6">Browse and reserve available classrooms and labs</p>

        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md transition-all duration-300 ${
              filter === "all"
                ? "bg-purple-600 text-white shadow-neon-purple"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            All Rooms
          </button>
          <button
            onClick={() => setFilter("available")}
            className={`px-4 py-2 rounded-md transition-all duration-300 ${
              filter === "available"
                ? "bg-cyan-600 text-white shadow-neon-cyan"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Available Today
          </button>
          <button
            onClick={() => setFilter("booked")}
            className={`px-4 py-2 rounded-md transition-all duration-300 ${
              filter === "booked"
                ? "bg-pink-600 text-white shadow-neon-pink"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Booked Today
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <ClassroomCard key={room.id} classroom={room} isAvailable={getAvailability(room.id)} />
        ))}
      </div>
    </motion.div>
  )
}

