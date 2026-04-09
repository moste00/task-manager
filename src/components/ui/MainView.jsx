import { useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from './button'
import TaskCard from './TaskCard'

export default function MainView() {
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState('')
  const inputRef = useRef(null)

  function addTask() {
    const content = input.trim()
    if (!content) return
    setTasks(prev => [{ id: Date.now(), content }, ...prev])
    setInput('')
    inputRef.current?.focus()
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') addTask()
  }

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
          {tasks.length === 0
            ? 'Nothing here yet'
            : `${tasks.length} task${tasks.length === 1 ? '' : 's'}`}
        </p>
      </motion.div>

      {/* Input row */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="w-full max-w-lg flex gap-2 mb-10"
      >
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What needs doing?"
          className="flex-1 bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition"
        />
        <Button onClick={addTask} disabled={!input.trim()}>
          Add
        </Button>
      </motion.div>

      {/* Task list */}
      <div className="w-full max-w-lg flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </AnimatePresence>
      </div>

    </div>
  )
}
