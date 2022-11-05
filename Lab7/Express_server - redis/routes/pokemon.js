const express = require('express');
const router = express.Router();
const data = require('../data');
const pokeData = data.pokemon;
const bluebird = require('bluebird');
const redis = require("redis");
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

/*
router.get('/', async (req, res) => {

  try {
    const showList = await pokeData.getAllShows();
    //console.log(showList);
    res.json(showList);
  } catch (e) {
    res.status(500).send();
  }
});
*/
router.get('/:id', async (req, res) => {

  try {
      //console.log(req.params.id);
      if(req.params.id<0 || req.params.id%1!=0) throw "id error";

      var pokemon;
      doesPgExist = await client.existsAsync("poke".concat(req.params.id));
      if(!doesPgExist)
      {
          pokemon = await pokeData.getPokemonById(req.params.id);
          console.log(pokemon);
          await client.setAsync(("poke".concat(req.params.id)), JSON.stringify(pokemon));
      }
      else
      pokemon = await pokeData.getPokemonById(req.params.id);

      res.json(pokemon);

  } catch (e) {
    //console.log(e);
    //res.json(e);
    if(e=="id error")
    {
      //console.log("Invalid ID")
      res.status(400).json("Invalid ID");
    }
    else{
      //console.log(e);
      res.status(404).json("Pokemon not found");
  }
}
  
});
/*
router.post('/', async (req, res) => {
  // Not implemented
  res.status(501).send();
});

router.delete('/', async (req, res) => {
  // Not implemented
  try {
    await pokeData.getPokemonById(req.params.id);
    } catch (e) {
    res.status(404).json({ error: 'Show not found' });
    return;
    }
    try {
    await pokeData.removeShow(req.params.id);
    res.sendStatus(200);
    } catch (e) {
    res.status(500).json({ error: e });
    }
  res.status(501).send();
});
*/

module.exports = router;