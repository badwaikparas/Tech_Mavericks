"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, Users, Cpu, Check } from "lucide-react"
import { classrooms } from "../data/classrooms"
import { reservations } from "../data/reservations"

export default function ReservationForm() {
  const [formData, setFormData] = useState({
    roomId: "",
    date: "",
    time: "",
    purpose: "",
    attendees: "",
  })
  const [isAvailable, setIsAvailable] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Reset availability check when form changes
    if (name === "roomId" || name === "date" || name === "time") {
      setIsAvailable(null)
      setIsSubmitted(false)
    }
  }

  const checkAvailability = (e) => {
    e.preventDefault()

    // Check if required fields are filled
    if (!formData.roomId || !formData.date || !formData.time) {
      return
    }

    // Check against existing reservations
    const isBooked = reservations.some(
      (res) =>
        res.roomId === Number.parseInt(formData.roomId) && res.date === formData.date && res.time === formData.time,
    )

    setIsAvailable(!isBooked)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // In a real app, we would save the reservation to the database
    // For this demo, we'll just show a success message
    setIsSubmitted(true)
  }

  return (
    <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-800 shadow-neon-purple-sm">
      {isSubmitted ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-orbitron font-bold mb-2 text-green-400">Reservation Successful!</h2>
          <p className="text-gray-300 mb-6">Your classroom has been reserved successfully.</p>
          <button
            onClick={() => {
              setFormData({
                roomId: "",
                date: "",
                time: "",
                purpose: "",
                attendees: "",
              })
              setIsAvailable(null)
              setIsSubmitted(false)
            }}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors"
          >
            Make Another Reservation
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-gray-300 font-medium">Select Classroom</label>
              <div className="relative">
                <Cpu className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                <select
                  name="roomId"
                  value={formData.roomId}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white rounded-lg pl-10 pr-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                >
                  <option value="">Select a classroom</option>
                  {classrooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} (Capacity: {room.capacity})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-300 font-medium">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 focus:border-cyan-500 text-white rounded-lg pl-10 pr-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-300 font-medium">Time Slot</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" />
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 focus:border-pink-500 text-white rounded-lg pl-10 pr-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
                >
                  <option value="">Select a time slot</option>
                  <option value="08:00 AM - 10:00 AM">08:00 AM - 10:00 AM</option>
                  <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                  <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
                  <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                  <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-300 font-medium">Number of Attendees</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                <input
                  type="number"
                  name="attendees"
                  value={formData.attendees}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  placeholder="Enter number of attendees"
                  className="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 text-white rounded-lg pl-10 pr-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-gray-300 font-medium">Purpose of Reservation</label>
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="Describe the purpose of your reservation"
              rows="3"
              className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white rounded-lg px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            ></textarea>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              type="button"
              onClick={checkAvailability}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-medium transition-colors shadow-neon-cyan-sm hover:shadow-neon-cyan"
              disabled={!formData.roomId || !formData.date || !formData.time}
            >
              Check Availability
            </motion.button>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors shadow-neon-purple-sm hover:shadow-neon-purple"
              disabled={!isAvailable}
            >
              Reserve Now
            </motion.button>
          </div>

          {isAvailable !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg ${
                isAvailable
                  ? "bg-green-500/20 border border-green-500/30 text-green-400"
                  : "bg-red-500/20 border border-red-500/30 text-red-400"
              }`}
            >
              {isAvailable
                ? "This classroom is available for the selected date and time!"
                : "This classroom is already booked for the selected date and time. Please choose another option."}
            </motion.div>
          )}
        </form>
      )}
    </div>
  )
}

