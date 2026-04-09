import { motion } from 'framer-motion'

export default function TaskCard({ task }) {
  const date = new Date(task.id)
  const timestamp = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      className="group relative bg-card border border-border rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      {/* Timestamp badge */}
      <span className="text-xs text-muted-foreground font-mono tracking-tight">
        {timestamp}
      </span>

      {/* Task content */}
      <p className="mt-1 text-sm text-foreground leading-relaxed">
        {task.content}
      </p>
    </motion.div>
  )
}
