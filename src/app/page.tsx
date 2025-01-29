"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("")

  useEffect(() => {
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(interval)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [text])

  return <span>{displayedText}</span>
}

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-cyber-black flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="text-center z-10">
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-neon-pink mb-4 shadow-neon"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TypewriterText text="Github Agent" />
        </motion.h1>
        <AnimatePresence>
          {showWelcome && (
            <motion.h2
              className="text-2xl md:text-3xl text-neon-green mb-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
            >
              Hi, Abdul Moiz
            </motion.h2>
          )}
        </AnimatePresence>
        <div className="space-y-4">
          <Link href="/chat" passHref>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="block w-full my-4 bg-cyber-dark text-neon-blue border-2 border-neon-blue rounded-md py-2 px-4 hover:bg-neon-blue hover:text-cyber-black transition-colors duration-300"
            >
              Chat with your Repos
            </motion.a>
          </Link>
          <Link href="/repositories" passHref>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="block w-full bg-cyber-dark text-neon-yellow border-2 border-neon-yellow rounded-md py-2 px-4 hover:bg-neon-yellow hover:text-cyber-black transition-colors duration-300"
            >
              Generate ReadMe
            </motion.a>
          </Link>
        </div>
      </div>
    </div>
  )
}

