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


const loginUser = (request, response) => {
  const jsopn = request.body;
  console.log(jsopn.email);
  db.pool.query('SELECT * FROM  public.usuarios WHERE email = $1', [jsopn.email], (error, results) => {
    if (error) {
        response.status(200).send({
            login: 'false',
            message: `Usuário não encontrado!`
        });
    }
    if(results.rows.length >0){
        const options = {
            hostname: `api.zoom.us`, 
            path: `/v2/users/${jsopn.email}`,
            headers: {
                'User-Agent': 'Zoom-api-Jwt-Request',
                'content-type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        };
        https.get(options, (res) => {
            var chunks = [];
            res.on("data", function (chunk) {
                chunks.push(chunk);
            });
            res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                response.status(200).send({
                    login: 'true',
                    message: JSON.parse(body.toString()),
                    type: results.rows[0].tipo
                });
            });

            }).on('error', (e) => {
            console.error(e);
        });


    }else{
        response.status(200).send({
            login: 'false',
            message: `Usuário não encontrado!`
        });
    }
  })
}
const registernUser = (request, response) => {
    const jsopn = request.body;
    db.pool.query('SELECT * FROM  public.usuarios WHERE email = $1', [jsopn.email], (error, results) => {
        if (error) {
            response.status(200).send({
                response: 'false',
                message: `Falha ao Cadastrar Usuário!`
            });
        }
        if(results.rows.length ==0){
            db.pool.query('INSERT INTO public.usuarios( email, password, tipo, registro) VALUES ($1, $2, $3, $4)', [jsopn.email, jsopn.password, jsopn.tipo, jsopn.identificacao], (error, results) => {
                console.log("Inserindo");
                const options = {
                    hostname: `api.zoom.us`, 
                    path: `/v2/users`,
                    method: 'POST',
                    headers: {
                        'User-Agent': 'Zoom-api-Jwt-Request',
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                };
                var postData = JSON.stringify(
                    {
                        "action": "create",
                        "user_info": {
                            "email": jsopn.email,
                            "first_name": jsopn.nome,
                            "last_name": jsopn.sobrenome,
                            "password": jsopn.password,
                            "type": jsopn.tipo
                        }
                    }
                );

                const req = https.request(options, res => {
                    console.log(`statusCode: ${res.statusCode}`)
                  
                    var chunks = [];
                    res.on("data", function (chunk) {
                        chunks.push(chunk);
                    });
                    res.on("end", function (chunk) {
                        var body = Buffer.concat(chunks);
                        response.status(200).send({
                            login: 'true',
                            message: "Usuário cadastrado com sucesso"
                        });
                    });
                  })

                  
                  req.on('error', error => {
                    console.error(error)
                  })
                  
                  req.write(postData)
                  req.end()
            })
        }
    })
}
module.exports = {
    loginUser,
    registernUser
}