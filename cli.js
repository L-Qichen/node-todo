// CommonJS (.cjs)
const { program } = require('commander');
const api = require('./index.js')

program
  .option('-x, --xxx', 'My x');
program
  .command('add <taskName>')
  .description('add a task')
  .action((...args) => {
    const str = args[2].args.join(' ');
    api.add(str).then(() => { console.log('Task Added successfully!') }, () => { console.log('Can\'t add new task.') });
  });
program
  .command('clear')
  .description('clear all tasks')
  .action(() => {
    api.clear().then(() => { console.log('Clear all tasks!') }, () => { console.log('Can\'t clear task list.') });
  });

program
  .command('ls')
  .description('show task list')
  .action(() => {
    api.showAll();
  });

program.parse(process.argv);


// const options = program.opts();
// if (options.xxx) console.log(options.xxx);
