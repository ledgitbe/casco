# Casco

> Bitcoin application development toolkit

## WARNING
**This repository contains alpha software and is in heavy development. 
Do not use this for mission critical applications.**



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
npm install -g yo generator-casco
yo casco
```

The command `yo casco` will prompt you with the choice of generating a new example project
or an empty project.

We recommend new users to use the **Getting Started Guide** as it provides a step by step tutorial on beginning to use the application framework with a statemachine example.

Usually 2 clients will be generated in your project, named `client-ADDRESS.js`, where `ADDRESS` is a Bitcoin address. The asssociated public and private keys can be found in the `.env*` files. 

To fund a client, simply run `node client-<ADDRESS>.js`. A QR code will be displayed to which you can send funds. Use the client to send transactions to interact with the application in `index.js`.

If your project has previously saved a state to the blockchain - it will resync with the blockchain to reach the last known state.

## Funding a project's client

Usually 2 clients are created by default. To fund a client so it can begin sending transactions, navigate to the project directory and run:

`node client-<ADDRESS>.js`

where `ADDRESS` is the client's generated address.

This will print a usage message, your client's address and a corresponding QR code.

You can always get your satoshis back from a client using

`node client-<ADDRESS>.js --refund <WITHDRAWALADDRESS>`

where `ADDRESS` is the client's address. And `WITHDRAWALADDRESS` is the address you want to receive the coins on.

## Creating a new client

If you need an extra client, you can create one using the menu accessed by running 

`yo casco`

or directly with:

`yo casco:client`

# Middleware

Casco comes standard with a few useful middleware functions, please check out the [statemachine example](examples/statemachine/index.js) on their usage. Also check out the annotated sourcecode of the middleware in [packages/casco/lib/middleware](packages/casco/lib/middleware)


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









