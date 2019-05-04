const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
  }

  async prompting() {
    const choices =  ['New Project', 'New Client'];

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
      case choices[1]:
        this.composeWith(require.resolve('../client'));
        break;
      default:
        const project_types = ['type1','type2'];
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
