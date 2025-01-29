"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import ConfirmModal from "@/components/ConfirmModal"
import type { Repository } from "@/types"
import { RepositoryCard } from "@/components/RepoCard"
import axios from "axios"

export default function Repositories() {
  const [repos, setRepos] = useState<Repository[]>([])
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

 
  useEffect(() => {
    const fetchRepos = async () => {
     const res=await axios.get('/api/fetch-repo')
     if(res.data.success)
      setRepos(res.data.repos)
    }
    fetchRepos()
  }, [])

  const handleDecrypt = (repo: Repository) => {
    setSelectedRepo(repo)
setShowConfirmModal(true)
     
  }

  const handleConfirmDecrypt = () => {
    if (selectedRepo) {
      
    }
    setShowConfirmModal(false)
  }

  const filteredRepos = repos.filter((repo) => repo.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-cyber-black text-neon-blue p-8"
    >
      <Link
        href="/"
        className="text-neon-blue mb-8 flex items-center hover:text-neon-pink transition-colors duration-300"
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
        RETURN TO MAINFRAME
      </Link>
      <h1 className="text-4xl font-bold mb-8 text-center text-neon-green">Generate ReadMe</h1>
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search Repositories"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-cyber-dark text-neon-blue border-2 border-neon-blue rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-neon-pink"
        />
      </div>
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredRepos.map((repo) => (
            <RepositoryCard key={repo.id} repo={repo} onDecrypt={handleDecrypt} />
          ))}
        </AnimatePresence>
      </motion.div>
      { showConfirmModal && selectedRepo &&  (
        <ConfirmModal
          repo={selectedRepo}
          onConfirm={handleConfirmDecrypt}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}


      
    </motion.div>
  )
}




 