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
const port = process.env.PORT || 5000;
// start server
app.listen(
  port,
  console.log(`-------------------------------------\n
  ➜ Loaded: http://localhost:${port}
\n-------------------------------------
`)
);
