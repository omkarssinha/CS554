const axios= require('axios');
//const mongoCollections = require('../config/mongoCollections');
//const shows = mongoCollections.shows;
//const uuid = require('uuid');

let exportedMethods = {
 /* async getAllShows() {
    const {data} = await axios.get("http://api.tvmaze.com/shows");
    return data;
    //return "hello";
  }, */
  async getPokemonById(id) {

    //console.log(id);
    //const postCollection = await posts();
    let url= "https://pokeapi.co/api/v2/pokemon/";
    url = url+id;
    //console.log(url);
    const {data} = await axios.get(url) ;
    //console.log(data);
    
    if (!data) throw 'Pokemon for this id not found';
    return {data};
  },

  async getPokemonByPg(id) {

    //console.log(id);
    //const postCollection = await posts();
    let url= "https://pokeapi.co/api/v2/pokemon/";
    let offset = (parseInt(id)-1)*20;
    let queryString= "?offset="+offset+"&limit=20";
    url = url+queryString;
    console.log(url);
    const {data} = await axios.get(url) ;
    console.log(offset);
    
    if (!data) throw 'Pokemon for this id not found';
    return {data};
  }
 
};

module.exports = exportedMethods;