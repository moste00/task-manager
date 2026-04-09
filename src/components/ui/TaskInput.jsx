import { motion } from 'framer-motion'
import { Button } from './button'

export default function TaskInput({ addTask, input, setInput, inputRef }) {
    return (
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
                onKeyDown={e => e.key === 'Enter' && addTask()}
                placeholder="What needs doing?"
                className="flex-1 bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition"
            />
            <Button onClick={addTask} disabled={!input?.trim()}>
                Add
            </Button>
        </motion.div>
    )
}