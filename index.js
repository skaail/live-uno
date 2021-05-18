const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const axios = require('axios').default;
const { data } = require('jquery');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
var request = require('request')
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var mysql = require('mysql');
const { json } = require('body-parser');

var ncod
var nsb 
var nemail
var snome
var ssb
var total
var semail

var tp = require('tedious-promises');
var dbConfig = require('./database/config.json');
var TYPES = require('tedious').TYPES;
var ConnectionPool = require('tedious-connection-pool');
var poolConfig = {}; // see tedious-connection-pool documentation
var pool = new ConnectionPool(poolConfig, dbConfig);
tp.setConnectionPool(pool); // global scope


app.get('/', (req,res)=>{
    res.render('index')
});


app.post('/', function(req,res){
    const nome = req.body.nome;
    const sobrenome = req.body.sobrenome;
    const email = req.body.email;
        res.send({
        'nome': nome,
        'sobrenome': sobrenome,
        'email': email
        })
        let options = {
            url: 'http://138.68.29.250:8082',
            form: {
                nome: nome,
                sobrenome: sobrenome,
                email: email,
            }
        };
        
        request.post(options,function(err, res, body) {
            console.log(body);
            var sep = body.split("#");
            ncod = parseInt(sep[1], 10)
            nsb = parseInt(sep[3],10)
            nemail = parseInt(sep[5],10)
            console.log(sep + " " + ncod + " " + nsb + " " + nemail)

            tp.sql("INSERT tbs_nome (nome, cod) OUTPUT INSERTED.id VALUES ("+nome+", "+ncod+")")
            .execute()
            .then(function(results) { 
              console.log("Nome > " + results)
            }).fail(function(err) {
          });

          tp.sql("INSERT tbs_sobrenome (sobrenome, cod) OUTPUT INSERTED.id VALUES ("+sobrenome+", "+nsb+")")
            .execute()
            .then(function(results) { 
              console.log("Sobrenome > " + results)
            }).fail(function(err) {
          });

          tp.sql("INSERT tbs_email (email, cod) OUTPUT INSERTED.id VALUES ("+email+", "+nemail+")")
            .execute()
            .then(function(results) { 
              console.log("Email > " + results)
            }).fail(function(err) {
          });

          tp.sql("SELECT soma FROM tbs_cod_nome WHERE cod = '"+ncod+"'")
            .execute()
            .then(function(results) {
              console.dir(results)
            }).fail(function(err) {
          });

          tp.sql("SELECT soma FROM tbs_cod_sobrenome WHERE cod = '"+nsb+"'")
          .execute()
          .then(function(results) {
            ssb = results
            console.log(results)
          }).fail(function(err) {
        });

        tp.sql("SELECT soma FROM tbs_cod_email WHERE cod = '"+nemail+"'")
        .execute()
        .then(function(results) {
          semail = results
          console.log(results)
        }).fail(function(err) {
      });


});   


        

})



app.listen(port, () => console.info("App listening on port: " + port))

