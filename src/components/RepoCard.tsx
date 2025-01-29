"use client"


import type React from "react"
import type { Repository } from "@/types"

import { motion } from "framer-motion"

export const RepositoryCard: React.FC<{
  repo: Repository
  onDecrypt: (repo: Repository) => void
}> = ({ repo, onDecrypt }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    whileHover={{ scale: 1.05 }}
    className="bg-cyber-dark rounded-lg overflow-hidden shadow-neon border-2 border-neon-blue hover:border-neon-pink transition-colors duration-300"
  >
    <div className="p-6">
      <h3 className="text-2xl font-bold text-neon-pink mb-2">{repo.name}</h3>
      <div className="flex items-center justify-between mt-4">
        <span
          className={`px-2 py-1 rounded-full text-xs ${repo.hasReadme ? "bg-neon-green text-cyber-black" : "bg-neon-pink text-cyber-black"}`}
        >
          {repo.hasReadme ? "README FOUND" : "NO README"}
        </span>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDecrypt(repo)}
          className="bg-neon-blue text-cyber-black rounded-md py-2 px-4 hover:bg-neon-green transition-colors duration-300"
        >
          Generate
        </motion.button>
      </div>
    </div>
  </motion.div>
)