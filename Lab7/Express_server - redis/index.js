const express = require('express');
const bluebird = require('bluebird');
const redis = require("redis");
const client = redis.createClient();
const configRoutes = require('./routes');
const app = express();

app.use(express.json());
app.use(express.urlencoded( {extended: true} ));

app.use('/pokemon/:id', async (req,res,next)=>{
  let doesPokeIdExist = await client.existsAsync("poke".concat(req.params.id));
  if(doesPokeIdExist)
  {
      let json = await client.getAsync("poke".concat(req.params.id));
      console.log("Hii poke");
      res.json(JSON.parse(json));
  }
  else{
      //console.log("Hello");*/
  next();}
}); 

app.use('/pokemon/page/:id', async (req,res,next)=>{
  let doesPgIdExist = await client.existsAsync("pg".concat(req.params.id));
  if(doesPgIdExist)
  {
      let json = await client.getAsync("pg".concat(req.params.id));
      console.log(json);
      res.json(JSON.parse(json));
  }
  else{
      //console.log("Hello");*/
  next();}
}); 
  
configRoutes(app);

app.listen(3001,() => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3001');
});