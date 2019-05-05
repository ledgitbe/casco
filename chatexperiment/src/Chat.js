import React, {Component} from 'react'
import {Launcher} from 'react-chat-window'

import Datapay from 'datapay';
import Ledgit from 'ledgit';
import { filterAddress, decrypt, encrypt } from './middleware.js';

import QRCode from 'qrcode.react';

const bsv = Datapay.bsv;

class Chat extends Component {

  constructor() {
    super();
    this.state = {
      messageList: [],
      fromAddress: "1Ar4Km1WzSBHgcQzU5HXy5DNKmbfPhRFsH",
      toAddress: "1EDTTUAhcZdPTE2BbzzgUdAEautJ9VrMoU",
      PREFIX: "1AFrHuW9zV86VP1zWxZJpEDSvbsWvJz6wN",
      PRIVATE_KEY: "KwF57YW87KYpJV1BP1WABhWqt8vRcQNoMgD4vTiaL8qphFWWJ5Fq",
      PUBLIC_KEY: "02584ddc69b0380d33f8c3994e8a37a9a5c47861dbce4d792136495b75d523796a",
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
   console.log(this.state); 
    return (<div>
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
      { !this.state.formVisible && (
        <div>
          Fund local wallet: <br />
      
          <QRCode value={this.state.fromAddress} /> <br />
          My public key:<br />
          {bsv.PublicKey.fromPrivateKey(bsv.PrivateKey.fromWIF(this.state.PRIVATE_KEY)).toString()}
        </div>
      )}
      <Launcher
        mute={true}
        agentProfile={{
          teamName: 'react-chat-window',
          imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
        }}
        onMessageWasSent={this._onMessageWasSent.bind(this)}
        messageList={this.state.messageList}
        showEmoji
        isOpen={true}
      />
    </div>)
  }
}

export default Chat;
