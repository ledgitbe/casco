This Bitcoin agent updates key value pairs in Redis based on Bitcoin transactions. 
The example could be expanded to create global database synchronization.
Note: Redis must be installed for this example to run correctly. (https://redis.io/topics/quickstart)

1) run `node client-<%= CLIENT_ADDRESS %>.js`
2) fund the address shown in QR code
3) run `node index.js` to start the agent
4) run `node client-<%= CLIENT_ADDRESS %>.js init` to initialize the agent and set the client as the permissioned participant
5) run `node client-<%= CLIENT_ADDRESS %>.js set [KEY] [VALUE]` to set a key-value pair in redis
