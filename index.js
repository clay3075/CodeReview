const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const www = process.env.WWW || './www';
const fs = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');
const diff2html = require("diff2html").Diff2Html
const config = require("./config.js");
var mongoose = require('mongoose');
var passport = require('passport');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var filePaths = "C:\\code\\Reviews";

app.use(fileUpload());
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(session({ secret: 'supersecretpassword' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/node_modules/'))
app.use(express.static(www));
console.log(`serving ${www}`);

app.listen(port, () => console.log(`listening on http://localhost:${port}`));

mongoose.connect(config.DB_ConnectionString, { useNewUrlParser: true }); // connect to our database
require('./config/passport')(passport);

//use to ensure user is authenticated before accessing information
function verified(req, res, next) {
  console.log(req.isAuthenticated())
  console.log(req.path)
  if (req.isAuthenticated())
    return next();
  else
    res.status(401).send(new Error('not authorized'))
}

app.post('/login', passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/Verification/login.html',
  failureFlash: false
}));

app.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/Verification/login.html',
  failureRedirect: '/Verification/signup.html',
  failureFlash: false
}));

//api calls
app.get('/reviews', verified, (req, res) => {
  var reviews = []

  const isDirectory = source => fs.lstatSync(source.Path).isDirectory();
  const getDirectories = source => fs.readdirSync(source).map(name => ({'Name': name, 'Path': path.join(source, name)})).filter(isDirectory);

  reviews = getDirectories(filePaths);
  res.send(JSON.stringify(reviews));
});

app.post('/create/:reviewName', verified, (req, res) => {
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

app.get('/reviewfiles/:reviewName', verified, (req, res) => {
  console.log(req.params.reviewName)
  var filepath = path.join(filePaths, req.params.reviewName);
  console.log(filepath);
  const isFile = source => fs.lstatSync(source.Path).isFile();
  const getFiles = source => fs.readdirSync(source).map(name => ({'Name':name, 'Path':path.join(source, name)})).filter(isFile);

  var reviewfiles = getFiles(filepath);

  res.send(JSON.stringify(reviewfiles));
});

app.post('/fileupload/:reviewName', verified, (req, res) => {
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

app.get('/retrievediff/:fileName', verified, (req, res) => {
  var strInput = "--- a/server/vendor/golang.org/x/sys/unix/zsyscall_linux_mipsle.go\n+++ b/server/vendor/golang.org/x/sys/unix/zsyscall_linux_mipsle.go\n@@ -1035,6 +1035,17 @@ func Prctl(option int, arg2 uintptr, arg3 uintptr, arg4 uintptr, arg5 uintptr) (\n \n // THIS FILE IS GENERATED BY THE COMMAND AT THE TOP; DO NOT EDIT\n \n+func Pselect(nfd int, r *FdSet, w *FdSet, e *FdSet, timeout *Timespec, sigmask *Sigset_t) (n int, err error) {\n+\tr0, _, e1 := Syscall6(SYS_PSELECT6, uintptr(nfd), uintptr(unsafe.Pointer(r)), uintptr(unsafe.Pointer(w)), uintptr(unsafe.Pointer(e)), uintptr(unsafe.Pointer(timeout)), uintptr(unsafe.Pointer(sigmask)))\n+\tn = int(r0)\n+\tif e1 != 0 {\n+\t\terr = errnoErr(e1)\n+\t}\n+\treturn\n+}\n+\n+// THIS FILE IS GENERATED BY THE COMMAND AT THE TOP; DO NOT EDIT\n+\n func read(fd int, p []byte) (n int, err error) {\n \tvar _p0 unsafe.Pointer\n \tif len(p) > 0 {\n";
  var outputHtml = Diff2Html.getPrettyHtml(strInput, {inputFormat: 'diff', showFiles: true, matching: 'lines'});
  res.send(outputHtml);
});