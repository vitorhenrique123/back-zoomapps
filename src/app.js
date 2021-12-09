const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')

const app = express();

// ==> Rotas da API:
const user = require('./routes/user');
const classes = require('./routes/classes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: 'application/vnd.api+json' }));
app.use(cors());
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

//app.use(index);
app.post('/login', user.loginUser);
app.post('/register', user.registernUser);
app.post('/creategroup', classes.createGroup);
app.post('/getgroupmembers', classes.listGroup);

module.exports = app;
