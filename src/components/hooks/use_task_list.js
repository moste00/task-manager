import { useState } from "react"
import { TaskStatus } from "../../types"

function useTaskList() {
    const [tasks, setTasks] = useState([])
    function addTask(content) {
        setTasks(prev => [{ id: Date.now(), content, status: TaskStatus.ACTIVE }, ...prev])
    }

    function softDeleteTask(taskId) {
        setTasks(prev => prev.map(t =>
            t.id === taskId ? { ...t, status: TaskStatus.SOFT_DELETED } : t
        ))
    }

    function restoreSoftDeletedTask(taskId) {
        setTasks(prev => prev.map(t =>
            t.id === taskId ? { ...t, status: TaskStatus.ACTIVE } : t
        ))
    }

    function hardDeleteTask(taskId) {
        setTasks(prev => prev.filter(t => t.id !== taskId))
    }

    function wipeSoftDeletedTasks() {
        setTasks(prev => prev.filter(t => t.status !== TaskStatus.SOFT_DELETED))
    }

    return { tasks, addTask, softDeleteTask, restoreSoftDeletedTask, hardDeleteTask, wipeSoftDeletedTasks }
}

export default useTaskList