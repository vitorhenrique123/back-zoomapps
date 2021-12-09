const express = require('express');
const jwt = require('jsonwebtoken');
const https = require('https');

const router = express.Router();
const db = require("../config/database");

const payload = {
    iss: process.env.APIKey,
    exp: ((new Date()).getTime() + 5000)
  };
const token = jwt.sign(payload, process.env.APISecret);


const createGroup = (request, response) => {
    const jsopn = request.body;
    const options = {
        hostname: `api.zoom.us`, 
        path: `/v2/groups`,
        method: 'POST',
        headers: {
            'User-Agent': 'Zoom-api-Jwt-Request',
            'content-type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    };
    var postData = JSON.stringify(
        {
            "name": jsopn.name
        }
    );

    const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)
      
        var chunks = '';
        res.on("data", function (chunk) {
            chunks += chunk;
        });
        res.on("end", function () {
            var response = JSON.parse(chunks);
            console.log(response);
            db.pool.query('SELECT * FROM  public.usuarios  WHERE email = $1', [jsopn.admin_email], (error, results) => {
                db.pool.query('INSERT INTO public.grupos( id_usuario, id_grupo, name) VALUES ($1, $2, $3)', [results.rows[0].id,response.id, response.name], (error2, results2) => {
                    console.log("teste");
                })
            });
        });
      })
      response.status(200).send({
        reponse: 'created'
    });
      
      req.on('error', error => {
        console.error(error)
      })
      
      req.write(postData)
      req.end()
}
const listGroup = (request, response) => {
    const jsopn = request.body;
    db.pool.query('SELECT public.grupos.id_grupo FROM  public.usuarios INNER JOIN public.grupos ON public.grupos.id_usuario = public.usuarios.id WHERE public.usuarios.email = $1', [jsopn.email], (error, results) => {
        response.status(200).send({
            reponse: 'ok',
            data: results.rows
        });
    })
}

const listGroupMembers = (request, response) => {
    const jsopn = request.body;
    const options = {
        hostname: `api.zoom.us`, 
        path: `/v2/groups/${group_id}/members`,
        method: 'POST',
        headers: {
            'User-Agent': 'Zoom-api-Jwt-Request',
            'content-type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    };
    var postData = JSON.stringify(
        {
            "name": jsopn.name
        }
    );
    const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)
      
        var chunks = '';
        res.on("data", function (chunk) {
            chunks += chunk;
        });
        res.on("end", function () {
            var response = JSON.parse(chunks);
            response.status(200).send({
                reponse: response
            });

        });
      })


}
module.exports = {
    createGroup,
    listGroup,
    listGroupMembers
}