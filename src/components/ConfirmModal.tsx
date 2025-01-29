import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Repository } from "@/types"

interface ConfirmModalProps {
  repo: Repository
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ repo, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-cyber-black bg-opacity-90 flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-cyber-dark rounded-lg p-8 w-full max-w-md border-2 border-neon-blue shadow-neon"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
        >
          <h3 className="text-2xl font-bold mb-4 text-neon-yellow">CONFIRM!!!</h3>
          <p className="mb-6 text-neon-blue">Are you sure you want to generate readme for "{repo.name}"?</p>
          <div className="flex justify-end space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCancel}
              className="bg-cyber-dark text-neon-pink border-2 border-neon-pink rounded-md py-2 px-6 hover:bg-neon-pink hover:text-cyber-black transition-colors duration-300"
            >
              CANCEL
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onConfirm}
              className="bg-cyber-dark text-neon-green border-2 border-neon-green rounded-md py-2 px-6 hover:bg-neon-green hover:text-cyber-black transition-colors duration-300"
            >
              CONFIRM
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ConfirmModal

