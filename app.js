// Logger
const { createLogger, transports, format } = require('winston');
// HTTP Methods
const http = require('http');
const PORT = 3000;

// This serves as my database (for now)
let groceryList = [];
// Testing
const temp = {
  item: 'jello',
  quantity: 23,
  price: 5,
  bought: false,
};
groceryList.push(temp);

function editGrocery(newItem) {
  // Didn't provide an item to change
  if (!'item' in newItem) return false;

  for (groceryItem of groceryList) {
    if (groceryItem.item === newItem.item) {
      logger.info(`Old groceryItem:\n${JSON.stringify(groceryItem)}`);
      if ('quantity' in newItem) groceryItem.quantity = newItem.quantity;
      if ('price' in newItem) groceryItem.price = newItem.price;
      if ('bought' in newItem) groceryItem.bought = newItem.bought;
      logger.info(`New groceryItem:\n${JSON.stringify(groceryItem)}`);
      return true;
    }
  }
  // Item not found
  return false;
}

// create the logger
const logger = createLogger({
  level: 'info', // this will log only messages with the level 'info' and above
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(), // log to the console
    new transports.File({ filename: 'app.log' }), // log to a file
  ],
});

// using the logger
// logger.info("This is an info message");
// logger.error("This is an error message");
// logger.warn("This is a warning message");

const server = http.createServer((req, res) => {
  // GET for grocery list
  if (req.method === 'GET' && req.url === '/api/grocery-list') {
    logger.info(`Successful GET`);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(groceryList));
    // POST for adding groceries
  } else if (req.method === 'POST' && req.url === '/api/grocery-add') {
    let body = '';
    // Gets the body from request
    req.on('data', (chunk) => {
      body += chunk;
    });
    // process request
    req.on('end', () => {
      const data = JSON.parse(body);
      groceryList.push(data);

      logger.info(`Successful POST:\n${JSON.stringify(groceryList)}`);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Resource Created Successfully!' }));
    });
    // PUT for editing all values of an item minimum needs {item:a, <other things to change>}
  } else if (req.method === 'PUT' && req.url === '/api/grocery-edit') {
    let body = '';

    // Gets the body from request
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      const dataToEdit = JSON.parse(body);
      // Check if you can edit it
      if (editGrocery(dataToEdit)) {
        logger.info(`Successful PUT to change grocery item`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Resource Successfully Changed' }));
      } else {
        logger.warn(
          'Unsuccessful change of grocery item because invalid name or no name'
        );
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(
          `Unsuccessful change of grocery item because of an invalid name or no name.
           Make sure it is in JSON format and includes a name. You can also add optional fields such as quantity, bought, or price.
        
           Example:
           {
             "item": "jello",
             "price": 23,
             "bought": true
           }
        
           This code finds the item "jello" in the grocery list (if it exists) and changes the price to 23 and sets "bought" to true.`
        );
      }
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
