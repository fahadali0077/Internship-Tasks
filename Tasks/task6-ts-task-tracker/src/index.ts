// index.ts - TypeScript Task Tracker CLI Demo

import { TaskManager } from './TaskManager';
import { Priority, User } from './types';

console.log('========== TS TASK TRACKER ==========\n');

const manager = new TaskManager();

// Add tasks using Priority enum
manager.addTask('Buy groceries', Priority.High);
manager.addTask('Read TypeScript docs', Priority.Medium);
manager.addTask('Go jogging', Priority.Low);
manager.addTask('Complete MERN assignment', Priority.High);
manager.addTask('Clean the house', Priority.Medium);

// Complete some tasks
manager.completeTask(1);
manager.completeTask(3);

// Display all tasks
console.log('--- All Tasks ---');
manager.getAll().forEach((t) => {
  const status = t.completed ? '✅' : '⬜';
  console.log(`  [${t.id}] ${status} [${t.priority.padEnd(6)}] ${t.title}`);
});

// Sorted by priority
console.log('\n--- Sorted by Priority ---');
manager.getSorted('priority').forEach((t) => {
  console.log(`  [${t.priority}] ${t.title}`);
});

// Search
console.log('\n--- Search "mern" ---');
const results = manager.search('mern');
results.forEach((t) => console.log(`  Found: ${t.title}`));

// Group by priority
console.log('\n--- Grouped by Priority ---');
const grouped = manager.groupByPriority();
grouped.forEach((tasks, priority) => {
  console.log(`  ${priority}: ${tasks.map((t) => t.title).join(', ')}`);
});

// Stats
console.log('\n--- Stats ---');
const stats = manager.getStats();
console.log(`  Total: ${stats.total}`);
console.log(`  Completed: ${stats.completed}`);
console.log(`  High Priority: ${stats.highPriority}`);
console.log(`  Has urgent: ${stats.hasUrgent}`);
console.log(`  All done: ${stats.allDone}`);

// Intersection type demo: AssignedTask
const user: User = { id: 1, name: 'Ali Hassan', email: 'ali@example.com' };
const assigned = manager.assignTask(4, user);
console.log('\n--- Assigned Task (intersection type) ---');
console.log(`  Task: "${assigned.title}" → Assigned to: ${assigned.assignedTo.name}`);

// Error handling
console.log('\n--- Error Handling ---');
try {
  manager.removeTask(999);
} catch (err: unknown) {
  if (err instanceof Error) {
    console.log(`  Caught: ${err.message}`);
  }
}

try {
  manager.addTask('');
} catch (err: unknown) {
  if (err instanceof Error) {
    console.log(`  Caught: ${err.message}`);
  }
}

console.log('\n✅ TypeScript Task Tracker complete!');
