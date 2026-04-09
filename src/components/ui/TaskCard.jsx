import { motion } from 'framer-motion'
import { TaskStatus } from '../../types'

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
  </svg>
)

const RestoreIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
  </svg>
)

export default function TaskCard({ task, onSoftDelete, onRestore, onHardDelete }) {
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

      {/* Actions */}
      <div className="absolute top-4 right-4 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
        {task.status === TaskStatus.ACTIVE && onSoftDelete && (
          <button onClick={() => onSoftDelete(task.id)} className="text-muted-foreground hover:text-red-500 transition-colors" title="Delete">
            <TrashIcon />
          </button>
        )}
        {task.status === TaskStatus.SOFT_DELETED && onRestore && (
          <button onClick={() => onRestore(task.id)} className="text-muted-foreground hover:text-green-500 transition-colors" title="Restore">
            <RestoreIcon />
          </button>
        )}
        {task.status === TaskStatus.SOFT_DELETED && onHardDelete && (
          <button onClick={() => onHardDelete(task.id)} className="text-muted-foreground hover:text-red-500 transition-colors" title="Permanently Delete">
            <TrashIcon />
          </button>
        )}
      </div>
    </motion.div>
  )
}
