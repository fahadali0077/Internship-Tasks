// types for task tracker

// enum for priority levels
export enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

// task interface
export interface Task {
  id: number
  title: string
  priority: Priority
  date: string
  completed: boolean
  userId?: number  // optional
}

// user interface
export interface User {
  id: number
  name: string
  email: string
}

// union type for sort options
export type SortBy = 'priority' | 'date' | 'title'

// intersection type - AssignedTask is a Task plus user info
export type AssignedTask = Task & { assignedTo: User }
