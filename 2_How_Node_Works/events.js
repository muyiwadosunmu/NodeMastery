const EventEmitter = require('events'); //STEP 1
const http = require('http');
class Sales extends EventEmitter {
  constructor() {
    super();
  }
}
const myEmitter = new Sales(); //STEP 2

// STEP 4
myEmitter.on('newSale', () => {
  console.log(`There was a new sale`);
});
myEmitter.on('newSale', () => {
  console.log(`Customer name is Muyiwa`);
});

myEmitter.once('newSale', (stock) => {
  console.log(`There are ${stock} items remaining`);
});
myEmitter.emit('newSale', 9); //STEP 3, we could pass arguments for listeners that might want to use it

// Take note that the listeners will appear in the order they were in the code i.e => Synchronously
// To do this in an actual project we need to create a class

///////////////////////////

const server = http.createServer();

server.on('request', (req, res) => {
  console.log('Request received');
  console.log(req.url);
  res.end('Request received');
});
server.on('request', (req, res) => {
  console.log('Another received 😃');
});
server.on('close', () => {
  console.log('Server closed');
});

server.listen(3000, '127.0.0.1', () => {
  console.log(`Waiting for requests`);
});
