var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var config = {
    user:'digisath',
    database:'digisath',
    password:process.env.DB_PASSWORD, 
    host:'db.imad.hasura-app.io',
    port:'5432'
}
var pool= new Pool(config);
var app = express();
app.use(morgan('combined'));


function hash(input,salt)
{
   // var hashed=crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    var hashed=crypto.createHash('sha256');
    return hashed.toString();
}
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/hash/:input',function(req,res)
{
    var hashedString = hash(req.param.input,'some string');
    res.send(hashedString);
})
app.get('/article/:x',function(req,res)
{
    pool.query("SELECT * FROM ARTICLE WHERE title =" +req.param.x, function(err,result)
    {
        if(err)
        {
            res.status(500).send(err.toString())
            
        }
        else
        {
            res.send(JSON.stringify(result));
        }
    })
})
app.get('/test-db', function (req,res)
{
    pool.query("SELECT * FROM ARTICLE", function(err,result)
    {
        if(err)
        {res.status(500).send(err.toString())}
        else
        {
            res.send(JSON.stringify(result));
        }
    })
});
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/bs.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'bs.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
