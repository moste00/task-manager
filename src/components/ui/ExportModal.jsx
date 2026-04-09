import { Download } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert_dialog"

export default function ExportModal({ open, onOpenChange, onExportOption }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-muted-foreground" /> Export Tasks
          </AlertDialogTitle>
          <AlertDialogDescription>
            Choose your preferred export format. If you choose to include media, images will be automatically downloaded alongside the file as separate elements.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid grid-cols-2 gap-3 mt-4 mb-2">
           <button onClick={() => { onExportOption('markdown', false); onOpenChange(false) }} className="p-4 border border-border rounded-xl hover:bg-muted transition text-sm flex flex-col items-center gap-1 active:scale-95 shadow-sm">
              <strong className="text-foreground">Markdown</strong>
              <span className="text-muted-foreground text-xs text-center">Text only (Standard to-do list)</span>
           </button>
           <button onClick={() => { onExportOption('markdown', true); onOpenChange(false) }} className="p-4 border border-border rounded-xl hover:bg-muted transition text-sm flex flex-col items-center gap-1 active:scale-95 shadow-sm">
              <strong className="text-foreground text-center">Markdown + Media</strong>
              <span className="text-muted-foreground text-center text-xs">Text & Raw Image Files</span>
           </button>
           <button onClick={() => { onExportOption('csv', false); onOpenChange(false) }} className="p-4 border border-border rounded-xl hover:bg-muted transition text-sm flex flex-col items-center gap-1 active:scale-95 shadow-sm">
              <strong className="text-foreground">CSV</strong>
              <span className="text-muted-foreground text-xs text-center">Text only (Spreadsheet)</span>
           </button>
           <button onClick={() => { onExportOption('csv', true); onOpenChange(false) }} className="p-4 border border-border rounded-xl hover:bg-muted transition text-sm flex flex-col items-center gap-1 active:scale-95 shadow-sm">
              <strong className="text-foreground">CSV + Media</strong>
              <span className="text-muted-foreground text-center text-xs">Spreadsheet & Raw Images</span>
           </button>
        </div>

        <div className="flex justify-end mt-2 pt-4 border-t border-border">
           <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
