const express = require('express');
    morgan = require('morgan');
    fs = require('fs');
    path = require('path');

const app = express();

let myLogger = (req, res, next) => {
  console.log(req.url);
  next();
};

let requestTime = (req, res, next) => {
  req.requestTime = Date.now();
  next();
};

let accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

app.use(myLogger);
app.use(requestTime);
app.use(morgan('combined', {stream: accessLogStream}));
app.use('/myAwesomeStaticFiles/', express.static('public'));

app.get('/', (req, res) => {
  let responseText = 'Welcome to my app!';
  responseText += '<small>Requested at: ' + req.requestTime + '</small>';
  res.send(responseText);
});

app.get('/secreturl', (req, res) => {
  let responseText = 'This is a secret url with super top-secret content.';
  responseText += '<small>Requested at: ' + req.requestTime + '</small>';
  res.send(responseText);

});

app.get('/movies' , (req, res) => {
    const err = new Error('diese schnittstelle ist noch nicht implementiert');
    err.status = 404; 
    res.send(err);
})


app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});