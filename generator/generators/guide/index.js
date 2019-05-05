const Generator = require('yeoman-generator');
const path = require('path');
const fs = require("fs");
const { createKey, getBlockHeight } = require('../../util');

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
  }

  async prompting() {
    console.log("THIS NEEDS IMPLEMENTING");
    console.log("THE PROJECT TEMPLATES ARE BASED ON example-statemachine");
    console.log("1) Generate the project as usual");
    console.log(") Don't use composeWith(...) because we need to access all the generated variables for the tutorial instructions");
    console.log(") This means embedding clients into these templates and not using composeWith(...)");
    console.log("2) Instruct user to open new terminal and cd into new project");
    console.log("3) Instruct user to run `npm start`");
    console.log("4) Instruct user to open new terminal again and run ./client-*.js");
    console.log("5) Explain funding");
    console.log("6) client init");
    console.log("7) client set hello world");
    console.log("8) explain that the other client isnt invited");
    console.log("9) fund the other client");
    console.log("10) try client2 set key value");
    console.log("11) it doesnt work");
    console.log("12) client1 invite client2...");
    console.log("13) client2 set key value");
    console.log("14) it works!");
    process.exit();
    this.props = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your app name",
        default: this.templateDir
      },
    ]);

    this.log("Project name: ", this.props.name);
  }

  default() {
    if (path.basename(this.destinationPath()) !== this.props.name) {
      this.log(
        `Your app must be inside a folder named ${
          this.props.name
        }\nI'll automatically create this folder.`
      );
      mkdirp(this.props.name);
      this.destinationRoot(this.destinationPath(this.props.name));
    }
  }

  async writing() {
    let contractKeyPair = createKey();
    // Save contractAddress inside .yo-rc.json for composability of client
    this.config.set("PREFIX", contractKeyPair.ADDRESS);
    this.config.set("PREFIX_PUBLIC_KEY", contractKeyPair.PUBLIC_KEY);


    // Write contract template
    this.fs.copyTpl(
      this.templatePath('*'),
      this.destinationRoot(),
      { ADDRESS: contractKeyPair.ADDRESS, height: await getBlockHeight(), name: this.props.name }
    );

    // Write contract keypair details to .env
    this.fs.write('.env', Object.entries(contractKeyPair).map(([k,v]) => `${k}=${v}`).join('\n'));

    // Create two clients
    this.composeWith(require.resolve('../client'));
    this.composeWith(require.resolve('../client'));
  }

  end() {
    this.log("To build a client, run yo ledgit:client inside your project directory");
  }

  install() {
    this.installDependencies({ bower: false });
  }
};
