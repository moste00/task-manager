import { TaskStatus } from "../../types"
import usePersistentState from "./use_persistent_state"
import { saveImage, deleteImage } from "../../utils/db"
import { extractVideoThumbnail } from "../../utils/media"

function useTaskList() {
    const [tasks, setTasks] = usePersistentState('task_manager_tasks', [])
    async function addTask(content, attachedFiles = []) {
        const id = Date.now()
        const parsedAttachments = []

        for (const file of attachedFiles) {
            const fileId = `file_${id}_${Math.random().toString(36).substr(2, 9)}`
            let thumbId = null
            
            const isVideo = file.type.startsWith('video/')
            const isImage = file.type.startsWith('image/')
            const isVisual = isImage || isVideo

            try {
                await saveImage(fileId, file)
                if (isVideo) {
                    const thumbBlob = await extractVideoThumbnail(file)
                    if (thumbBlob) {
                        thumbId = `thumb_${fileId}`
                        await saveImage(thumbId, thumbBlob)
                    }
                }
            } catch (e) {
                console.error("Failed storing attachment", e)
                continue
            }

            parsedAttachments.push({
                id: fileId,
                name: file.name,
                type: file.type,
                size: file.size,
                isVisual,
                thumbId
            })
        }
        
        setTasks(prev => [{ id, content, status: TaskStatus.ACTIVE, attachments: parsedAttachments }, ...prev])
    }

    function softDeleteTask(taskId) {
        setTasks(prev => prev.map(t =>
            t.id === taskId ? { ...t, status: TaskStatus.SOFT_DELETED } : t
        ))
    }

    function toggleCompleteTask(taskId) {
        setTasks(prev => prev.map(t => {
            if (t.id !== taskId) return t;
            if (t.status === TaskStatus.ACTIVE) return { ...t, status: TaskStatus.COMPLETED };
            if (t.status === TaskStatus.COMPLETED) return { ...t, status: TaskStatus.ACTIVE };
            return t;
        }))
    }

    function restoreSoftDeletedTask(taskId) {
        setTasks(prev => prev.map(t =>
            t.id === taskId ? { ...t, status: TaskStatus.ACTIVE } : t
        ))
    }

    function hardDeleteTask(taskId) {
        setTasks(prev => {
            const task = prev.find(t => t.id === taskId)
            if (task && task.attachments) {
                 task.attachments.forEach(att => {
                     deleteImage(att.id).catch(console.error)
                     if (att.thumbId) deleteImage(att.thumbId).catch(console.error)
                 })
            }
            return prev.filter(t => t.id !== taskId)
        })
    }

    function wipeSoftDeletedTasks() {
        setTasks(prev => {
            prev.forEach(task => {
                if (task.status === TaskStatus.SOFT_DELETED && task.attachments) {
                    task.attachments.forEach(att => {
                        deleteImage(att.id).catch(console.error)
                        if (att.thumbId) deleteImage(att.thumbId).catch(console.error)
                    })
                }
            })
            return prev.filter(t => t.status !== TaskStatus.SOFT_DELETED)
        })
    }

    return { tasks, addTask, softDeleteTask, restoreSoftDeletedTask, hardDeleteTask, wipeSoftDeletedTasks, toggleCompleteTask }
}

export default useTaskList