const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const www = process.env.WWW || './www';
const fs = require('fs');
const path = require('path');
app.use(express.static(www));
console.log(`serving ${www}`);

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: www });
});

app.listen(port, () => console.log(`listening on http://localhost:${port}`));


//api calls
app.get('/reviews', (req, res) => {
  var filePaths = "C:\\code\\Reviews";
  var reviews = []

  const isDirectory = source => fs.lstatSync(source.Path).isDirectory();
  const getDirectories = source => fs.readdirSync(source).map(name => ({'Name': name, 'Path': path.join(source, name)})).filter(isDirectory);

  reviews = getDirectories(filePaths);

  res.send(JSON.stringify(reviews));
});