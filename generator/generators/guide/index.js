const Generator = require('yeoman-generator');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const chalk = require('chalk');
const { createKey, getBlockHeight } = require('../../util');

const log = console.log;

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    this.waitForEnter = async function waitForEnter() {
      await this.prompt([
        {
          type: "input",
          name: "undefined",
          message: "When you are ready, press ENTER"
        }
      ]);
    }
  }

  async prompting() {
    process.stdout.write('\x1Bc');
    log("");
    log(chalk.green("Alright! Let's make your own personal key-value store on Bitcoin!"));
    log("");
    log("");
    log(chalk.green("First you need a new project to work in. Let's generate that now..."));
    log("");

    await this.waitForEnter();
    process.stdout.write('\x1Bc');

    this.props = {};
    this.props.name = "BitcoinKeyValueTutorial";

    log("");
    log("Project name: ", chalk.yellow(this.props.name));
  }

  async default() {
    if (path.basename(this.destinationPath()) !== this.props.name) {
      this.log(
        `We'll put your files in side a new directory called ${
          chalk.green(this.props.name)
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

    this.props.client1 = createKey();
    this.props.client2 = createKey();

    this.props.client1name = `client-${this.props.client1.ADDRESS}.js`;
    this.props.client2name = `client-${this.props.client2.ADDRESS}.js`;

    this.composeWith(require.resolve('../client'), { key: this.props.client1 });
    this.composeWith(require.resolve('../client'), { key: this.props.client2 });

  }

  async install() {
    await this.installDependencies({ bower: false });
  }

  async end() {
    await this.waitForEnter();
    process.stdout.write('\x1Bc');
    log("");
    log(chalk.green("Well done!"));
    log("");
    log(chalk.green("Your main application is", chalk.yellow("index.js")));
    log("");
    log(chalk.green("We've also set you up with two clients:"));
    log(chalk.yellow(this.props.client1name));
    log(chalk.yellow(this.props.client2name));
    log("");

    await this.waitForEnter();
    process.stdout.write('\x1Bc');
    log("");
    log(chalk.blue("Open a new terminal window and navigate to the", chalk.yellow(this.props.name), "directory."));
    log(chalk.blue("Then run the following command to start the application:"));
    log("");
    log(chalk.red("node index.js"));
    log("");
    log(chalk.blue("Keep this window open for the rest of the tutorial"));
    log("");
    log(chalk.green("Your application is now listening to transactions on the blockchain."));
    log(chalk.green("Let's make some transactions to our application."));
    log("");

    await this.waitForEnter();
    process.stdout.write('\x1Bc');
    log("");
    log(chalk.blue(`Open ${chalk.bold("another")} terminal window and navigate again to the`, chalk.yellow(this.props.name), "directory."));
    log(chalk.blue("In this terminal window, run the following command:"));
    log("");
    log(chalk.red(`node ${this.props.client1name}`));
    log("");
    log(chalk.green("A QR code is shown"));
    log("");
    log(chalk.blue("Fund the address with a few satohis (5000 will do)"));
    log("");
    log(chalk.green("The private key is stored in"), chalk.yellow(`.env.client-${this.props.client1.ADDRESS}`));
    log(chalk.cyan("After this tutorial, you can always get your satoshis back with this command:"))
    log(chalk.red(`node ${this.props.client1name} --refund <YOUR ADDRESS>`));
    log("");

    await this.waitForEnter();
    process.stdout.write('\x1Bc');
    log("");
    log(chalk.green("Great!"));
    log(chalk.green("Now you should have one terminal displaying 'Syncing complete', and the other terminal is ready with your funded client"));
    log("");
    log(chalk.blue("Run the following command inside your client terminal to initialize your application:"))
    log("");
    log(chalk.red(`node ${this.props.client1name} init`));
    log("");
    log(chalk.green("Now watch the application receive your transaction and see how the state changes"));
    log("");

    await this.waitForEnter();
    process.stdout.write('\x1Bc');
    log("");
    log(chalk.green(`Great job! You've made ${chalk.yellow(this.props.client1.ADDRESS)} the first participant of your application.`));
    log(chalk.green(`Let's make another transaction.`));
    log("");
    log(chalk.blue(`Run the following command and see how the state changes in your application`));
    log("");
    log(chalk.red(`node ${this.props.client1name} set hello world`));
    log("");


    await this.waitForEnter();
    process.stdout.write('\x1Bc');
    log("");
    log(chalk.green("Notice how"), 
      chalk.magenta("state.db.hello"), 
      chalk.green("has been set to"),
      chalk.magenta("world"));
    log("");
    log(chalk.blue("Try setting another key to a value in the same fashion, for example:"));
    log("");
    log(chalk.red(`node ${this.props.client1name} set coin geek`));
    log("");

    await this.waitForEnter();
    process.stdout.write('\x1Bc');
    log("");
    log(chalk.blue("Go back to the main application and press CTRL-C inside the window to close the main application."));
    log("");
    log(chalk.blue("Run"), chalk.red("node index.js"), chalk.blue("again."));
    log("");
    log(chalk.blue("Watch how the application enters the same state again."));
    log(chalk.blue("Nothing is stored locally, everything is on the blockchain! \\(^o^)/"));
    log("");

    await this.waitForEnter();
    process.stdout.write('\x1Bc');
    log("");
    log(chalk.green("So what about the other client?"));
    log("");
    log(chalk.blue("Run the following command to see the address of the second client:"));
    log("");
    log(chalk.red(`node ${this.props.client2name}`));
    log("");
    log(chalk.blue("Fund this client as well with some satoshis (about 5000 will do)"));
    log("");
    log(chalk.cyan("After this tutorial, you can always get your satoshis back with this command:"))
    log(chalk.red(`node ${this.props.client1name} --refund <YOUR ADDRESS>`));
    log("");

    await this.waitForEnter();
    process.stdout.write('\x1Bc');
    log("");
    log(chalk.green("Now that your second client is also funded, try the following command and watch what happens:"))
    log("");
    log(chalk.red(`node ${this.props.client2name} set intruder alert`));
    log("");

    await this.waitForEnter();
    process.stdout.write('\x1Bc');
    log("");
    log(chalk.green("The transaction from your second client did not impact the state!"));
    log("");
    log(chalk.blue("Have the first client invite the second client to the party:"));
    log("");
    log(chalk.red(`node ${this.props.client1name} invite ${this.props.client2.ADDRESS}`));
    log("");
    log(chalk.blue("Then use the second client again to set a key-value pair"));
    log("");
    log(chalk.red(`node ${this.props.client2name} set thiskey wassetbyclient2`));
    log("");
    log(chalk.green("Notice how the state changes"));


  }


};
