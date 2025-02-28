"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, X, Search, Calendar } from "lucide-react"
import { reservations } from "../data/reservations"
import { attendance } from "../data/attendance"
import { classrooms } from "../data/classrooms"

export default function Attendance() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [attendanceData, setAttendanceData] = useState(attendance)

  // Combine data for display
  const combinedData = reservations.map((reservation) => {
    const room = classrooms.find((r) => r.id === reservation.roomId)
    const attendanceRecord = attendanceData.find((a) => a.reservationId === reservation.id)

    return {
      ...reservation,
      roomName: room ? room.name : "Unknown Room",
      students: attendanceRecord ? attendanceRecord.students : [],
    }
  })

  // Filter based on search and date
  const filteredData = combinedData.filter((item) => {
    const matchesSearch = item.roomName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDate = selectedDate ? item.date === selectedDate : true
    return matchesSearch && matchesDate
  })

  // Toggle attendance status
  const toggleStatus = (reservationId, studentName) => {
    setAttendanceData((prev) => {
      return prev.map((record) => {
        if (record.reservationId === reservationId) {
          return {
            ...record,
            students: record.students.map((student) => {
              if (student.name === studentName) {
                return {
                  ...student,
                  status: student.status === "Present" ? "Absent" : "Present",
                }
              }
              return student
            }),
          }
        }
        return record
      })
    })
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container mx-auto">
      <h1 className="text-3xl font-orbitron font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
        Attendance Tracker
      </h1>
      <p className="text-gray-400 mb-8">Track attendance for classroom reservations</p>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by classroom name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 text-white rounded-lg pl-10 pr-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          />
        </div>

        <div className="relative md:w-64">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 focus:border-cyan-500 text-white rounded-lg pl-10 pr-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800 shadow-neon-purple-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Time</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Classroom</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Student</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.flatMap((item) =>
                  item.students.map((student, index) => (
                    <motion.tr
                      key={`${item.id}-${index}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                    >
                      {index === 0 && (
                        <>
                          <td className="px-6 py-4 text-sm text-gray-300" rowSpan={item.students.length}>
                            {item.date}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300" rowSpan={item.students.length}>
                            {item.time}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300" rowSpan={item.students.length}>
                            {item.roomName}
                          </td>
                        </>
                      )}
                      <td className="px-6 py-4 text-sm text-gray-300">{student.name}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            student.status === "Present"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => toggleStatus(item.id, student.name)}
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                            student.status === "Present"
                              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                              : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                          } transition-colors`}
                        >
                          {student.status === "Present" ? <X size={16} /> : <Check size={16} />}
                        </button>
                      </td>
                    </motion.tr>
                  )),
                )
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                    No attendance records found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}

