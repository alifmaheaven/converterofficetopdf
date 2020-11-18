require('dotenv').config()

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors')

var port = process.env.PORT || 3000
// var usersRouter = require('./routes/users');
var filesRouter = require('./routes/files')

var app = express();

const isProduction = process.env.NODE_ENV === 'production'
const origin = {
  origin: isProduction ? 'http://localhost:8080' : '*',
}

app.use(cors(origin))
app.use('/', express.static('./../frontend/dist'));
app.use('/publicFiles', express.static('./public/uploads'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// app.use('/api/user', usersRouter);
app.use('/api/files', filesRouter)

app.get('/api', (req, res) => {
    return res.send('Api already create');
});

//cronjob
require('./cronjob/cronjob');

app.listen(port, () => {
    console.log(`Server started on port :`+port+``);
});
