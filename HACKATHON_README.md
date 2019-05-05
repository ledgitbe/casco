# HACKATHON README: BITCOIN PROJECT GENERATOR-HACKATHON 2019


The framework started 2 months ago as an experiment that dispatched Bitcoin transactions as actions on a [Redux](https://redux.js.org/) store. Over time it evolved into a general purpose Bitcoin transaction handling framework, employing the same design pattern as is used by the popular web server framework [ExpressJS](https://expressjs.com/)


*We realise there is prior work here, but the framework itself is not our hackathon entry.*


We took the time in this hackathon to do a **complete rewrite of the project generator to vastly improve the developer onboarding experience.**

- All changes made during the hackathon are in the 'hackathon' branch.
- We expressly refrained from making changes to the core of the framework inside the `lib` directory.
- All our efforts during this hackathon were on the `generator` directory

We took the time in this hackathon to create **Bitcoin Instant Messenger (BiM) that can be found in the chatexperiment folder**

## Here's what we did

- **We built an interactive step by step guide that allows anyone to create a permissioned key-value store on Bitcoin in less than 5 minutes.**

  Try it out yourself:
  
  ```
  npm install -g yo generator-ledgit
  yo ledgit
  ```
  
  Then choose the `Getting started guide (hackathon)` option.
 
- **We went from 1 to 10 different example projects that can be generated within seconds.**

  The example projects help new developers become familiar with the features of
  the framework such as middleware, routing, argument validation, ecies decryption and more.

- **We added 2 new types of contract clients to the generator.**
- **After all this, we decided to experiment with a chat application on Bitcoin**
   
  Documentation for this can be found in [chatexperiment](chatexperiment/README.md)

  


### Public release

We will release the entire framework under the GNU GPLv3 license, but right now
the repository is not in a state ready for release yet. Right now our focus is 
on the hackathon. We will prepare the repository for public release after
the hackathon.

### Pictures!
![QA on the example projects](https://bico.media/98e8202577620aa6ca20b1b9f9108594f4521f77cd1e54dc1855796940fe4ce6)
![A game of chess](https://bico.media/b61084cda28997ea093c97a00f6a434ff66250f924d2cfa3808f3962449ba693)
![Our whiteboard](https://bico.media/1b7c1d2abaa4bda95c4f21de60c1cfeb5c50cdf249486b25d5d61b9e823c7e4b)
![Starting implementation of the step by step guide](https://bico.media/c964d7a5bc6a735f1aea4451a2a55eb7c91e3638bf7c1a3eca9758bd42b96448)




# Default README below
# Ledgit

## Introduction

With Ledgit you can process Bitcoin transactions as if you were writing a web server application. Developers familiar with ExpressJS or Connect will feel right at home. Take a look at this example:

```javascript
const app = ledgit();

app.use((req, res) => {
    console.log(`New Transaction! Hash: ${req.tx.tx.h}`);
});

app.listen('bit://1Ks6qfewg1xovgZsJFkkgQdcyFzNeH7Pv5');
```
The above application will listen to all transactions with *1Ks6qfewg1xovgZsJFkkgQdcyFzNeH7Pv5* as the Bitcom protocol id.

## Install
### Quick install
```
npm install -g yo generator-ledgit
yo ledgit
```

### Walkthrough
The framework can be set up and interfaced in a familiar manner – via command prompt on a machine running Node.js. A single line allows a developer to begin:

`npm install -g yo generator-ledgit`

This installs the dependency Yeoman, a generic scaffolding system, and the Ledgit Bitcoin Application Framework Project Generator.

The next step is to run the project generator.

`yo ledgit`

A guided instance will boot, allowing a user to choose from options.

> Getting Started Guide (Hackathon)
>
> New Project
>
>  New Client


We recommend new users to use the **Getting Started Guide** as it provides a step by step tutorial on beginning to use the application framework with a statemachine example.


**New Project** will prompt a user if they would like to generate a project from an example or run a tutorial. The options available are:

| Option         | Complexity 1-10  |
| -------------  |  -----:|
| Empty                       | Up to you |
| Example-ping-pong           | 1 |
| Example-redis               | 2 |
| Example-payments            | 1 |
| Tutorial-statemachine       |   |
| Tutorial-argumentvalidation |   |
| Tutorial-custom-middleware  |   |
| Tutorial-simple-router      |   |
| Tutorial-standard-middleware|   |

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

`yo ledgit`

or with this shortcut:
`yo ledgit:client`




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









