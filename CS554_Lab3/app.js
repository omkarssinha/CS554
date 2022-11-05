const express = require('express');
//const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();
const configRoutes = require("./routes");
const static = express.static(__dirname + '/public');
const exphbs= require('express-handlebars');
const app = express();

app.use('/public', static);

app.use(express.json());
app.use(express.urlencoded( {extended: true} ));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use('/', async (req,res,next)=>{
    //console.log(req.query)
    let doesPgExist = await client.existsAsync("homepg");
    //console.log(req.originalUrl)
    //console.log(doesPgExist)
    if(doesPgExist && req.originalUrl=="/")
    {
        let html = await client.getAsync("homepg");
        //console.log("Hi");
        res.send(html);
    }
    else{
        //console.log("Hello");
    next();}
  });

  app.use('/shows/:id', async (req,res,next)=>{
    let doesPgIdExist = await client.existsAsync(req.params.id);
    if(doesPgIdExist)
    {
        let html = await client.getAsync(req.params.id);
        //console.log("Hii");
        res.send(html);
    }
    else{
        //console.log("Hello");*/
    next();}
  }); 

  app.use('/search/', async (req,res,next)=>{
    let doesPgIdExist = await client.existsAsync(req.query.searchTerm);
    if(doesPgIdExist)
    {
        let html = await client.getAsync(req.query.searchTerm);
        await client.zadd("sortedSet", "INCR", 1, req.query.searchTerm);
        //console.log("Hiii");
        res.send(html);
    }
    else{
        //console.log("Hello");*/
    next();}
  }); 

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
})
