"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import type { Message, Repository } from "@/types"
import axios from "axios"
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
  const [repos, setRepos] = useState<Repository[]>([])
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    const fetchRepos = async () => {
     const res=await axios.get('/api/fetch-repo')
     if(res.data.success)
      setRepos(res.data.repos)
    }
    fetchRepos()
  }, [])


  useEffect(scrollToBottom, [messagesEndRef])

  const handleSend = async () => {
    if (input.trim() && selectedRepo) {
      const newUserMessage: Message = {
        id: Date.now().toString(),
        text: input,
        sender: "user",
      };
      setMessages((prev) => [...prev, newUserMessage]);
      setInput("");
  
      try {
        // Call your backend API for POST request
        const response = await axios.post(`/api/generate-readme/${selectedRepo.id}`, { message: input });
  
        if (response.data.success) {
          const newAiMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: response.data.response,
            sender: "ai",
          };
          setMessages((prev) => [...prev, newAiMessage]);
        } else {
          // Handle any error response from the backend
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: "Something went wrong, please try again.",
            sender: "ai",
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      } catch (error) {
        console.error(error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Failed to get AI response, please try again later.",
          sender: "ai",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    }
  };
  

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
      <div className="mb-4">
        <select
          value={selectedRepo?.id || ""}
          onChange={(e) => {
            const repo = repos.find((r) => r.id === Number.parseInt(e.target.value))
            setSelectedRepo(repo || null)
            setMessages([])
          }}
          className="w-full bg-cyber-dark text-neon-green border-2 border-neon-green rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-neon-green"
        >
          <option value="">SELECT REPOSITORY</option>
          {repos.map((repo) => (
            <option key={repo.id} value={repo.id}>
              {repo.name}
            </option>
          ))}
        </select>
      </div>
      {selectedRepo && (
        <div className="text-neon-yellow text-xl font-bold mb-4 text-center">ACTIVE REPO: {selectedRepo.name}</div>
      )}
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
          placeholder={selectedRepo ? "ENTER COMMAND" : "SELECT A REPOSITORY FIRST"}
          disabled={!selectedRepo}
          className="flex-grow mr-2 bg-cyber-dark text-neon-green border-2 border-neon-green rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-neon-green disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={!selectedRepo}
          className="bg-neon-green text-cyber-black rounded-md py-2 px-4 hover:bg-neon-blue transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          SEND
        </motion.button>
      </div>
    </motion.div>
  )
}

