import { motion } from 'framer-motion'
import { TaskStatus } from '../../types'
import { Trash2, RotateCcw, CheckCircle, Circle, Play as PlayIcon, File as FileIcon } from 'lucide-react'
import { HardTaskDeletionModal } from './warning_modals'
import { useState, useEffect } from 'react'
import { getImage } from '../../utils/db'

export default function TaskCard({ task, onSoftDelete, onRestore, onHardDelete, onToggleComplete }) {
  const date = new Date(task.id)
  const timestamp = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const [visualUrls, setVisualUrls] = useState({})

  useEffect(() => {
    let mounted = true
    const urls = {}
    
    if (!task.attachments) return
    
    const loadVisuals = async () => {
        for (const att of task.attachments) {
            if (att.isVisual) {
                const blobId = att.thumbId || att.id
                const blob = await getImage(blobId)
                if (blob && mounted) urls[att.id] = URL.createObjectURL(blob)
            }
        }
        if (mounted) setVisualUrls(urls)
    }
    loadVisuals()
    return () => {
        mounted = false
        Object.values(urls).forEach(url => URL.revokeObjectURL(url))
    }
  }, [task.attachments])

  const handleOpenArbitraryFile = async (fileId) => {
      const blob = await getImage(fileId)
      if (blob) {
          const url = URL.createObjectURL(blob)
          window.open(url, '_blank')
          setTimeout(() => URL.revokeObjectURL(url), 10000)
      }
  }

  const visuals = (task.attachments || []).filter(a => a.isVisual)
  const arbitraryFiles = (task.attachments || []).filter(a => !a.isVisual)
  const mainVisual = visuals[0]
  const otherVisuals = visuals.slice(1)

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
          
          {visuals.length > 0 && (
            <div className="mt-4 mb-2 flex gap-2 h-28 max-w-[320px]">
              <div className="flex-1 rounded-xl overflow-hidden border border-border bg-muted/20 relative">
                 {visualUrls[mainVisual.id] && <img src={visualUrls[mainVisual.id]} className="absolute inset-0 w-full h-full object-cover" />}
                 {mainVisual.thumbId && <div className="absolute inset-0 flex items-center justify-center bg-black/40"><PlayIcon className="w-8 h-8 text-white fill-white" /></div>}
              </div>

              {otherVisuals.length > 0 && (
                 <div className="grid grid-cols-2 grid-rows-2 gap-[3px] w-28 h-full rounded-xl overflow-hidden flex-shrink-0 border border-border bg-border">
                    {[0, 1, 2, 3].map(i => {
                       if (i === 3 && otherVisuals.length > 4) {
                           return <div key={i} className="bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground pointer-events-none">+{otherVisuals.length - 3}</div>
                       }
                       const v = otherVisuals[i]
                       if (v && visualUrls[v.id]) {
                           return (
                              <div key={i} className="relative w-full h-full">
                                <img src={visualUrls[v.id]} className="w-full h-full object-cover" />
                                {v.thumbId && <div className="absolute inset-0 flex items-center justify-center bg-black/40"><PlayIcon className="w-4 h-4 text-white fill-white" /></div>}
                              </div>
                           )
                       }
                       return <div key={i} className="bg-card w-full h-full" />
                    })}
                 </div>
              )}
            </div>
          )}

          {arbitraryFiles.length > 0 && (
            <div className="mt-2 flex flex-col gap-1.5 w-full max-w-[280px]">
               {arbitraryFiles.map(f => (
                   <button onClick={() => handleOpenArbitraryFile(f.id)} key={f.id} className="text-left flex items-center gap-2.5 p-2 px-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/60 transition truncate w-full shadow-sm">
                       <FileIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                       <div className="flex-1 truncate flex items-center justify-between text-xs min-w-0">
                          <span className="text-foreground tracking-tight truncate mr-2">{f.name}</span>
                          <span className="text-muted-foreground font-mono">{(f.size/1024).toFixed(0)}KB</span>
                       </div>
                   </button>
               ))}
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
