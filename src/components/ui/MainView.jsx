import { useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import TaskCard from './TaskCard'
import TaskInput from './TaskInput'
import RubbishView from './RubbishView'
import { TaskStatus } from '../../types'

export default function MainView() {
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState('')
  const [currentTab, setCurrentTab] = useState('tasks')
  const inputRef = useRef(null)

  function addTask() {
    const content = input.trim()
    if (!content) return
    setTasks(prev => [{ id: Date.now(), content, status: TaskStatus.ACTIVE }, ...prev])
    setInput('')
    inputRef.current?.focus()
  }

  function handleSoftDelete(taskId) {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: TaskStatus.SOFT_DELETED } : t
    ))
  }

  function handleRestore(taskId) {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: TaskStatus.ACTIVE } : t
    ))
  }

  function handleHardDelete(taskId) {
    setTasks(prev => prev.filter(t => t.id !== taskId))
  }

  if (currentTab === 'rubbish') {
    return (
      <RubbishView 
        tasks={tasks.filter(t => t.status === TaskStatus.SOFT_DELETED)} 
        onRestore={handleRestore}
        onHardDelete={handleHardDelete}
        onGoBack={() => setCurrentTab('tasks')}
      />
    )
  }

  const activeTasks = tasks.filter(t => t.status === TaskStatus.ACTIVE)

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-16">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10 text-center"
      >
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Tasks
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {activeTasks.length === 0
            ? 'Nothing here yet'
            : `${activeTasks.length} task${activeTasks.length === 1 ? '' : 's'}`}
        </p>
        
        {tasks.some(t => t.status === TaskStatus.SOFT_DELETED) && (
          <button 
            onClick={() => setCurrentTab('rubbish')}
            className="absolute right-0 top-1 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            Recycle Bin
          </button>
        )}
      </motion.div>

      <TaskInput
        addTask={addTask}
        input={input}
        setInput={setInput}
        inputRef={inputRef}
      />

      {/* Task list */}
      <div className="w-full max-w-lg flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {activeTasks.map(task => (
            <TaskCard key={task.id} task={task} onSoftDelete={handleSoftDelete} />
          ))}
        </AnimatePresence>
      </div>

    </div>
  )
}
