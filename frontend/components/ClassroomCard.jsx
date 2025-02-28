"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/router"
import { Users, Cpu, ArrowRight } from "lucide-react"

export default function ClassroomCard({ classroom, isAvailable }) {
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        scale: 1.03,
        rotateY: 5,
        rotateX: -5,
        z: 10,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-xl border ${
        isAvailable
          ? "border-cyan-800/50 shadow-neon-cyan-sm hover:shadow-neon-cyan"
          : "border-pink-800/50 shadow-neon-pink-sm hover:shadow-neon-pink"
      } bg-gray-900/60 backdrop-blur-sm transition-all duration-300 cursor-pointer`}
      onClick={() => router.push("/reservations")}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-orbitron font-bold text-white">{classroom.name}</h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              isAvailable
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
          >
            {isAvailable ? "Available" : "Booked"}
          </span>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-300">
            <Users className="w-5 h-5 mr-2 text-purple-400" />
            <span>Capacity: {classroom.capacity} students</span>
          </div>

          <div className="flex items-center text-gray-300">
            <Cpu className="w-5 h-5 mr-2 text-cyan-400" />
            <span>Equipment: {classroom.equipment.join(", ")}</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.2 }}
          className="flex justify-end"
        >
          <button className="flex items-center text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
            {isAvailable ? "Reserve Now" : "View Details"}
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </motion.div>
      </div>

      {/* 3D lighting effect */}
      <div
        className={`absolute inset-0 pointer-events-none ${
          isAvailable
            ? "bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/10"
            : "bg-gradient-to-br from-pink-500/5 via-transparent to-purple-500/10"
        }`}
      ></div>

      {/* Glowing border effect on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className={`absolute inset-0 pointer-events-none rounded-xl ${isAvailable ? "bg-cyan-500/5" : "bg-pink-500/5"}`}
      ></motion.div>
    </motion.div>
  )
}

