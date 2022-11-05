const express = require('express');
const router = express.Router();
const data = require("../data");
const searchData = data.search;
const redis = require("redis");
const bluebird = require('bluebird');
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router.get('/', async (req, res) => {
    try {
      let search = await client.zrevrangeAsync("sortedSet",0,9);
      //let searchTerms = await client.zscoreAsync("sortedSet", "kolk");

      let searchTerms = [];
      for(let i=0;i<10;i++)
      {
        let term = {};
        term["No"]= i
        term["Name"]= search[i]
        searchTerms.push(term)
      }
      //console.log(searchTerms)

      res.render('popularsearches',{title:"Top 10 Most Popular Search terms", terms: searchTerms})
    }
    catch(e) 
      {
        res.status(404).render('popularsearches', {title: "Error", error: e.toString()});
      }
});
  
  module.exports = router;