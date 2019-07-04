const Generator = require('yeoman-generator');
const path = require('path');
const bsv = require('bsv');
const { createKey } = require('../../util');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  writing() {
    let keypair = this.options.key || createKey();

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
