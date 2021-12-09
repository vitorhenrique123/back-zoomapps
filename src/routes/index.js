const express = require('express');
const jwt = require('jsonwebtoken');
const rp = require('request-promise');

const router = express.Router();
const db = require("../config/database");

const payload = {
  iss: process.env.APIKey,
  exp: ((new Date()).getTime() + 5000)
};
const token = jwt.sign(payload, process.env.APISecret);

const email="vitormesquita.2766@aluno.saojudas.br"

const options = {
  uri: `https://api.zoom.us/v2/users/${email}`, 
  qs: {
      'status': 'active' 
  },
  auth: {
      'bearer': token
  },
  headers: {
      'User-Agent': 'Zoom-api-Jwt-Request',
      'content-type': 'application/json'
  },
  json: true // Parse the JSON string in the response
};
rp(options)
    .then(function (response) {
      //printing the response on the console
        console.log('User has', response);
        //console.log(typeof response);
        //resp = response
        //Adding html to the page
    })
    .catch(function (err) {
        // API call failed...
        console.log('Usuário não encontrado ');
    });

/*const { rows } =  db.query(
    "Select * from vitor;"
);*/
router.get('/api', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'Seja bem-vindo(a) a API Node.js + PostgreSQL + Azure!',
    version: '1.0.0',
  });
});

module.exports = router;