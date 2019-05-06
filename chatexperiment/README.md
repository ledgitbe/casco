# Chatexperiment

We took a stab at creating an encrypted chat application on Bitcoin. 

We explain the idea in more detail here: [Bitcoin Instant Messenger Idea](BitcoinInstantMessengerBiM.md)

To see the result of our work, check out [chatexperiment.getforge.io](https://chatexperiment.getforge.io).

# Things we did

- First we came up with a very rough protocol idea:

  OP_RETURN <BITCOMID> <TOADDR> <ENCRYPTED MESSAGE>
- We decided that we want to eventually make this into this, which we know is possible through deterministic shared secret generation.
  
  OP_RETURN <ENCRYPTED MESSAGE>
- We threw together a quick React application with [react-chat-window](https://www.npmjs.com/package/react-chat-window)
- First we harcoded the keys inside the application to get a very quick proof of concept. 
- Then we modified the application to allow a user to choose his own private key and their friend's public key
- This also worked and we were able to chat encrypted with our teammate in Scotland.


# Things we can improve upon

- 


After we revamped the generator, we decided to play with a chat application on Bitcoin




