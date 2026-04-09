export const TaskStatus = Object.freeze({
    ACTIVE: 'active',
    COMPLETED: 'completed',
    SOFT_DELETED: 'soft_deleted',
})

export const TaskDateCategory = Object.freeze({
    TODAY: 'today',
    YESTERDAY: 'yesterday',
    EARLIER_THIS_WEEK: 'earlier_this_week',
    EARLIER_THIS_MONTH: 'earlier_this_month',
    EARLIER_THIS_YEAR: 'earlier_this_year',
    LONG_AGO: 'long_ago',
})

export const TaskDateCategoryLabels = Object.freeze({
    [TaskDateCategory.TODAY]: 'Today',
    [TaskDateCategory.YESTERDAY]: 'Yesterday',
    [TaskDateCategory.EARLIER_THIS_WEEK]: 'Earlier this week',
    [TaskDateCategory.EARLIER_THIS_MONTH]: 'Earlier this month',
    [TaskDateCategory.EARLIER_THIS_YEAR]: 'Earlier this year',
    [TaskDateCategory.LONG_AGO]: 'A long time ago',
})

export function getTaskDateCategory(timestamp) {
    const date = new Date(timestamp)
    const now = new Date()

    // Normalize to midnight to compute clean absolute day differences
    const dateMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const diffMs = nowMidnight - dateMidnight
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays <= 0) return TaskDateCategory.TODAY
    if (diffDays === 1) return TaskDateCategory.YESTERDAY
    if (diffDays < 7) return TaskDateCategory.EARLIER_THIS_WEEK

    if (date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()) {
        return TaskDateCategory.EARLIER_THIS_MONTH
    }

    if (date.getFullYear() === now.getFullYear()) {
        return TaskDateCategory.EARLIER_THIS_YEAR
    }

    return TaskDateCategory.LONG_AGO
}