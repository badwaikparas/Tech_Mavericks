"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trash2, Edit, Plus, Save, X, Search, Clock } from "lucide-react"
import { classrooms as initialClassrooms } from "../data/classrooms"
import { reservations as initialReservations } from "../data/reservations"
import { timeSlots as initialTimeSlots } from "../data/timeSlots"
import { useRouter } from "next/router"

export default function Admin() {
  const router = useRouter()
  const [classrooms, setClassrooms] = useState(initialClassrooms)
  const [reservations, setReservations] = useState(initialReservations)
  const [timeSlots, setTimeSlots] = useState(initialTimeSlots)
  const [editingClassroom, setEditingClassroom] = useState(null)
  const [editingTimeSlot, setEditingTimeSlot] = useState(null)
  const [newClassroom, setNewClassroom] = useState({
    name: "",
    capacity: "",
    equipment: [],
  })
  const [newTimeSlot, setNewTimeSlot] = useState({
    startTime: "",
    endTime: "",
    days: [],
  })
  const [newEquipment, setNewEquipment] = useState("")
  const [activeTab, setActiveTab] = useState("classrooms")
  const [searchTerm, setSearchTerm] = useState("")
  const [user, setUser] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Check authentication
  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "admin") {
      router.push("/dashboard")
      return
    }

    setUser(parsedUser)
    setIsLoaded(true)
  }, [router])

  // Save data to localStorage when it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("classrooms", JSON.stringify(classrooms))
      localStorage.setItem("reservations", JSON.stringify(reservations))
      localStorage.setItem("timeSlots", JSON.stringify(timeSlots))
    }
  }, [classrooms, reservations, timeSlots, isLoaded])

  // Load data from localStorage on initial load
  useEffect(() => {
    const storedClassrooms = localStorage.getItem("classrooms")
    const storedReservations = localStorage.getItem("reservations")
    const storedTimeSlots = localStorage.getItem("timeSlots")

    if (storedClassrooms) setClassrooms(JSON.parse(storedClassrooms))
    if (storedReservations) setReservations(JSON.parse(storedReservations))
    if (storedTimeSlots) setTimeSlots(JSON.parse(storedTimeSlots))
  }, [])

  if (!isLoaded) return null

  // Filter classrooms based on search term
  const filteredClassrooms = classrooms.filter((room) => room.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Filter reservations based on search term
  const filteredReservations = reservations.filter((res) => {
    const room = classrooms.find((r) => r.id === res.roomId)
    return room && room.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Filter time slots based on search term
  const filteredTimeSlots = timeSlots.filter((slot) =>
    `${slot.startTime} - ${slot.endTime}`.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle editing a classroom
  const handleEditClassroom = (classroom) => {
    setEditingClassroom({
      ...classroom,
      equipment: [...classroom.equipment],
    })
  }

  // Handle saving edited classroom
  const handleSaveClassroom = () => {
    setClassrooms((prev) => prev.map((room) => (room.id === editingClassroom.id ? editingClassroom : room)))
    setEditingClassroom(null)
  }

  // Handle deleting a classroom
  const handleDeleteClassroom = (id) => {
    setClassrooms((prev) => prev.filter((room) => room.id !== id))
    // Also delete associated reservations
    setReservations((prev) => prev.filter((res) => res.roomId !== id))
  }

  // Handle adding equipment to a classroom
  const handleAddEquipment = () => {
    if (newEquipment.trim() === "") return

    if (editingClassroom) {
      setEditingClassroom((prev) => ({
        ...prev,
        equipment: [...prev.equipment, newEquipment],
      }))
    } else {
      setNewClassroom((prev) => ({
        ...prev,
        equipment: [...prev.equipment, newEquipment],
      }))
    }

    setNewEquipment("")
  }

  // Handle removing equipment from a classroom
  const handleRemoveEquipment = (index, isEditing) => {
    if (isEditing) {
      setEditingClassroom((prev) => ({
        ...prev,
        equipment: prev.equipment.filter((_, i) => i !== index),
      }))
    } else {
      setNewClassroom((prev) => ({
        ...prev,
        equipment: prev.equipment.filter((_, i) => i !== index),
      }))
    }
  }

  // Handle creating a new classroom
  const handleCreateClassroom = () => {
    if (newClassroom.name.trim() === "" || !newClassroom.capacity) return

    const newId = Math.max(...classrooms.map((room) => room.id), 0) + 1

    setClassrooms((prev) => [
      ...prev,
      {
        id: newId,
        name: newClassroom.name,
        capacity: Number.parseInt(newClassroom.capacity),
        equipment: newClassroom.equipment,
      },
    ])

    setNewClassroom({
      name: "",
      capacity: "",
      equipment: [],
    })
  }

  // Handle deleting a reservation
  const handleDeleteReservation = (id) => {
    setReservations((prev) => prev.filter((res) => res.id !== id))
  }

  // Handle editing a time slot
  const handleEditTimeSlot = (timeSlot) => {
    setEditingTimeSlot({
      ...timeSlot,
      days: [...timeSlot.days],
    })
  }

  // Handle saving edited time slot
  const handleSaveTimeSlot = () => {
    setTimeSlots((prev) => prev.map((slot) => (slot.id === editingTimeSlot.id ? editingTimeSlot : slot)))
    setEditingTimeSlot(null)
  }

  // Handle deleting a time slot
  const handleDeleteTimeSlot = (id) => {
    setTimeSlots((prev) => prev.filter((slot) => slot.id !== id))
  }

  // Handle toggling a day for a time slot
  const handleToggleDay = (day, isEditing) => {
    if (isEditing) {
      setEditingTimeSlot((prev) => {
        const days = prev.days.includes(day) ? prev.days.filter((d) => d !== day) : [...prev.days, day]
        return { ...prev, days }
      })
    } else {
      setNewTimeSlot((prev) => {
        const days = prev.days.includes(day) ? prev.days.filter((d) => d !== day) : [...prev.days, day]
        return { ...prev, days }
      })
    }
  }

  // Handle creating a new time slot
  const handleCreateTimeSlot = () => {
    if (!newTimeSlot.startTime || !newTimeSlot.endTime || newTimeSlot.days.length === 0) return

    const newId = Math.max(...timeSlots.map((slot) => slot.id), 0) + 1

    setTimeSlots((prev) => [
      ...prev,
      {
        id: newId,
        startTime: newTimeSlot.startTime,
        endTime: newTimeSlot.endTime,
        days: newTimeSlot.days,
      },
    ])

    setNewTimeSlot({
      startTime: "",
      endTime: "",
      days: [],
    })
  }

  // Check if a time slot is valid (end time is after start time)
  const isValidTimeSlot = (startTime, endTime) => {
    if (!startTime || !endTime) return true
    return startTime < endTime
  }

  // Days of the week for time slots
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-orbitron font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Admin Panel
          </h1>
          <p className="text-gray-400">Manage classrooms, time slots, and reservations</p>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("user")
            router.push("/")
          }}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="mb-8 flex flex-wrap gap-4">
        <button
          onClick={() => setActiveTab("classrooms")}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === "classrooms"
              ? "bg-purple-600 text-white shadow-neon-purple"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Classrooms
        </button>
        <button
          onClick={() => setActiveTab("timeSlots")}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === "timeSlots"
              ? "bg-cyan-600 text-white shadow-neon-cyan"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Time Slots
        </button>
        <button
          onClick={() => setActiveTab("reservations")}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === "reservations"
              ? "bg-pink-600 text-white shadow-neon-pink"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Reservations
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white rounded-lg pl-10 pr-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
        />
      </div>

      {activeTab === "classrooms" && (
        <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800 shadow-neon-purple-sm overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-orbitron font-medium mb-4 text-purple-400">Add New Classroom</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Classroom Name"
                value={newClassroom.name}
                onChange={(e) => setNewClassroom((prev) => ({ ...prev, name: e.target.value }))}
                className="bg-gray-800 border border-gray-700 focus:border-purple-500 text-white rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
              <input
                type="number"
                placeholder="Capacity"
                value={newClassroom.capacity}
                onChange={(e) => setNewClassroom((prev) => ({ ...prev, capacity: e.target.value }))}
                className="bg-gray-800 border border-gray-700 focus:border-purple-500 text-white rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>

            <div className="mb-4">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Add Equipment"
                  value={newEquipment}
                  onChange={(e) => setNewEquipment(e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 focus:border-purple-500 text-white rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
                <button
                  onClick={handleAddEquipment}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {(editingClassroom ? editingClassroom.equipment : newClassroom.equipment).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300"
                  >
                    {item}
                    <button
                      onClick={() => handleRemoveEquipment(index, !!editingClassroom)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleCreateClassroom}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors shadow-neon-purple-sm hover:shadow-neon-purple"
            >
              Create Classroom
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Capacity</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Equipment</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClassrooms.map((classroom) => (
                  <tr key={classroom.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-300">{classroom.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {editingClassroom && editingClassroom.id === classroom.id ? (
                        <input
                          type="text"
                          value={editingClassroom.name}
                          onChange={(e) => setEditingClassroom((prev) => ({ ...prev, name: e.target.value }))}
                          className="bg-gray-800 border border-gray-700 focus:border-purple-500 text-white rounded-lg px-3 py-1 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                        />
                      ) : (
                        classroom.name
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {editingClassroom && editingClassroom.id === classroom.id ? (
                        <input
                          type="number"
                          value={editingClassroom.capacity}
                          onChange={(e) => setEditingClassroom((prev) => ({ ...prev, capacity: e.target.value }))}
                          className="bg-gray-800 border border-gray-700 focus:border-purple-500 text-white rounded-lg px-3 py-1 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all w-20"
                        />
                      ) : (
                        classroom.capacity
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <div className="flex flex-wrap gap-1">
                        {classroom.equipment.map((item, index) => (
                          <span key={index} className="inline-block px-2 py-1 bg-gray-800 rounded-full text-xs">
                            {item}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {editingClassroom && editingClassroom.id === classroom.id ? (
                        <button
                          onClick={handleSaveClassroom}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors mr-2"
                        >
                          <Save size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditClassroom(classroom)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors mr-2"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteClassroom(classroom.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "timeSlots" && (
        <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800 shadow-neon-cyan-sm overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-orbitron font-medium mb-4 text-cyan-400">Add New Time Slot</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Start Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="time"
                    value={newTimeSlot.startTime}
                    onChange={(e) => setNewTimeSlot((prev) => ({ ...prev, startTime: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 focus:border-cyan-500 text-white rounded-lg pl-10 pr-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">End Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="time"
                    value={newTimeSlot.endTime}
                    onChange={(e) => setNewTimeSlot((prev) => ({ ...prev, endTime: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 focus:border-cyan-500 text-white rounded-lg pl-10 pr-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                  />
                </div>
              </div>
            </div>

            {!isValidTimeSlot(newTimeSlot.startTime, newTimeSlot.endTime) && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
                End time must be after start time
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Available Days</label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleToggleDay(day, false)}
                    className={`px-3 py-2 rounded-md text-sm transition-colors ${
                      newTimeSlot.days.includes(day)
                        ? "bg-cyan-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCreateTimeSlot}
              disabled={
                !isValidTimeSlot(newTimeSlot.startTime, newTimeSlot.endTime) ||
                !newTimeSlot.startTime ||
                !newTimeSlot.endTime ||
                newTimeSlot.days.length === 0
              }
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors shadow-neon-cyan-sm hover:shadow-neon-cyan"
            >
              Create Time Slot
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Time Range</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Available Days</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTimeSlots.map((timeSlot) => (
                  <tr key={timeSlot.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-300">{timeSlot.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {editingTimeSlot && editingTimeSlot.id === timeSlot.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={editingTimeSlot.startTime}
                            onChange={(e) => setEditingTimeSlot((prev) => ({ ...prev, startTime: e.target.value }))}
                            className="bg-gray-800 border border-gray-700 focus:border-cyan-500 text-white rounded-lg px-2 py-1 appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all w-32"
                          />
                          <span>to</span>
                          <input
                            type="time"
                            value={editingTimeSlot.endTime}
                            onChange={(e) => setEditingTimeSlot((prev) => ({ ...prev, endTime: e.target.value }))}
                            className="bg-gray-800 border border-gray-700 focus:border-cyan-500 text-white rounded-lg px-2 py-1 appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all w-32"
                          />
                        </div>
                      ) : (
                        `${timeSlot.startTime} - ${timeSlot.endTime}`
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {editingTimeSlot && editingTimeSlot.id === timeSlot.id ? (
                        <div className="flex flex-wrap gap-1">
                          {daysOfWeek.map((day) => (
                            <button
                              key={day}
                              type="button"
                              onClick={() => handleToggleDay(day, true)}
                              className={`px-2 py-1 rounded-md text-xs transition-colors ${
                                editingTimeSlot.days.includes(day)
                                  ? "bg-cyan-600 text-white"
                                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                              }`}
                            >
                              {day.substring(0, 3)}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {timeSlot.days.map((day) => (
                            <span key={day} className="inline-block px-2 py-1 bg-gray-800 rounded-full text-xs">
                              {day.substring(0, 3)}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {editingTimeSlot && editingTimeSlot.id === timeSlot.id ? (
                        <button
                          onClick={handleSaveTimeSlot}
                          disabled={!isValidTimeSlot(editingTimeSlot.startTime, editingTimeSlot.endTime)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors mr-2"
                        >
                          <Save size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditTimeSlot(timeSlot)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors mr-2"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteTimeSlot(timeSlot.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "reservations" && (
        <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800 shadow-neon-pink-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Classroom</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Time</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((reservation) => {
                  const room = classrooms.find((r) => r.id === reservation.roomId)
                  return (
                    <tr
                      key={reservation.id}
                      className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-300">{reservation.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{room ? room.name : "Unknown Room"}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{reservation.date}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{reservation.time}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleDeleteReservation(reservation.id)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  )
}

