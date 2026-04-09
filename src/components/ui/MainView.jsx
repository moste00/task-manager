import { useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import TaskCard from './TaskCard'
import TaskInput from './TaskInput'
import RubbishView from './RubbishView'
import { TaskStatus } from '../../types'
import useTaskList from '../hooks/use_task_list'

export default function MainView() {
  const { tasks, addTask, softDeleteTask, restoreSoftDeletedTask, hardDeleteTask, wipeSoftDeletedTasks } = useTaskList()
  const [input, setInput] = useState('')
  const [currentTab, setCurrentTab] = useState('tasks')
  const inputRef = useRef(null)


  function handleAddTask() {
    const content = input.trim()
    if (!content) return
    addTask(content)
    setInput('')
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
        addTask={handleAddTask}
        input={input}
        setInput={setInput}
        inputRef={inputRef}
      />

      {/* Task list */}
      <div className="w-full max-w-lg flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {activeTasks.map(task => (
            <TaskCard key={task.id} task={task} onSoftDelete={softDeleteTask} />
          ))}
        </AnimatePresence>
      </div>

    </div>
  )
}
