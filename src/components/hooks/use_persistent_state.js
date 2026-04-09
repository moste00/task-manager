import { useState, useEffect, useRef } from "react"

export default function usePersistentState(key, initialValue) {
    const [state, setState] = useState(() => {
        try {
            const saved = localStorage.getItem(key)
            if (saved !== null) return JSON.parse(saved)
        } catch (e) {
            console.error(`Failed to parse ${key} from local storage`, e)
        }
        return initialValue
    })

    const stateRef = useRef(state)
    const lastSavedRef = useRef(null)
    
    useEffect(() => {
        stateRef.current = state
    }, [state])

    useEffect(() => {
        const handleSave = () => {
            // Primitive throttle/deduplication to prevent adjacent rapid dual-triggers (e.g. beforeunload + visibilitychange both firing)
            const now = Date.now()
            if (lastSavedRef.current && now - lastSavedRef.current < 50) return
            lastSavedRef.current = now

            localStorage.setItem(key, JSON.stringify(stateRef.current))
        }

        window.addEventListener('beforeunload', handleSave)
        
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') handleSave()
        }
        window.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            window.removeEventListener('beforeunload', handleSave)
            window.removeEventListener('visibilitychange', handleVisibilityChange)
            handleSave()
        }
    }, [key])

    return [state, setState]
}
