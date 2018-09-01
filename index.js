const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const www = process.env.WWW || './www';
const fs = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');
const diff2html = require("diff2html").Diff2Html
var filePaths = "C:\\code\\Reviews";

app.use(fileUpload());
app.use(express.static(__dirname + '/node_modules/'))
app.use(express.static(www));
console.log(`serving ${www}`);

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: www });
});

app.listen(port, () => console.log(`listening on http://localhost:${port}`));


//api calls
app.get('/reviews', (req, res) => {
  var reviews = []

  const isDirectory = source => fs.lstatSync(source.Path).isDirectory();
  const getDirectories = source => fs.readdirSync(source).map(name => ({'Name': name, 'Path': path.join(source, name)})).filter(isDirectory);

  reviews = getDirectories(filePaths);
  res.send(JSON.stringify(reviews));
});

app.post('/create/:reviewName', (req, res) => {
  var dir = path.join(filePaths,req.params.reviewName);
  console.log(dir);
  var response = "success";
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  } else {
    response = "failure";
  }
  res.send(response);
});

app.get('/reviewfiles/:reviewName', (req, res) => {
  console.log(req.params.reviewName)
  var filepath = path.join(filePaths, req.params.reviewName);
  console.log(filepath);
  const isFile = source => fs.lstatSync(source.Path).isFile();
  const getFiles = source => fs.readdirSync(source).map(name => ({'Name':name, 'Path':path.join(source, name)})).filter(isFile);

  var reviewfiles = getFiles(filepath);

  res.send(JSON.stringify(reviewfiles));
});

app.post('/fileupload/:reviewName', (req, res) => {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');

  var file = req.files.uploadFile
  var filepath = path.join(filePaths, req.params.reviewName);
  file.mv(path.join(filepath, file.name), function(err) {
    if (err)
      return res.status(500).send(err);
  
    res.redirect('/ReviewOverview/reviewoverview.html?reviewName=' + req.params.reviewName);
  });
});

app.get('/retrivediff/:fileName', (req, res) => {

});