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
  }
});

server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
