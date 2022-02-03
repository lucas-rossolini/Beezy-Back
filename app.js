require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { setupApp } = require('./routes');

const app = express();

app.use(express.json());
app.use(cors());

setupApp(app);

app.listen(
  process.env.EXPRESS_PORT,
  console.log(`-------------------------------------\n
  ➜ Loaded: http://localhost:${process.env.EXPRESS_PORT}
\n-------------------------------------
`)
);
