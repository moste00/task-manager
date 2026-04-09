import { useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Trash2, Trash, Download } from 'lucide-react'
import TaskCard from './TaskCard'
import TaskInput from './TaskInput'
import RubbishView from './RubbishView'
import { TaskStatus, getTaskDateCategory, TaskDateCategoryLabels } from '../../types'
import useTaskList from '../hooks/use_task_list'
import { exportTasks } from '../../utils/export'
import ExportModal from './ExportModal'

export default function MainView() {
  const { tasks, addTask, softDeleteTask, restoreSoftDeletedTask, hardDeleteTask, wipeSoftDeletedTasks, toggleCompleteTask } = useTaskList()
  const [input, setInput] = useState('')
  const [image, setImage] = useState(null)
  const [currentTab, setCurrentTab] = useState('tasks')
  const [showExportMenu, setShowExportMenu] = useState(false)
  const inputRef = useRef(null)


  function handleAddTask() {
    const content = input.trim()
    if (!content && !image) return
    addTask(content, image)
    setInput('')
    setImage(null)
    inputRef.current?.focus()
  }

  if (currentTab === 'rubbish') {
    return (
      <RubbishView
        tasks={tasks.filter(t => t.status === TaskStatus.SOFT_DELETED)}
        onRestore={restoreSoftDeletedTask}
        onHardDelete={hardDeleteTask}
        onEmptyBin={wipeSoftDeletedTasks}
        onGoBack={() => setCurrentTab('tasks')}
      />
    )
  }

  const activeAndCompletedTasks = tasks
    .filter(t => t.status === TaskStatus.ACTIVE || t.status === TaskStatus.COMPLETED)
    .sort((a, b) => {
      if (a.status === b.status) return b.id - a.id
      return a.status === TaskStatus.ACTIVE ? -1 : 1
    })

  const completedCount = activeAndCompletedTasks.filter(t => t.status === TaskStatus.COMPLETED).length

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-16">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10 w-full max-w-lg text-center relative"
      >
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Tasks
        </h1>
        {activeAndCompletedTasks.length > 0 && (
          <button onClick={() => setShowExportMenu(true)} className="absolute left-0 top-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
             <Download className="w-4 h-4" /> Export
          </button>
        )}
        <p className="text-sm text-muted-foreground mt-1">
          {activeAndCompletedTasks.length === 0
            ? 'Nothing here yet'
            : `${activeAndCompletedTasks.length} task${activeAndCompletedTasks.length === 1 ? '' : 's'}${completedCount > 0 ? ` (${completedCount} completed)` : ''}`}
        </p>
      </motion.div>

      <TaskInput
        addTask={handleAddTask}
        input={input}
        setInput={setInput}
        inputRef={inputRef}
        image={image}
        setImage={setImage}
      />

      {/* Task list */}
      <div className="w-full max-w-lg flex flex-col gap-3 pb-24">
        <AnimatePresence mode="popLayout">
          {activeAndCompletedTasks.map((task, index) => {
            const category = getTaskDateCategory(task.id)
            const prevCategory = index > 0 ? getTaskDateCategory(activeAndCompletedTasks[index - 1].id) : null
            const isDifferentCategory = category !== prevCategory

            return (
              <motion.div 
                key={task.id} 
                layout 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="w-full flex flex-col gap-3"
              >
                {isDifferentCategory && (
                  <div className="flex items-center gap-3 pt-3 pb-1 w-full mx-auto max-w-[95%] opacity-70">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                      {TaskDateCategoryLabels[category]}
                    </span>
                    <div className="flex-1 h-px bg-border/80" />
                  </div>
                )}
                <TaskCard task={task} onSoftDelete={softDeleteTask} onToggleComplete={toggleCompleteTask} />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {currentTab === 'tasks' && (
        <button 
          onClick={() => setCurrentTab('rubbish')}
          title="Recycle Bin"
          className="fixed bottom-8 right-8 w-14 h-14 bg-card border border-border rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center text-muted-foreground hover:text-foreground hover:scale-110 transition-all z-50 group"
        >
          {tasks.filter(t => t.status === TaskStatus.SOFT_DELETED).length > 0 ? (
            <Trash className="w-6 h-6 text-foreground transition-all" fill="currentColor" />
          ) : (
            <Trash className="w-6 h-6" fill="none" />
          )}
        </button>
      )}

      <ExportModal 
        open={showExportMenu} 
        onOpenChange={setShowExportMenu} 
        onExportOption={(type, incMedia) => exportTasks(activeAndCompletedTasks, type, incMedia)} 
      />

    </div>
  )
}
