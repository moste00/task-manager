import { getImage } from './db'
import { TaskStatus } from '../types'

export async function exportTasks(tasks, type = 'markdown', includeMedia = false) {
    let content = ''
    let mime = ''
    let filename = ''
    
    if (type === 'markdown') {
        content = `# Task List Export\n\n`
        tasks.forEach(task => {
            const isChecked = task.status === TaskStatus.COMPLETED ? 'x' : ' '
            let mediaNote = ''
            if (task.imageId && includeMedia) mediaNote = `\n  - *(Media included: ${task.imageId})*`
            content += `- [${isChecked}] ${task.content}${mediaNote}\n`
        })
        mime = 'text/markdown;charset=utf-8;'
        filename = 'tasks.md'
    } else {
        // csv
        content = `"Status","Content","Created At","Media ID"\n`
        tasks.forEach(task => {
            const status = task.status
            const text = task.content.replace(/"/g, '""')
            const date = new Date(task.id).toISOString()
            const media = (includeMedia && task.imageId) ? task.imageId : ''
            content += `"${status}","${text}","${date}","${media}"\n`
        })
        mime = 'text/csv;charset=utf-8;'
        filename = 'tasks.csv'
    }

    // Download Main Text Output
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([content], { type: mime }))
    a.download = filename
    a.click()
    URL.revokeObjectURL(a.href)

    // Eagerly cycle and individually download specific media blobs if requested
    if (includeMedia) {
        for (const task of tasks) {
            if (task.imageId) {
                const blob = await getImage(task.imageId)
                if (blob) {
                    const mediaA = document.createElement('a')
                    mediaA.href = URL.createObjectURL(blob)
                    
                    let ext = 'jpg'
                    if (blob.type === 'image/png') ext = 'png'
                    if (blob.type === 'image/webp') ext = 'webp'
                    if (blob.type === 'image/gif') ext = 'gif'
                    
                    mediaA.download = `${task.imageId}.${ext}`
                    mediaA.click()
                    URL.revokeObjectURL(mediaA.href)
                    
                    // Minor stall to ensure browser catches multiple unique downloads correctly without collision
                    await new Promise(r => setTimeout(r, 200))
                }
            }
        }
    }
}
