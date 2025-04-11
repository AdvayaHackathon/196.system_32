// app.js
const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('OK');
});

app.listen(3001, () => {
  console.log('Hospital App is listening on port 3001');
});
