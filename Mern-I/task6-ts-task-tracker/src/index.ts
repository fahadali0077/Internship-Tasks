// ts task tracker demo

import { TaskManager } from './TaskManager'
import { Priority, User } from './types'

console.log('=== TS TASK TRACKER ===\n')

const manager = new TaskManager()

// add tasks using Priority enum
manager.addTask('Buy groceries', Priority.High)
manager.addTask('Read TypeScript docs', Priority.Medium)
manager.addTask('Go jogging', Priority.Low)
manager.addTask('Complete MERN assignment', Priority.High)
manager.addTask('Clean the house', Priority.Medium)

manager.completeTask(1)
manager.completeTask(3)

console.log('all tasks:')
manager.getAll().forEach((t) => {
  const status = t.completed ? '[done]' : '[todo]'
  console.log(`  ${t.id} ${status} [${t.priority}] ${t.title}`)
})

console.log('\nsorted by priority:')
manager.getSorted('priority').forEach((t) => {
  console.log(`  [${t.priority}] ${t.title}`)
})

console.log('\nsearch "mern":')
manager.search('mern').forEach((t) => console.log('  found: ' + t.title))

console.log('\ngrouped by priority:')
const grouped = manager.groupByPriority()
grouped.forEach((tasks, priority) => {
  console.log(`  ${priority}: ${tasks.map((t) => t.title).join(', ')}`)
})

console.log('\nstats:')
const stats = manager.getStats()
console.log('  total: ' + stats.total)
console.log('  completed: ' + stats.completed)
console.log('  high priority: ' + stats.highPriority)
console.log('  has urgent: ' + stats.hasUrgent)
console.log('  all done: ' + stats.allDone)

// intersection type demo
const user: User = { id: 1, name: 'Ali Hassan', email: 'ali@example.com' }
const assigned = manager.assignTask(4, user)
console.log('\nassigned task (intersection type):')
console.log(`  "${assigned.title}" assigned to ${assigned.assignedTo.name}`)

// error handling
console.log('\nerror handling:')
try {
  manager.removeTask(999)
} catch (err: unknown) {
  if (err instanceof Error) {
    console.log('  caught: ' + err.message)
  }
}

try {
  manager.addTask('')
} catch (err: unknown) {
  if (err instanceof Error) {
    console.log('  caught: ' + err.message)
  }
}

console.log('\ndone!')
