// TaskManager class - handles all task operations

import { Task, User, Priority, SortBy, AssignedTask } from './types'
import { findByProp, sortByKey, filterBy, groupByKey } from './generics'

export class TaskManager {
  private tasks: Task[] = []
  private nextId: number = 1

  addTask(title: string, priority: Priority = Priority.Medium, userId?: number): Task {
    if (!title.trim()) throw new Error('title cannot be empty')

    const task: Task = {
      id: this.nextId++,
      title: title.trim(),
      priority,
      date: new Date().toISOString().split('T')[0],
      completed: false,
      userId,
    }

    this.tasks.push(task)
    return task
  }

  removeTask(id: number): void {
    const index = this.tasks.findIndex((t) => t.id === id)
    if (index === -1) throw new Error(`task ${id} not found`)
    this.tasks.splice(index, 1)
  }

  completeTask(id: number): void {
    const task = findByProp(this.tasks, 'id', id)
    if (!task) throw new Error(`task ${id} not found`)
    task.completed = true
  }

  getAll(): Task[] {
    return [...this.tasks]
  }

  // sort tasks - uses generic sort for most fields
  getSorted(by: SortBy = 'priority', ascending: boolean = true): Task[] {
    if (by === 'priority') {
      const order: Record<Priority, number> = {
        [Priority.High]: 1,
        [Priority.Medium]: 2,
        [Priority.Low]: 3,
      }
      return [...this.tasks].sort((a, b) =>
        ascending ? order[a.priority] - order[b.priority] : order[b.priority] - order[a.priority]
      )
    }
    return sortByKey(this.tasks, by as keyof Task, ascending)
  }

  // search by keyword using generic filter
  search(keyword: string): Task[] {
    return filterBy(this.tasks, (t) =>
      t.title.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  groupByPriority(): Map<Priority, Task[]> {
    return groupByKey(this.tasks, 'priority')
  }

  // stats using reduce some every
  getStats() {
    const stats = this.tasks.reduce(
      (acc, task) => {
        acc.total++
        if (task.completed) acc.completed++
        if (task.priority === Priority.High) acc.highPriority++
        return acc
      },
      { total: 0, completed: 0, highPriority: 0 }
    )

    const hasUrgent = this.tasks.some((t) => t.priority === Priority.High && !t.completed)
    const allDone = this.tasks.every((t) => t.completed)

    return { ...stats, hasUrgent, allDone }
  }

  // intersection type demo - returns AssignedTask
  assignTask(taskId: number, user: User): AssignedTask {
    const task = findByProp(this.tasks, 'id', taskId)
    if (!task) throw new Error(`task ${taskId} not found`)
    return { ...task, assignedTo: user }
  }
}
