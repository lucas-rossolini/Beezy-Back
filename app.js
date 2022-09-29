require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { setupApp } = require('./routes');

const app = express();

// Use express to manage routing
app.use(express.json());

// Use Cross Origins Ressources Sharing to accept front requests
app.use(cors());

setupApp(app);

// start server
app.listen(
  process.env.EXPRESS_PORT,
  console.log(`-------------------------------------\n
  ➜ Loaded: http://localhost:${process.env.EXPRESS_PORT}
\n-------------------------------------
`)
);
