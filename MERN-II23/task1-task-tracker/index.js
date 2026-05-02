// task tracker app
// loads tasks from json file, can add remove search sort them
// using reduce some every for stats
// closures for private counter

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const TASKS_FILE = path.join(__dirname, 'tasks.json')

// load tasks from the json file
function loadTasks() {
  try {
    const data = fs.readFileSync(TASKS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    // if file not found just return empty
    return []
  }
}

function saveTasks(tasks) {
  try {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2))
  } catch (err) {
    throw new Error('Could not save: ' + err.message)
  }
}

// closure for private task counter
// the count variable cant be accessed from outside
function createTaskCounter() {
  let count = 0

  return {
    increment() {
      count++
    },
    decrement() {
      if (count > 0) count--
    },
    getCount() {
      return count
    },
  }
}

const taskCounter = createTaskCounter()

// initialize counter from existing tasks
const initialTasks = loadTasks()
initialTasks.forEach(() => taskCounter.increment())

function addTask(tasks, title, priority = 'medium') {
  if (!title || title.trim() === '') {
    throw new Error('title cannot be empty!')
  }

  const validPriorities = ['low', 'medium', 'high']
  if (!validPriorities.includes(priority)) {
    throw new Error('Priority must be low medium or high')
  }

  const newTask = {
    id: Date.now(),
    title: title.trim(),
    priority,
    date: new Date().toISOString().split('T')[0],
    completed: false,
  }

  tasks.push(newTask)
  taskCounter.increment()
  saveTasks(tasks)
  console.log('Task added: ' + newTask.title)
}

function removeTask(tasks, id) {
  const index = tasks.findIndex((t) => t.id === Number(id))
  if (index === -1) {
    throw new Error('Task not found with id: ' + id)
  }
  const removed = tasks.splice(index, 1)
  taskCounter.decrement()
  saveTasks(tasks)
  console.log('Removed: ' + removed[0].title)
}

function searchTasks(tasks, keyword) {
  // filter by keyword
  const results = tasks.filter((t) =>
    t.title.toLowerCase().includes(keyword.toLowerCase())
  )
  if (results.length === 0) {
    console.log('nothing found for: ' + keyword)
  } else {
    console.log('Search results:')
    displayTasks(results)
  }
}

// sort by priority or date
function sortTasks(tasks, by = 'priority') {
  const priorityOrder = { high: 1, medium: 2, low: 3 }

  const sorted = [...tasks]

  if (by === 'priority') {
    sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
  } else if (by === 'date') {
    sorted.sort((a, b) => new Date(a.date) - new Date(b.date))
  } else {
    throw new Error('can only sort by priority or date')
  }

  return sorted
}

// compute stats with reduce some every
function getStats(tasks) {
  const stats = tasks.reduce(
    (acc, task) => {
      acc.total++
      if (task.completed) acc.completed++
      if (task.priority === 'high') acc.highPriority++
      return acc
    },
    { total: 0, completed: 0, highPriority: 0 }
  )

  // some - check if any task is high priority and not done
  const hasUrgent = tasks.some((t) => t.priority === 'high' && !t.completed)

  // every - check if all tasks done
  const allDone = tasks.every((t) => t.completed)

  return { ...stats, hasUrgent, allDone }
}

function completeTask(tasks, id) {
  const task = tasks.find((t) => t.id === Number(id))
  if (!task) throw new Error('Task not found: ' + id)
  task.completed = true
  saveTasks(tasks)
  console.log('completed: ' + task.title)
}

function displayTasks(tasks) {
  if (tasks.length === 0) {
    console.log('  no tasks here')
    return
  }
  tasks.forEach((t) => {
    const status = t.completed ? '[done]' : '[todo]'
    console.log(`  ${t.id} ${status} [${t.priority}] ${t.date} - ${t.title}`)
  })
}

function showMenu() {
  console.log('\n===== TASK TRACKER =====')
  console.log('1. list tasks')
  console.log('2. add task')
  console.log('3. remove task')
  console.log('4. complete task')
  console.log('5. search')
  console.log('6. sort tasks')
  console.log('7. stats')
  console.log('8. exit')
  console.log('========================')
  console.log('counter (closure): ' + taskCounter.getCount())
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()))
  })
}

async function main() {
  console.log('Welcome to task tracker!')

  // TODO: maybe add due dates later

  while (true) {
    showMenu()

    const choice = await prompt('choice: ')
    let tasks = loadTasks()

    try {
      if (choice === '1') {
        console.log('All tasks:')
        displayTasks(tasks)

      } else if (choice === '2') {
        const title = await prompt('title: ')
        const priority = await prompt('priority (low/medium/high): ') || 'medium'
        addTask(tasks, title, priority)

      } else if (choice === '3') {
        displayTasks(tasks)
        const id = await prompt('enter id to remove: ')
        removeTask(tasks, id)

      } else if (choice === '4') {
        displayTasks(tasks)
        const id = await prompt('enter id to complete: ')
        completeTask(tasks, id)

      } else if (choice === '5') {
        const keyword = await prompt('search: ')
        searchTasks(tasks, keyword)

      } else if (choice === '6') {
        const by = await prompt('sort by priority or date: ') || 'priority'
        const sorted = sortTasks(tasks, by)
        console.log('sorted tasks:')
        displayTasks(sorted)

      } else if (choice === '7') {
        const stats = getStats(tasks)
        console.log('\nStats:')
        console.log('  total: ' + stats.total)
        console.log('  completed: ' + stats.completed)
        console.log('  high priority: ' + stats.highPriority)
        console.log('  has urgent: ' + stats.hasUrgent)
        console.log('  all done: ' + stats.allDone)

      } else if (choice === '8') {
        console.log('bye!')
        rl.close()
        process.exit(0)

      } else {
        console.log('invalid choice, try 1-8')
      }

    } catch (err) {
      console.error('Error: ' + err.message)
    }
  }
}

main()
