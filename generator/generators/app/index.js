const Generator = require('yeoman-generator');
const path = require('path');
const fs = require('fs');


function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path+'/'+file).isDirectory();
  });
}

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
  }

  async prompting() {
    const choices =  ['New Project', 'New Client', 'Tutorials'];

    console.log("Welcome to The Ledgit Bitcoin Application Framework");

    const props = await this.prompt([
      {
        type: "list",
        name: "action",
        message: "Choose the next step",
        default: "New Project",
        choices,
      },
    ]);

    switch (props.action) {
      case choices[2]:
        this.composeWith(require.resolve('../tutorial'));
        break;
      case choices[1]:
        this.composeWith(require.resolve('../client'));
        break;
      default:
        const project_types = getDirectories(__dirname + '/../project/templates/');
        const nested_props = await this.prompt([
          {
            type: "list",
            name: "project_type",
            message: "Choose which project to generate",
            default: "empty",
            choices: project_types,
          },
        ]);

        this.composeWith(require.resolve('../project'),{template: nested_props.project_type});
        break;
    }
  }

};
