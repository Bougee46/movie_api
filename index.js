const express = require('express');
let morgan = require('morgan');
let fs = require('fs');
const  path = require('path');

const app = express();
app.use(express.json()); 

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

let myLogger = (req, res, next) => {
  console.log(req.url);
  next();
};

let requestTime = (req, res, next) => {
  req.requestTime = Date.now();
  next();
};

app.use(myLogger);
app.use(requestTime);
app.use(passport.initialize());

let topMovies = [
    {
        title: 'The Shawshank Redemption',
        director: 'Frank Darabont'
    },
    {
        title: 'The Godfather',
        director: 'Francis Ford Coppola'
    },
    {
        title: 'The Dark Knight',
        director: 'Christopher Nolan'
    },
    {
        title: 'The Godfather Part II',
        director: 'Francis Ford Coppola'
    },
    {
        title: 'Schindlers List',
        director: 'Steven Spielberg'
    },
    {
        title: 'The Lord of the Rings: The Return of the King',
        director: 'Peter Jackson'
    },
    {
        title: 'Pulp Fiction',
        director: 'Quentin Tarantino'
    },
    {
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        director: 'Peter Jackson'
    },
    {
        title: 'Forrest Gump',
        director: 'Robert Zemeckis'
    },
    {
        title: 'Fight Club',
        director: 'David Fincher'
    },
];

let accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

app.get('/', (req, res) => {
  let responseText = 'Welcome to my app!';
  responseText += '<small>Requested at: ' + req.requestTime + '</small>';
  res.send(responseText);
});

app.post('/alternate', (req, res) => {
  let responseText = 'antwort: ' + req.body.greet;
  res.send(responseText);
});

app.get('/secreturl', (req, res) => {
  let responseText = 'This is a secret url with super top-secret content.';
  responseText += '<small>Requested at: ' + req.requestTime + '</small>';
  res.send(responseText);

});

app.get('/login', (req, res) => {
  const { username, password} = req.body;
  const token = passport.authenticate();
  console.log(token);
  console.log(username);
  console.log(password);
})

app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});


app.get('/students', (req, res) => {
  res.send('Successful GET request returning data on all the students');
});

app.get('/documentation', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'documentation.html'));
  });

app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('common'));

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something went wrong! ' + err.stack);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${8080}`);
});
