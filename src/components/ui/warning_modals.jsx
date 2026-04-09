import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./alert_dialog"
import { useState } from "react"

export default function EmptyBinModal({ showEmptyModal, setShowEmptyModal, onEmptyBin, numTasks }) {
    const [emptyText, setEmptyText] = useState('')

    return <AlertDialog open={showEmptyModal} onOpenChange={open => {
        setShowEmptyModal(open)
        if (!open) setEmptyText('')
    }}>
        <AlertDialogContent className="border-red-500/30 shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500 animate-pulse" />
            <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-black text-foreground tracking-tight mb-2">
                    NUCLEAR OPTION
                </AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed">
                    You are initiating a total wipe of <strong className="text-foreground">{numTasks} tasks</strong>. They will be vaporized. Not even a trace will remain.
                    <br /><br />
                    If you are absolutely certain, type <strong className="text-red-500 select-all font-mono">DELETE ALL</strong> below to confirm.
                </AlertDialogDescription>
            </AlertDialogHeader>

            <input
                autoFocus
                value={emptyText}
                onChange={e => setEmptyText(e.target.value)}
                placeholder="Type DELETE ALL to confirm"
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all font-mono mb-4"
            />

            <AlertDialogFooter>
                <AlertDialogCancel>Abort</AlertDialogCancel>
                <AlertDialogAction
                    disabled={emptyText !== 'DELETE ALL'}
                    onClick={() => {
                        onEmptyBin()
                        setShowEmptyModal(false)
                    }}
                    className="bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:hover:bg-red-500 shadow-lg shadow-red-500/20"
                >
                    Nuke Everything
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}