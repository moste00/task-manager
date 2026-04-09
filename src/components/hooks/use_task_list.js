import { TaskStatus } from "../../types"
import usePersistentState from "./use_persistent_state"
import { saveImage, deleteImage } from "../../utils/db"

function useTaskList() {
    const [tasks, setTasks] = usePersistentState('task_manager_tasks', [])
    function addTask(content, imageFile) {
        const id = Date.now()
        let imageId = null
        if (imageFile) {
            imageId = `img_${id}`
            saveImage(imageId, imageFile).catch(console.error)
        }
        setTasks(prev => [{ id, content, status: TaskStatus.ACTIVE, imageId }, ...prev])
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
            if (task && task.imageId) deleteImage(task.imageId).catch(console.error)
            return prev.filter(t => t.id !== taskId)
        })
    }

    function wipeSoftDeletedTasks() {
        setTasks(prev => {
            prev.forEach(task => {
                if (task.status === TaskStatus.SOFT_DELETED && task.imageId) {
                    deleteImage(task.imageId).catch(console.error)
                }
            })
            return prev.filter(t => t.status !== TaskStatus.SOFT_DELETED)
        })
    }

    return { tasks, addTask, softDeleteTask, restoreSoftDeletedTask, hardDeleteTask, wipeSoftDeletedTasks, toggleCompleteTask }
}

export default useTaskList