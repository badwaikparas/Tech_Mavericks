"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Calendar from "react-calendar"
import { Clock, MapPin, Users } from "lucide-react"
import { reservations } from "../data/reservations"
import { classrooms } from "../data/classrooms"

export default function CalendarView() {
  const [date, setDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [dateReservations, setDateReservations] = useState([])
  const [mounted, setMounted] = useState(false)

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split("T")[0]
  }

  // Get reservations for a specific date
  const getReservationsForDate = (date) => {
    const formattedDate = formatDate(date)
    return reservations.filter((res) => res.date === formattedDate)
  }

  // Check if a date has reservations
  const hasReservations = (date) => {
    const formattedDate = formatDate(date)
    return reservations.some((res) => res.date === formattedDate)
  }

  // Handle date change
  const handleDateChange = (newDate) => {
    setDate(newDate)
    setSelectedDate(formatDate(newDate))
    setDateReservations(getReservationsForDate(newDate))
  }

  // Custom tile content to show reservation indicator
  const tileContent = ({ date, view }) => {
    if (view === "month" && hasReservations(date)) {
      return (
        <div className="absolute bottom-1 left-0 right-0 flex justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
        </div>
      )
    }
    return null
  }

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
    setSelectedDate(formatDate(date))
    setDateReservations(getReservationsForDate(date))
  }, [date])

  if (!mounted) return null

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container mx-auto">
      <h1 className="text-3xl font-orbitron font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
        Reservation Calendar
      </h1>
      <p className="text-gray-400 mb-8">View and manage classroom reservations by date</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-800 shadow-neon-cyan-sm">
            <Calendar
              onChange={handleDateChange}
              value={date}
              tileContent={tileContent}
              tileClassName={({ date }) => (hasReservations(date) ? "has-reservations" : null)}
              className="cyber-calendar"
            />
          </div>
        </div>

        <div>
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-800 shadow-neon-purple-sm h-full">
            <h2 className="text-xl font-orbitron font-medium mb-4 text-purple-400">
              {selectedDate ? `Reservations for ${selectedDate}` : "Select a date"}
            </h2>

            {dateReservations.length > 0 ? (
              <div className="space-y-4">
                {dateReservations.map((reservation) => {
                  const room = classrooms.find((r) => r.id === reservation.roomId)
                  return (
                    <motion.div
                      key={reservation.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-gray-800/80 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-colors"
                    >
                      <h3 className="font-medium text-white mb-2">{room ? room.name : "Unknown Room"}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-300">
                          <Clock className="w-4 h-4 mr-2 text-cyan-400" />
                          {reservation.time}
                        </div>
                        <div className="flex items-center text-gray-300">
                          <MapPin className="w-4 h-4 mr-2 text-pink-400" />
                          {room ? `Capacity: ${room.capacity}` : "Unknown capacity"}
                        </div>
                        {room && room.equipment && (
                          <div className="flex items-center text-gray-300">
                            <Users className="w-4 h-4 mr-2 text-purple-400" />
                            {room.equipment.join(", ")}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <Calendar className="w-12 h-12 mb-4 text-gray-600" />
                <p>No reservations for this date</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

