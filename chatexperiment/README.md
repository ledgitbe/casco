# Chatexperiment

We took a stab at creating an encrypted chat application on Bitcoin. 

We explain the idea in more detail here: [Bitcoin Instant Messenger Idea](BitcoinInstantMessengerBiM.md)

To see the result of our work, check out [chatexperiment.getforge.io](https://chatexperiment.getforge.io).

# Things we did

- First we came up with a very rough protocol idea:

  OP_RETURN BITCOMID TOADDR ENCRYPTED MESSAGE
- We decided that we want to eventually make it into this, which we know is possible through deterministic shared secret generation.
  
  OP_RETURN ENCRYPTEDMESSAGE
- We used bsv's ECIES library
- For the POC functionality's sake we decided on not using ephemeral keys. This way the sender of a message can still see his how message history.
- We threw together a quick React application with [react-chat-window](https://www.npmjs.com/package/react-chat-window)
- First we harcoded the keys inside the application to get a very quick proof of concept. 
- Then we modified the application to allow a user to choose his own private key and their friend's public key
- This also worked and we were able to chat encrypted with our teammate in Scotland.
- We then started looking at shared deterministic key generation for the encryption in the OP_RETURN layer.
- We came up with the following code to generate the next public key of our chat friend, and our own next private key that corelates to the public key that our friend will have calculated as our next public key.
  ```javascript
  class PublicKeyChain {
  constructor(theirPublicMasterKey, ourPrivateMasterKey) {
    this.theirPublicMasterKey = theirPublicMasterKey;
    this.ourPrivateMasterKey = ourPrivateMasterKey;
    this.S = theirPublicMasterKey.point.mul(ourPrivateMasterKey.toBigNumber()).getX().toString('hex');
  }

  next(message) {
    let nextSharedSecret = bsv.crypto.Hash.sha256(Buffer.from(`${this.S}${message}`));
    nextSharedSecret = Buffer.from(nextSharedSecret, 'hex');
    nextSharedSecret = bsv.crypto.BN.fromBuffer(nextSharedSecret, 'hex');
    let theirNextPublicKey = this.theirPublicMasterKey.point.add(G.mul(nextSharedSecret));
    theirNextPublicKey = bsv.PublicKey.fromPoint(theirNextPublicKey);
    return theirNextPublicKey;
  }
}

class PrivateKeyChain {
  constructor(theirPublicMasterKey, ourPrivateMasterKey) {
    this.theirPublicMasterKey = theirPublicMasterKey;
    this.ourPrivateMasterKey = ourPrivateMasterKey;
    this.S = theirPublicMasterKey.point.mul(ourPrivateMasterKey.toBigNumber()).getX().toString('hex');
  }

  next(message) {
    let nextSharedSecret = bsv.crypto.Hash.sha256(Buffer.from(`${this.S}${message}`));
    nextSharedSecret = Buffer.from(nextSharedSecret, 'hex');
    nextSharedSecret = bsv.crypto.BN.fromBuffer(nextSharedSecret, 'hex');
    let ourNextPrivateKey = this.ourPrivateMasterKey.bn.add(nextSharedSecret);
    ourNextPrivateKey = bsv.PrivateKey(ourNextPrivateKey);
    return ourNextPrivateKey;
  }
}
```
- We ran into issues in the PrivateKeyChain where N would overflow. Time was running short, we had 2 hours left.
- We decided to leave the chat application in a working state so you can check it out.
- Then we started writing this write-up


# Things we can improve

- Key rotation
  
  Key rotation can happen on two levels:
  - The Bitcoin transaction layer
    When sending a transaction with 1 input and 2 outputs (1 OP_RETURN and 1 change transfer to a new deterministically generated address)
  - The encapsulated message layer
- We 


After we revamped the generator, we decided to play with a chat application on Bitcoin




