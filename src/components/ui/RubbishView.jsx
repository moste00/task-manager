import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import TaskCard from './TaskCard'
import { ArrowLeft, Download } from 'lucide-react'
import { TaskStatus, getTaskDateCategory, TaskDateCategoryLabels } from '../../types'
import EmptyBinModal from "./warning_modals"
import ExportModal from "./ExportModal"
import { exportTasks } from '../../utils/export'

export default function RubbishView({ tasks, onRestore, onHardDelete, onEmptyBin, onGoBack }) {
  const [showEmptyModal, setShowEmptyModal] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)

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
          <div className="absolute right-0 top-0 flex flex-col items-end gap-2 text-sm font-semibold">
              <button 
                onClick={() => setShowExportMenu(true)}
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Export
              </button>
              <button 
                onClick={() => setShowEmptyModal(true)}
                className="text-red-500 hover:text-red-400 transition-colors"
              >
                Empty Bin
              </button>
          </div>
        )}
      </motion.div>

      {/* Task list */}
      <div className="w-full max-w-lg flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {(() => {
            const nodes = []
            tasks.forEach((task, index) => {
              const category = getTaskDateCategory(task.id)
              const prevCategory = index > 0 ? getTaskDateCategory(tasks[index - 1].id) : null
              
              if (category !== prevCategory) {
                nodes.push(
                  <motion.div 
                    key={`sep-${category}`} 
                    layout 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 pt-3 pb-1 w-full mx-auto max-w-[95%] opacity-70"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                      {TaskDateCategoryLabels[category]}
                    </span>
                    <div className="flex-1 h-px bg-border/80" />
                  </motion.div>
                )
              }
              
              nodes.push(
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onRestore={onRestore} 
                  onHardDelete={onHardDelete} 
                />
              )
            })
            return nodes
          })()}
        </AnimatePresence>
      </div>

      <EmptyBinModal 
        showEmptyModal={showEmptyModal} 
        setShowEmptyModal={setShowEmptyModal} 
        onEmptyBin={onEmptyBin} 
        numTasks={tasks.length} 
      />

      <ExportModal 
        open={showExportMenu} 
        onOpenChange={setShowExportMenu} 
        onExportOption={(type, incMedia) => exportTasks(tasks, type, incMedia)} 
      />
    </div>
  )
}
