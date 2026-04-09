import { motion } from 'framer-motion'
import { TaskStatus } from '../../types'
import { Trash2, RotateCcw, CheckCircle, Circle } from 'lucide-react'
import { HardTaskDeletionModal } from './warning_modals'
import { useState, useEffect } from 'react'
import { getImage } from '../../utils/db'

export default function TaskCard({ task, onSoftDelete, onRestore, onHardDelete, onToggleComplete }) {
  const date = new Date(task.id)
  const timestamp = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const [imageUrl, setImageUrl] = useState(null)

  useEffect(() => {
    let url = null
    if (task.imageId) {
      getImage(task.imageId).then(blob => {
        if (blob) {
          url = URL.createObjectURL(blob)
          setImageUrl(url)
        }
      })
    }
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [task.imageId])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{
        opacity: [1, 1, 0],
        scale: 0.2,
        x: '45vw',
        y: '45vh',
        rotate: 180,
        transition: { duration: 1, ease: "anticipate" }
      }}
      transition={{ layout: { type: 'spring', stiffness: 380, damping: 30 } }}
      className={`group relative overflow-hidden border border-border rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-all duration-200 ${task.status === TaskStatus.COMPLETED ? 'bg-muted/20 opacity-60 grayscale-[0.2]' : 'bg-card'}`}
    >
      {/* Broad Strikethrough Envelope */}
      {task.status === TaskStatus.COMPLETED && (
        <svg className="absolute inset-y-0 -inset-x-2 w-[calc(100%+16px)] h-full text-green-500/50 pointer-events-none z-10 opacity-70" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M0,52 Q40,38 100,60" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" className="drop-shadow-md" />
          <path d="M0,58 Q60,78 100,50" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      )}

      <div className="flex items-start gap-4 relative z-20">
        {(task.status === TaskStatus.ACTIVE || task.status === TaskStatus.COMPLETED) && onToggleComplete && (
          <button onClick={() => onToggleComplete(task.id)} className={`mt-0.5 flex-shrink-0 transition-colors ${task.status === TaskStatus.COMPLETED ? 'text-green-500' : 'text-muted-foreground hover:text-green-500'}`} title={task.status === TaskStatus.COMPLETED ? "Uncomplete" : "Complete"}>
            {task.status === TaskStatus.COMPLETED ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
          </button>
        )}

        <div className="flex-1">
          <span className="text-xs text-muted-foreground font-mono tracking-tight block">
            {timestamp}
          </span>
          <p className="mt-1 text-sm text-foreground leading-relaxed transition-colors duration-300">
            {task.content}
          </p>
          {imageUrl && (
            <div className="mt-4 mb-2 w-full max-w-[280px] rounded-xl overflow-hidden border border-border shadow-sm">
              <img src={imageUrl} alt="Attached context" className="w-full h-auto object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="absolute top-4 right-4 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all z-20">
        {task.status === TaskStatus.ACTIVE && onSoftDelete && (
          <button onClick={() => onSoftDelete(task.id)} className="text-muted-foreground hover:text-red-500 transition-colors" title="Delete">
            <Trash2 className="w-5 h-5" />
          </button>
        )}

        {task.status === TaskStatus.SOFT_DELETED && onRestore && (
          <button onClick={() => onRestore(task.id)} className="text-muted-foreground hover:text-green-500 transition-colors" title="Restore">
            <RotateCcw className="w-5 h-5" />
          </button>
        )}

        <HardTaskDeletionModal onHardDelete={onHardDelete} task={task} />
      </div>
    </motion.div>
  )
}
