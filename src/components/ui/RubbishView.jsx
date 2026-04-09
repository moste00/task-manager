import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import TaskCard from './TaskCard'

export default function RubbishView({ tasks, onRestore, onHardDelete, onEmptyBin, onGoBack }) {
  const [deleteId, setDeleteId] = useState(null)
  const [showEmptyModal, setShowEmptyModal] = useState(false)
  const [emptyText, setEmptyText] = useState('')

  const taskToDelete = tasks.find(t => t.id === deleteId)

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
              onHardDelete={() => setDeleteId(task.id)} 
            />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {/* Single Item Hard Delete Warning */}
        {deleteId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-card w-full max-w-md border border-red-500/20 shadow-2xl rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-red-500 mb-2 flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
                Destroy Task?
              </h2>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                You are about to permanently delete this task. It will be wiped from existence. There is no turning back from this.
              </p>
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20 mb-6 italic line-clamp-2">
                "{taskToDelete?.content}"
              </div>
              
              <div className="flex gap-2 justify-end">
                <button 
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 text-sm font-medium border border-border rounded-xl hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    onHardDelete(deleteId)
                    setDeleteId(null)
                  }}
                  className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-sm shadow-red-500/20"
                >
                  Annihilate It
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Delete All Modal */}
        {showEmptyModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 8 }}
              className="bg-card w-full max-w-md border-2 border-red-500/40 shadow-2xl rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500 animate-pulse" />
              
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">
                NUCLEAR OPTION
              </h2>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                You are initiating a total wipe of <strong className="text-foreground">{tasks.length} tasks</strong>. They will be vaporized. Not even a trace will remain. 
                <br/><br/>
                If you are absolutely certain, type <strong className="text-red-500 select-all font-mono">DELETE ALL</strong> below to confirm.
              </p>
              
              <input 
                autoFocus
                value={emptyText}
                onChange={e => setEmptyText(e.target.value)}
                placeholder="Type DELETE ALL to confirm"
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all font-mono mb-6"
              />

              <div className="flex gap-2 justify-end">
                <button 
                  onClick={() => {
                    setShowEmptyModal(false)
                    setEmptyText('')
                  }}
                  className="px-4 py-2 text-sm font-medium border border-border rounded-xl hover:bg-muted transition-colors"
                >
                  Abort
                </button>
                <button 
                  disabled={emptyText !== 'DELETE ALL'}
                  onClick={() => {
                    onEmptyBin()
                    setShowEmptyModal(false)
                    setEmptyText('')
                  }}
                  className="px-4 py-2 text-sm font-bold bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:hover:bg-red-500 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-500/20"
                >
                  Nuke Everything
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
