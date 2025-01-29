"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import type { Message } from "@/types"

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => (
  <motion.div
    className={`mb-4 p-3 rounded-lg max-w-[80%] ${
      message.sender === "user" ? "bg-neon-pink text-cyber-black ml-auto" : "bg-neon-blue text-cyber-black"
    }`}
    initial={{ opacity: 0, x: message.sender === "user" ? 50 : -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
  >
    <p className="break-words">{message.text}</p>
    <span className="text-xs opacity-70 mt-1 block text-right">
      {new Date(Number.parseInt(message.id)).toLocaleTimeString()}
    </span>
  </motion.div>
)

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [])

  const handleSend = () => {
    if (input.trim()) {
      const newUserMessage: Message = { id: Date.now().toString(), text: input, sender: "user" }
      setMessages((prev) => [...prev, newUserMessage])
      setInput("")

      // Simulated AI response
      setTimeout(() => {
        const aiResponses = [
          "Acknowledged. Proceeding with data analysis.",
          "Request processed. Initiating system scan.",
          "Command received. Executing protocol Alpha-7.",
          "Data packet intercepted. Decryption in progress.",
          "Neural link established. Awaiting further instructions.",
        ]
        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
        const newAiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: randomResponse,
          sender: "ai",
        }
        setMessages((prev) => [...prev, newAiMessage])
      }, 1000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-cyber-black flex flex-col p-4"
    >
      <Link
        href="/"
        className="text-neon-blue mb-4 flex items-center hover:text-neon-pink transition-colors duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        DISCONNECT
      </Link>
      <div className="flex-grow bg-cyber-dark rounded-lg shadow-neon p-4 mb-4 overflow-y-auto">
        <AnimatePresence>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSend()
          }}
          placeholder="ENTER COMMAND"
          className="flex-grow mr-2 bg-cyber-dark text-neon-green border-2 border-neon-green rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-neon-green"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          className="bg-neon-green text-cyber-black rounded-md py-2 px-4 hover:bg-neon-blue transition-colors duration-300"
        >
          SEND
        </motion.button>
      </div>
    </motion.div>
  )
}

