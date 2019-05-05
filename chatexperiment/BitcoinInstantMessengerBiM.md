# Bitcoin Instant Messenger (BiM)
### May 4th, 2019
### Jan-Axel Karlstedt
#### UNISOT/Ledgit.be


##### Abstract

Bitcoin Instant Messenger (BiM) is a new and unique chat application using the BitcoinSV blockchain. BiM is familiar to use as a messenger but uses the unique features of the blockchain to provide new functionality such as immutability and cross-system storage of data without reliance on a central service provider. Email and instant messengers were some of the most popular applications developed on the Internet, so the purpose of BiM is to create an application that can be used by normal individuals on a daily basis to communicate without reliance on a central service provider.

BiM allows a user to be personally in control of their communications online by exporting their conversations or connecting with other users on the BitcoinSV blockchain. BIM has functionality such as peer-to-peer encrypted instant messaging and offline e-messaging. The power of BitcoinSV allows chat logs to be immutably stored and accessed by users. 

Immutability of transactions have an interesting effect on the legitimacy of messages. Theory can be drawn from Dr. Craig Wright’s talk on “Shift to Bitcoin-based contract is the evolution for legal agreements” where electronic communication documentation is related to the Statute of Frauds (1677). Messengers such as WhatsApp have added functionality like the ability to delete a message from a conversation within 1 hour 8 minutes and 16 seconds. The implications this has for fraud and questioning the legitimacy of a chat log can be further explored, however in essence the ability to “scroll up” and delete a message when it is no longer even in the awareness of the other user can have repercussions that are difficult to resolve in a contractual context. BiM provides a stable messenger platform where the conversations happening will be within the control of the individuals involved.

BiM has innovations that alleviate the onboarding problem by reducing the “how” of knowledge on Bitcoin and OP_return transactions. BiM provides a messenger service that is non-reliant on a single company or institution. Furthermore, the immutable nature of the blockchain provides logs that can be indefinitely stored and accessed which provide a legal edge in proving legitimacy of information disclosed.

##### Implementation

Bitcoin Instant Messenger utilizes the nChain security invention known as the Deterministic Key Generation technique (nChain, 2019). The technique is for determining a common secret for the secure exchange of information and hierarchical, deterministic cryptographic keys. The technique is described in nChain patent #42 as a secret sharing protocol.

The technique allows OP_return message payloads to be sent across the blockchain without obviously displaying on the public blockchain that two parties are messaging each other. The application of this technique was crucial to the privacy and security of BiM as easy identification of message recipients or senders would allow monitoring or malicious targeting of users.
	
##### Conclusion

For BiM to be a full-fledged market ready application then UX and functionality would be improved. We have many additional ideas and techniques to improve the user experience and security that are not mentioned in this writeup.


##### References

nChain. (2019). Determining a common secret for the secure exchange of information and hierarchical, deterministic cryptographic keys. [online] Available at: http://nchain.com/app/uploads/2017/08/Deterministic-Key-Generation-PCT-Application-as-filed.pdf [Accessed 4 May. 2019]



