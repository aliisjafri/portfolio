import { MouseEvent } from 'react'
import { motion } from 'framer-motion'

interface ButtonProps {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  children: React.ReactNode
}

const MotionButton = ({ onClick, children }: ButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.2 }}
    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    className="bg-black px-2 font-bold rounded"
    onClick={onClick}
  >
    {children}
  </motion.button>
)

export default MotionButton
