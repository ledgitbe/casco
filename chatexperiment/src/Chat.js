import React, {Component} from 'react'
import {Launcher} from 'react-chat-window'

import Datapay from 'datapay';
import Ledgit from 'ledgit';
import { filterAddress, decrypt, encrypt } from './middleware.js';

import QRCode from 'qrcode.react';

const bsv = Datapay.bsv;
var G = bsv.crypto.Point.getG();


//STABLE 790c3c91

class Chat extends Component {

  constructor() {
    super();
    this.state = {
      messageList: [],
      fromAddress: "",
      toAddress: "",
      PREFIX: "1AFrHuW9zV86VP1zWxZJpEDSvbsWvJz6wN",
      PRIVATE_KEY: "",
      PUBLIC_KEY: "",
      formVisible: true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.send = this.send.bind(this);
    this.createKeys = this.createKeys.bind(this);
    this.reload = this.reload.bind(this);
  }
  send(message) {
    Datapay.send(
      {
        data: [this.state.PREFIX, this.state.toAddress, encrypt(this.state.PRIVATE_KEY, this.state.PUBLIC_KEY, message)],
        pay: { key: this.state.PRIVATE_KEY }
      },
      (err, txid) => { 
        if (err) {
          console.log(err);
        } else {
          // console.log(`Transaction sent. ${txid}`);
        }
      }
    );

  }
  handleSubmit(event) {
    event.preventDefault();
    this.setState({formVisible:false});
    this.reload();

  }
  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
    if (name === "PUBLIC_KEY") {
      const address = bsv.Address.fromPublicKey(bsv.PublicKey.fromString(value));
      this.setState({
        toAddress: address.toString()
      });
    } else if (name === "PRIVATE_KEY") {
      const address = bsv.Address.fromPrivateKey(bsv.PrivateKey.fromWIF(value));
      this.setState({
        fromAddress: address.toString()
      });

    }
  }

  createKeys() {
    let privKey = bsv.PrivateKey.fromRandom();
    const address = bsv.Address.fromPrivateKey(bsv.PrivateKey.fromWIF(privKey.toString()));
    
    this.setState({PRIVATE_KEY: privKey.toWIF(), fromAddress: address.toString()});
  }

  componentDidMount() {
  }

  reload() {
    this.app = Ledgit();

    this.app.use(filterAddress([this.state.fromAddress, this.state.toAddress]));

    this.app.use(decrypt(this.state.PRIVATE_KEY, this.state.PUBLIC_KEY));

    this.app.use((req, res) => {
      if (req.tx.in[0].e.a === this.state.toAddress) {
        this._sendMessage(req.message, true);
      } else if (req.isSyncing === true) {
        this._sendMessage(req.message, false);
      }
    });

    this.app.listen("bit://"+this.state.PREFIX, 50000);

  }

  _onMessageWasSent(message) {
     this.setState({
       messageList: [...this.state.messageList, message]
     })
       // console.log(this.state.messageList);
    this.send(message.data.text);
  }

  _sendMessage(text, fromThem) {
    if (text.length > 0) {
      this.setState({
        messageList: [...this.state.messageList, {
          author: fromThem ? 'them' : 'me',
          type: 'text',
          data: { text }
        }]
      })
    }
  }

  addMessage(text) {
  }

  render() {
    const agentProfile = {teamName: this.state.PUBLIC_KEY}
    return (<div style={{textAlign:"left", margin:"20px"}}>
      { this.state.formVisible && (
      <form onSubmit={this.handleSubmit}>
        <label>
          My Private Key:
          <input type="text" name="PRIVATE_KEY" value={this.state.PRIVATE_KEY} onChange={this.handleChange} />
        </label><br />
        <label>
          Friend's Public Key:
          <input type="text" name="PUBLIC_KEY" value={this.state.PUBLIC_KEY} onChange={this.handleChange} />
        </label><br />
        <input type="submit" value="Load Chat" />
        <input type="button" onClick={this.createKeys} value="Create Private key" />
        </form>
      )}
      { this.state.PRIVATE_KEY && (
        <div style={{textalign:"left"}}>
          Fund local wallet: <br />
      
          <QRCode value={this.state.fromAddress} /> <br />
          My private key:<br />
          {this.state.PRIVATE_KEY}<br />
          My public key:<br />
          {bsv.PublicKey.fromPrivateKey(bsv.PrivateKey.fromWIF(this.state.PRIVATE_KEY)).toString()}
        </div>
      )}
      <br /><br />
      <div style={{textAlign:"left"}}>
        1. Paste your Private Key in the "My Private Key" textbox or click the "Create Private key" button <br />
        2. Your funding address, private key and public key are shown below the form<br />
        3. Share your public key with a friend and ask him/her to do the same<br />
        4. Paste your friend's public key in the "Friend's Public Key" textbox<br />
        5. Start the chat by clicking the "Load Chat" button<br />
        6. Fund the wallet shown below the form<br />
      7. Start chatting in the chatbox on the right side of the screen<br /> <br />

      Every message you post is encrypted and saved immutably on the blockchain. <br />
      When loading already used keys your chat window will get the entire chat history from the blockchain. <br />
      A user can keep sending messages while the counterparty is offline, <br />
      the counterparty will receive the messages when he's online again.
      
      </div>


      <Launcher
        mute={true}
        agentProfile={agentProfile}
        onMessageWasSent={this._onMessageWasSent.bind(this)}
        messageList={this.state.messageList}
        showEmoji
        isOpen={true}
      />
    </div>)
  }
}

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


function createKey() {
  let privateKey = new bsv.PrivateKey();
  let address = privateKey.toAddress();
  let publicKey = privateKey.toPublicKey();

  return {
    privateKey,
    publicKey,
    address
  };
}

window.bob = createKey();
window.alice = createKey();

window.bsv = bsv;


window.PublicKeyChain = PublicKeyChain;
window.PrivateKeyChain = PrivateKeyChain;
export default Chat;
