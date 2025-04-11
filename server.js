const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hospital App is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
