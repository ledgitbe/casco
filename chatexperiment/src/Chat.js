import React, {Component} from 'react'
import {Launcher} from 'react-chat-window'

import Ledgit from 'ledgit';
import Datapay from 'datapay';
import { filterAddress, decrypt, encrypt } from './middleware.js';

function send(message) {
  datapay.send(
    {
      data: [process.env.PREFIX, toAddress, encrypt(process.env.PRIVATE_KEY,"02584ddc69b0380d33f8c3994e8a37a9a5c47861dbce4d792136495b75d523796a",message)],
      pay: { key: process.env.PRIVATE_KEY }
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


class Chat extends Component {

  constructor() {
    super();
    this.state = {
      messageList: []
    };
  }

  componentDidMount() {
    this.app = Ledgit();

    this.app.use(filterAddress(["1Ar4Km1WzSBHgcQzU5HXy5DNKmbfPhRFsH", "1EDTTUAhcZdPTE2BbzzgUdAEautJ9VrMoU"]));

    this.app.use(decrypt("KwF57YW87KYpJV1BP1WABhWqt8vRcQNoMgD4vTiaL8qphFWWJ5Fq", "02584ddc69b0380d33f8c3994e8a37a9a5c47861dbce4d792136495b75d523796a"));

    this.app.use((req, res) => {
      this._sendMessage(req.message, true);
    });

    this.app.listen("bit://1AFrHuW9zV86VP1zWxZJpEDSvbsWvJz6wN", 50000);
  }

  _onMessageWasSent(message) {
    this.setState({
      messageList: [...this.state.messageList, message]
    })
    console.log(this.state.messageList);
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
    return (<div>
      <Launcher
        mute={true}
        agentProfile={{
          teamName: 'react-chat-window',
          imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
        }}
        onMessageWasSent={this._onMessageWasSent.bind(this)}
        messageList={this.state.messageList}
        showEmoji
      />
    </div>)
  }
}

export default Chat;
