// types.ts - Interfaces, Enums, and Type definitions

// Enum for task priority
export enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

// Interface for a Task
export interface Task {
  id: number;
  title: string;
  priority: Priority;
  date: string;
  completed: boolean;
  userId?: number; // optional
}

// Interface for a User
export interface User {
  id: number;
  name: string;
  email: string;
}

// Union type for sort options
export type SortBy = 'priority' | 'date' | 'title';

// Intersection type: an AssignedTask is a Task combined with user info
export type AssignedTask = Task & { assignedTo: User };
