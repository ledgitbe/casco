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
    const choices =  ['Getting Started guide', 'New Project', 'New Client'];

    console.log("Welcome to Casco");

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
      case choices[0]:
        this.composeWith(require.resolve('../guide'));
        break;
      case choices[2]:
        let client_types = getDirectories(path.join(__dirname, '..'));
        // include whitelist choices
        client_types = client_types.filter(function(item) {
          return item.startsWith('client');
        });

        let client_choice = await this.prompt([
          {
            type: "list",
            name: "client_type",
            message: "Choose which client to generate",
            default: "client",
            choices: client_types,
          },
        ]);

        this.composeWith(require.resolve('../' + client_choice.client_type));
        break;
      default:
        let blacklist = ['app', 'client', 'guide', /^client/];
        let project_types = getDirectories(path.join(__dirname, '..'));

        // Exclude blacklist from choices
        project_types = project_types.filter(function(item) {
          var isBlacklisted = false;
          blacklist.forEach((blacklistItem) => {
            if(item.match(blacklistItem)) {
              isBlacklisted = true;
            }
          });
          if (!isBlacklisted) {
            return item;
          }
        });

        let project_choice = await this.prompt([
          {
            type: "list",
            name: "project_type",
            message: "Choose which project to generate",
            default: "empty",
            choices: project_types,
          },
        ]);

        this.composeWith(require.resolve('../' + project_choice.project_type));
        break;
    }
  }

};
