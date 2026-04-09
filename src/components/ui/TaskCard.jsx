import { motion } from 'framer-motion'
import { TaskStatus } from '../../types'
import { Trash2, RotateCcw, CheckCircle, Circle } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert_dialog"

export default function TaskCard({ task, onSoftDelete, onRestore, onHardDelete, onToggleComplete }) {
  const date = new Date(task.id)
  const timestamp = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
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
            {task.status === TaskStatus.COMPLETED ? <CheckCircle className="w-5 h-5"/> : <Circle className="w-5 h-5"/>}
          </button>
        )}

        <div className="flex-1">
          <span className="text-xs text-muted-foreground font-mono tracking-tight block">
            {timestamp}
          </span>
          <p className="mt-1 text-sm text-foreground leading-relaxed transition-colors duration-300">
            {task.content}
          </p>
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

        {task.status === TaskStatus.SOFT_DELETED && onHardDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="text-muted-foreground hover:text-red-500 transition-colors" title="Permanently Delete">
                <Trash2 className="w-5 h-5" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-500 flex items-center gap-2">
                  <Trash2 className="w-5 h-5" /> Destroy Task?
                </AlertDialogTitle>
                <AlertDialogDescription className="leading-relaxed">
                  You are about to permanently delete this task. It will be wiped from existence. There is no turning back from this.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20 italic line-clamp-2 my-2">
                "{task.content}"
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onHardDelete(task.id)} className="bg-red-500 text-white hover:bg-red-600">
                  Annihilate It
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </motion.div>
  )
}
