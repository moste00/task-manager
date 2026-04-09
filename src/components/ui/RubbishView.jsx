import { AnimatePresence, motion } from 'framer-motion'
import TaskCard from './TaskCard'

export default function RubbishView({ tasks, onRestore, onHardDelete, onGoBack }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-16">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10 w-full max-w-lg relative flex flex-col items-center"
      >
        <button 
          onClick={onGoBack}
          className="absolute left-0 top-1 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Back
        </button>

        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Recycle Bin
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {tasks.length === 0
            ? 'Bin is empty'
            : `${tasks.length} task${tasks.length === 1 ? '' : 's'} to review`}
        </p>
      </motion.div>

      {/* Task list */}
      <div className="w-full max-w-lg flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onRestore={onRestore} 
              onHardDelete={onHardDelete} 
            />
          ))}
        </AnimatePresence>
      </div>

    </div>
  )
}
