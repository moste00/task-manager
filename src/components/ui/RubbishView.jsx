import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import TaskCard from './TaskCard'
import { ArrowLeft } from 'lucide-react'
import EmptyBinModal from "./warning_modals"

export default function RubbishView({ tasks, onRestore, onHardDelete, onEmptyBin, onGoBack }) {
  const [showEmptyModal, setShowEmptyModal] = useState(false)

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-16">
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
          <ArrowLeft className="w-4 h-4" />
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

        {tasks.length > 0 && (
          <button
            onClick={() => setShowEmptyModal(true)}
            className="absolute right-0 top-1 text-sm font-semibold text-red-500 hover:text-red-400 transition-colors"
          >
            Empty Bin
          </button>
        )}
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

      <EmptyBinModal showEmptyModal={showEmptyModal} setShowEmptyModal={setShowEmptyModal} onEmptyBin={onEmptyBin} numTasks={tasks.length} />
    </div>
  )
}
