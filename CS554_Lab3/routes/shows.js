const express = require('express');
const redis = require("redis");
const router = express.Router();
const data = require("../data");
const showData = data.shows;
const bluebird = require('bluebird');
const flat = require('flat');
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router.get('/:id', async (req, res) => {
    //console.log("Whatzatt");
    try {  
        let show= await showData.getShow(req.params.id);
        let summary="";
        if(show.summary!=null)
        summary = show.summary.replace(/(<([^>]+)>)/ig, '');
        res.render('showsSelected', {title: show.name, image: show.image, language: show.language, genres: show.genres, rating: show.rating, network: show.network, summary: summary}, async function (err, html) {
            doesPgIdExist = await client.existsAsync(req.params.id);
                 if(doesPgIdExist===0)
                 {
                     await client.setAsync(req.params.id, html.toString());
                 }
                 res.send(html);
           });
      } catch (e) {
        //console.log(e.toString());
        res.status(404).render('showsSelected', {title: "Invalid Input", error: e});
      }
});

module.exports = router;