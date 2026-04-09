import { motion } from 'framer-motion'
import { Button } from './button'
import { Paperclip, X, File as FileIcon } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'
import { extractVideoThumbnail } from '../../utils/media'

export default function TaskInput({ addTask, input, setInput, inputRef, attachments, setAttachments }) {
    const fileInputRef = useRef(null)
    const [previews, setPreviews] = useState({})

    useEffect(() => {
        let mounted = true
        const newPreviews = {}
        const generatePreviews = async () => {
             for (const file of attachments) {
                 if (file.type.startsWith('image/')) {
                     newPreviews[file.name] = URL.createObjectURL(file)
                 } else if (file.type.startsWith('video/')) {
                     const thumb = await extractVideoThumbnail(file)
                     if (thumb && mounted) newPreviews[file.name] = URL.createObjectURL(thumb)
                 } else {
                     newPreviews[file.name] = 'generic'
                 }
             }
             if (mounted) setPreviews(newPreviews)
        }
        generatePreviews()
        
        return () => {
             mounted = false
             Object.values(newPreviews).forEach(url => {
                 if (url !== 'generic') URL.revokeObjectURL(url)
             })
        }
    }, [attachments])

    const removeAttachment = (idx) => {
        const newAtts = [...attachments]
        newAtts.splice(idx, 1)
        setAttachments(newAtts)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="w-full max-w-lg mb-10 flex flex-col items-center"
        >
            {attachments.length > 0 && (
                <div className="w-full flex flex-wrap gap-2 mb-3 px-1">
                    {attachments.map((file, i) => (
                        <div key={i} className="relative bg-muted/40 border border-border rounded-lg p-1.5 pr-7 text-xs flex items-center gap-2 max-w-[160px] shadow-sm">
                            {(previews[file.name] && previews[file.name] !== 'generic') ? (
                                <img src={previews[file.name]} className="w-6 h-6 object-cover rounded shadow-[0_1px_3px_rgba(0,0,0,0.2)]" />
                            ) : (
                                <FileIcon className="w-5 h-5 text-muted-foreground p-0.5" />
                            )}
                            <span className="truncate font-medium text-foreground">{file.name}</span>
                            <button onClick={() => removeAttachment(i)} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-red-500 transition-colors">
                               <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            
            <div className="w-full flex gap-2 items-center">
                <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="p-3 rounded-xl border border-transparent hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all flex-shrink-0"
                    title="Attach Files"
                >
                    <Paperclip className="w-6 h-6" />
                </button>
                <input 
                    type="file" 
                    multiple
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={e => {
                        const added = Array.from(e.target.files)
                        if (added.length) setAttachments(prev => [...prev, ...added])
                        // Reset input value so same files inherently trigger onChange if deleted and re-added
                        e.target.value = ''
                    }} 
                />

                <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (input.trim() || attachments.length > 0) && addTask()}
                    placeholder="What needs doing?"
                    className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition"
                />
                <Button onClick={addTask} disabled={!input?.trim() && attachments.length === 0}>
                    Add
                </Button>
            </div>
        </motion.div>
    )
}