// Task Tracker CLI App
// Demonstrates: JSON, closures, reduce/some/every, error handling, process.stdin

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const TASKS_FILE = path.join(__dirname, 'tasks.json');

// ---- Load tasks from JSON file ----
function loadTasks() {
  try {
    const data = fs.readFileSync(TASKS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    // If file doesn't exist yet, return empty array
    return [];
  }
}

// ---- Save tasks to JSON file ----
function saveTasks(tasks) {
  try {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
  } catch (err) {
    throw new Error('Could not save tasks: ' + err.message);
  }
}

// ---- Closure: private task counter ----
function createTaskCounter() {
  let count = 0; // private variable (only accessible inside this closure)

  return {
    increment() {
      count++;
    },
    decrement() {
      if (count > 0) count--;
    },
    getCount() {
      return count;
    },
  };
}

const taskCounter = createTaskCounter();

// Initialize counter from loaded tasks
const initialTasks = loadTasks();
initialTasks.forEach(() => taskCounter.increment());

// ---- Add a task ----
function addTask(tasks, title, priority = 'medium') {
  if (!title || title.trim() === '') {
    throw new Error('Task title cannot be empty!');
  }

  const validPriorities = ['low', 'medium', 'high'];
  if (!validPriorities.includes(priority)) {
    throw new Error(`Priority must be one of: ${validPriorities.join(', ')}`);
  }

  const newTask = {
    id: Date.now(), // simple unique id
    title: title.trim(),
    priority,
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    completed: false,
  };

  tasks.push(newTask);
  taskCounter.increment();
  saveTasks(tasks);
  console.log(`✅ Task added: "${newTask.title}" [${newTask.priority}]`);
}

// ---- Remove a task by ID ----
function removeTask(tasks, id) {
  const index = tasks.findIndex((t) => t.id === Number(id));
  if (index === -1) {
    throw new Error(`Task with id ${id} not found.`);
  }
  const removed = tasks.splice(index, 1);
  taskCounter.decrement();
  saveTasks(tasks);
  console.log(`🗑️  Removed task: "${removed[0].title}"`);
}

// ---- Search tasks by keyword ----
function searchTasks(tasks, keyword) {
  const results = tasks.filter((t) =>
    t.title.toLowerCase().includes(keyword.toLowerCase())
  );
  if (results.length === 0) {
    console.log('No tasks found matching: ' + keyword);
  } else {
    console.log(`\n🔍 Search results for "${keyword}":`);
    displayTasks(results);
  }
}

// ---- Sort tasks by priority or date ----
function sortTasks(tasks, by = 'priority') {
  const priorityOrder = { high: 1, medium: 2, low: 3 };

  const sorted = [...tasks]; // copy so we don't mutate original

  if (by === 'priority') {
    sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  } else if (by === 'date') {
    sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else {
    throw new Error('Sort by "priority" or "date" only.');
  }

  return sorted;
}

// ---- Compute stats using reduce / some / every ----
function getStats(tasks) {
  // reduce: count completed tasks and build summary
  const stats = tasks.reduce(
    (acc, task) => {
      acc.total++;
      if (task.completed) acc.completed++;
      if (task.priority === 'high') acc.highPriority++;
      return acc;
    },
    { total: 0, completed: 0, highPriority: 0 }
  );

  // some: check if ANY task is high priority and incomplete
  const hasUrgent = tasks.some((t) => t.priority === 'high' && !t.completed);

  // every: check if ALL tasks are completed
  const allDone = tasks.every((t) => t.completed);

  return { ...stats, hasUrgent, allDone };
}

// ---- Mark task as complete ----
function completeTask(tasks, id) {
  const task = tasks.find((t) => t.id === Number(id));
  if (!task) throw new Error(`Task with id ${id} not found.`);
  task.completed = true;
  saveTasks(tasks);
  console.log(`🎉 Marked as complete: "${task.title}"`);
}

// ---- Display tasks nicely ----
function displayTasks(tasks) {
  if (tasks.length === 0) {
    console.log('  (no tasks)');
    return;
  }
  tasks.forEach((t) => {
    const status = t.completed ? '✅' : '⬜';
    const priority = t.priority.padEnd(6);
    console.log(`  [${t.id}] ${status} [${priority}] ${t.date} - ${t.title}`);
  });
}

// ---- Main CLI Interface ----
function showMenu() {
  console.log('\n========== TASK TRACKER ==========');
  console.log('1. List all tasks');
  console.log('2. Add a task');
  console.log('3. Remove a task');
  console.log('4. Complete a task');
  console.log('5. Search tasks');
  console.log('6. Sort tasks');
  console.log('7. Show stats');
  console.log('8. Exit');
  console.log('===================================');
  console.log(`Total tasks tracked (closure counter): ${taskCounter.getCount()}`);
  process.stdout.write('\nEnter choice: ');
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

async function main() {
  console.log('Welcome to Task Tracker CLI!');

  while (true) {
    showMenu();

    const choice = await prompt('');

    // Load fresh tasks each time from file
    let tasks = loadTasks();

    try {
      if (choice === '1') {
        console.log('\n📋 All Tasks:');
        displayTasks(tasks);

      } else if (choice === '2') {
        const title = await prompt('Task title: ');
        const priority = await prompt('Priority (low/medium/high) [default: medium]: ') || 'medium';
        addTask(tasks, title, priority);

      } else if (choice === '3') {
        displayTasks(tasks);
        const id = await prompt('Enter task ID to remove: ');
        removeTask(tasks, id);

      } else if (choice === '4') {
        displayTasks(tasks);
        const id = await prompt('Enter task ID to mark complete: ');
        completeTask(tasks, id);

      } else if (choice === '5') {
        const keyword = await prompt('Search keyword: ');
        searchTasks(tasks, keyword);

      } else if (choice === '6') {
        const by = await prompt('Sort by (priority/date) [default: priority]: ') || 'priority';
        const sorted = sortTasks(tasks, by);
        console.log(`\n📋 Tasks sorted by ${by}:`);
        displayTasks(sorted);

      } else if (choice === '7') {
        const stats = getStats(tasks);
        console.log('\n📊 Task Statistics:');
        console.log(`  Total tasks    : ${stats.total}`);
        console.log(`  Completed      : ${stats.completed}`);
        console.log(`  High Priority  : ${stats.highPriority}`);
        console.log(`  Has urgent tasks: ${stats.hasUrgent ? 'Yes ⚠️' : 'No ✅'}`);
        console.log(`  All done?       : ${stats.allDone ? 'Yes 🎉' : 'Not yet'}`);

      } else if (choice === '8') {
        console.log('Goodbye! 👋');
        rl.close();
        process.exit(0);

      } else {
        console.log('Invalid choice. Please enter 1-8.');
      }

    } catch (err) {
      // Error handling with try-catch
      console.error('❌ Error:', err.message);
    }
  }
}

main();
