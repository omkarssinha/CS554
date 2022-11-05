const express = require('express');
const router = express.Router();
const data = require('../data');
const pokeData = data.pokemon;
const bluebird = require('bluebird');
const redis = require("redis");
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router.get('/:id', async (req, res) => {

  try {
      //console.log(req.params.id);
      if(req.params.id<0 || req.params.id%1!=0) throw "id error";

      var page;
      doesPgExist = await client.existsAsync("pg".concat(req.params.id));
      if(!doesPgExist)
      {
          page = await pokeData.getPokemonByPg(req.params.id);
          console.log(page);
          await client.setAsync(("pg".concat(req.params.id)), JSON.stringify(page));
      }
      else
      page = await pokeData.getPokemonByPg(req.params.id);
      
      res.json(page);
      
  } catch (e) {
    //console.log(e);
    //res.json(e);
    if(e=="id error")
    {
      //console.log("Invalid ID")
      res.status(400).json("Invalid Page no");
    }
    else{
      console.log(e);
      res.status(404).json("Pokemon not found");
  }
}
  
});

module.exports = router;