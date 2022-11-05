const express = require('express');
const router = express.Router();
const data = require("../data");
const searchData = data.search;
const redis = require("redis");
const bluebird = require('bluebird');
const flat = require('flat');
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router.get('/', async (req, res) => {
    //console.log("gotcha")
    try {
      let searchTermTemp=req.query.searchTerm
      if(searchTermTemp.trim()=="") throw "Blank input error";
      else
      {
        shows= await searchData.searchForTerm(req.query.searchTerm);
        res.render('showsFound', {title: "Shows Found", shows: shows, searchTerm: req.query.searchTerm}, async function (err, html) {
        doesPgIdExist = await client.existsAsync(req.query.searchTerm);
            if(doesPgIdExist===0)
            {
                await client.setAsync(req.query.searchTerm, html.toString());
                await client.zadd("sortedSet", 1, req.query.searchTerm);
            }
            res.send(html);
      })
    }
    } catch(e) 
      {
        if(e.toString()=="Blank input error")
        {
          res.status(400).render('showsFound', {title: e, error: e});
        }
        else
        res.status(404).send();
      }
  });
  
  module.exports = router;