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
            db.pool.query('INSERT INTO public.grupos( id_usuario, id_grupo, nome_grupo) VALUES (?, ?)', [jsopn.admin_id,response.id, response.name], (error, results) => {
                response.status(200).send({
                    reponse: 'created'
                });
            })

        });
      })

      
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
module.exports = {
    createGroup,
    listGroup
}