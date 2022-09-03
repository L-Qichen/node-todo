/* This mini project use to learn api of node.js
   * Mainly with File System Module (fs) of node.js
   * Also used commander.js from https://github.com/tj/commander.js
   * and inquirer.js from https://github.com/SBoudrias/Inquirer.js
*/
const db = require('./db.js');
const inquirer = require('inquirer');

module.exports.add = async (taskName) => {
  // step 1: read the previous tasks from file
  const list = await db.read();
  // step 2: add a new task
  list.push({ taskName, done: false });
  // store the task to file
  await db.write(list);
}

module.exports.clear = async () => {
  await db.write([]);
}

function askForAction(list, index) {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What do you want to do?',
        choices: [
          { name: 'exit', value: 'quit' },
          { name: 'finished', value: 'markAsDone' },
          { name: 'unfinished', value: 'markAsUndone' },
          { name: 'change task name', value: 'updateTaskName' },
          { name: 'delete this task', value: 'remove' }
        ],
      },
    ]).then(subAnswer => {
      switch (subAnswer.action) {
        case 'markAsDone':
          list[index].done = true;
          db.write(list);
          break;
        case 'markAsUndone':
          list[index].done = false;
          db.write(list);
          break;
        case 'updateTaskName':
          inquirer.prompt({
            type: 'input',
            name: 'taskName',
            message: 'new task name',
            default: list[index].taskName
          }).then(inputAnswer => {
            list[index].taskName = inputAnswer.taskName;
            db.write(list);
          })
          break;
        case 'remove':
          list.splice(index, 1);
          db.write(list);
          break;
      }
    })
}

function addNewTask(list) {
  inquirer.prompt({
    type: 'input',
    name: 'taskName',
    message: 'What is the new task?'
  }).then(addTaskAnswer => {
    list.push({
      taskName: addTaskAnswer.taskName,
      done: false
    })
    db.write(list);
  })
}

function printTasks(list) {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'index',
        message: 'Which task do you want to operate?',
        choices: [
          ...list.map((item, index) => {
            return { name: `${item.done ? '[O]' : '[_]'} ${index + 1} - ${item.taskName}`, value: index.toString() };
          }), { name: 'exit', value: '-1' }, { name: '+ add new task', value: '-2' }
        ],
      },
    ])
    .then((answer) => {
      const index = parseInt(answer.index);
      if (index >= 0) {
        askForAction(list, index);
      } else if (index === -2) {
        addNewTask(list);
      }
    });
}

module.exports.showAll = async () => {
  const list = await db.read();

  printTasks(list);
}
