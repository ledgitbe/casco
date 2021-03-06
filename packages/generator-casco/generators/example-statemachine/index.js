const Generator = require('yeoman-generator');
const path = require('path');
const mkdirp = require('mkdirp');
const { createKey, getBlockHeight } = require('../../util');

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
  }

  async prompting() {
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
    this.log("To build a client, run yo casco:client inside your project directory");
  }

  install() {
    this.installDependencies({ bower: false });
  }
};
