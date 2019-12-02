// implement your API here
// Ok bud :)

//Bring in .env config parser
require('dotenv').config();
//Get express module
const express = require('express');
//Get CORS module
const cors = require('cors');
//Get DB module
const db = require('./data/db');

//Create server
const server = express();

//Get / Set port - Use the process env variable PORT, or if missing, use 4000 as fallback.
const port = process.env.PORT || 4000;

//Use JSON body parser
server.use(express.json());

//Use CORS
server.use(cors());

//Initial endpoint
server.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello there :)' });
});

//Start listening
server.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});