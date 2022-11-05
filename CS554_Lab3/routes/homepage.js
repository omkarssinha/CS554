const express = require('express');
const bluebird = require('bluebird');
const flat = require('flat');
const redis = require("redis");
const router = express.Router();
const data = require("../data");
const client = redis.createClient();
const showData = data.shows;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router.get('/', async (req, res) => {
    //console.log("HowzattTT");
    try{
       let shows= await showData.getAllShows();
       res.render('homepage', {title: "All Shows", shows: shows} ,async function(err, html) {
       doesPgExist = await client.existsAsync("homepg");
            if(!doesPgExist)
            {
                //console.log("hello");
                await client.setAsync("homepg", html.toString());
            }
            res.send(html);
      });
    } catch (e) {
        let error = e.toString()
        //console.log(error);
        res.status(404).render('homepage', {title: "Invalid Input", error: error});
    }
});

module.exports = router;