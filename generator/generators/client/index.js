const Generator = require('yeoman-generator');
const path = require('path');
const mkdirp = require('mkdirp');
const bsv = require('bsv');
const { createKey } = require('../util/index');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  writing() {
    let keypair = createKey();

    let data = Object.assign(
      {}, 
      keypair, 
      { PREFIX: this.config.get("PREFIX") },
      { PREFIX_PUBLIC_KEY: this.config.get("PREFIX_PUBLIC_KEY") }
    );

    this.fs.copyTpl(
      this.templatePath('_client.js'),
      this.destinationPath(`client-${keypair.ADDRESS}.js`),
      data
    );

    // Generate .env.client-ADDRESS.js file
    this.fs.write(
      `.env.client-${keypair.ADDRESS}`,
      Object.entries(data).map(([k,v]) => `${k}=${v}`).join('\n')
    );
  }
};
