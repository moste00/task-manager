import { motion } from 'framer-motion'
import { Button } from './button'
import { ImageIcon, X } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'

export default function TaskInput({ addTask, input, setInput, inputRef, image, setImage }) {
    const fileInputRef = useRef(null)
    const [preview, setPreview] = useState(null)

    useEffect(() => {
        if (!image) {
            setPreview(null)
            return
        }
        const url = URL.createObjectURL(image)
        setPreview(url)
        return () => URL.revokeObjectURL(url)
    }, [image])

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="w-full max-w-lg mb-10 flex flex-col items-center"
        >
            {preview && (
                <div className="relative mb-4 self-start bg-card p-1 pb-4 rounded-xl shadow-md border border-border rotate-2">
                    <img src={preview} className="h-32 w-auto object-cover rounded-lg" />
                    <button onClick={() => setImage(null)} className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 shadow-lg hover:scale-110 transition-transform">
                        <X className="w-4 h-4"/>
                    </button>
                </div>
            )}
            
            <div className="w-full flex gap-2 items-center">
                <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="p-3 rounded-xl border border-transparent hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all flex-shrink-0"
                    title="Attach Image"
                >
                    <ImageIcon className="w-6 h-6" />
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={e => {
                        if (e.target.files[0]) setImage(e.target.files[0])
                    }} 
                />

                <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (input.trim() || image) && addTask()}
                    placeholder="What needs doing?"
                    className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition"
                />
                <Button onClick={addTask} disabled={!input?.trim() && !image}>
                    Add
                </Button>
            </div>
        </motion.div>
    )
}