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
app.use(cors({
    origin: true,
    credentials: true, 
    methods: 'POST,GET,PUT,OPTIONS,DELETE'
}));
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    res.header("Access-Control-Allow-Methods", "GET, POST","PUT", "OPTIONS");
    next();
});

//app.use(index);
app.post('/login', user.loginUser);
app.post('/register', user.registernUser);
app.post('/creategroup', classes.createGroup);
app.post('/getgroupmembers', classes.listGroup);
app.post('/listgroupmemebers', classes.listGroupMembers);
app.post('/addgroupmember', classes.addGroupMember);

module.exports = app;
