var inquirer = require('inquirer');

console.log("Hi, welcome to the Ledgit Bitcoin Application Development Framework");

var questions = [{
  type: 'list',
  name: 'Project',
  message: 'What do you want to do?',
  choices: ['Create new project', 'Create new client', 'Examples'],
  filter: function(val) {
    return val.toLowerCase();
  }
}];

inquirer
  .prompt(questions)
  .then(answers => {
    console.log(JSON.stringify(answers,null,' '));
  });
