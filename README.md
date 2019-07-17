# Casco

<aside class="warning">
This repository contains alpha software and is in heavy development. 
Do not use this.
</aside>

## Introduction

With Casco you can process Bitcoin transactions as if you were writing a web server application. Developers familiar with ExpressJS or Connect will feel right at home. Take a look at this example:

```javascript
const app = casco();

app.use((req, res) => {
    console.log(`New Transaction! Hash: ${req.tx.tx.h}`);
});

app.listen('bit://1Ks6qfewg1xovgZsJFkkgQdcyFzNeH7Pv5');
```
The above application will listen to all transactions with *1Ks6qfewg1xovgZsJFkkgQdcyFzNeH7Pv5* as the Bitcom protocol id.

## Install
### Quick install
```
npm install -g yo casco
yo casco
```

### Walkthrough
The framework can be set up and interfaced in a familiar manner – via command prompt on a machine running Node.js. A single line allows a developer to begin:

`npm install -g yo casco`

This installs the dependency Yeoman, a generic scaffolding system, and the Casco Framework.

The next step is to run the project generator.

`yo casco`

A guided instance will boot, allowing a user to choose from options.

> Getting Started Guide (Hackathon)
>
> New Project
>
> New Client


We recommend new users to use the **Getting Started Guide** as it provides a step by step tutorial on beginning to use the application framework with a statemachine example.


**New Project** will prompt a user if they would like to generate a project from an example or run a tutorial. The options available are:

| Option                      | 
| -------------               |  
| Empty                       |
| Example-ping-pong           |
| Example-redis               |
| Example-payments            |
| Tutorial-statemachine       |
| Tutorial-argumentvalidation |
| Tutorial-custom-middleware  |
| Tutorial-simple-router      |
| Tutorial-standard-middleware|

You will be asked to name your project and a new folder with the set name will be created.

Usually 2 clients will be generated in your project, with Bitcoin addresses as the names. Associated public and private keys can be found in the .env files. 

## Running a project

Once you've created a project, you can run it!
First navigate to your project directory

Once you're in the project folder, run the project with the command:

`node index.js` or `npm start`

 On a successful boot your console should read "Syncing complete"

If your project has previously saved a state to the blockchain - it will resync with the blockchain to reach the last known state.

Use the client-*.js files to send transactions to interact with the application. Navigate the terminal to your project folder and you may begin broadcasting transactions with clients (after funding).


## Funding a project's client

Usually 2 clients are created by default. To fund a client so it can begin sending transactions, navigate to the project directory and run:

`node client-ADDRESS.js`

where ADDRESS is the client's generated address.

**Pro tip:** Use TAB completion!

This will print a usage syntax, your client's public key and a QR code. Use the QR code or public key to fund the wallet for transactions sent from that client. BSV transaction fees are fractions of a cent, and big blocks only makes them cheaper!

You can always get your satoshis back from a client using

`node client-ADDRESS.js --refund WITHDRAWALADDRESS`

  where ADDRESS is the client's public address. And WITHDRAWALADDRESS is the address you want to receive the coins on.

## Creating a new client

If the default clients aren't sufficient, then you can create a new client using the menu accessed by running the command inside your project directory.

`yo casco`

or with this shortcut:
`yo casco:client`


# Future improvements
- Support for Bitcom protocol prefix registration
- Built-in key management
- Advanced transaction builder
- Integrating syncstate into the framework (it's possible at the moment with custom middleware)
- Improving the syncing algorithm
- Support for handling block and reorg events
- Support for custom sync algorithms
- Support for subrouters
- Support for syncing with a full node in addition to BitDB
- Support for syncing with BitBus in addition to BitDB









