const axios= require('axios');

module.exports = {

    async getShow(id)
    {
        if(id =="" || id=="  ")throw "Empty input";
        let url ="http://api.tvmaze.com/shows/";
        url = url + id;
        let data2 ={};
        data2 = await axios.get(url);
        return data2.data;
    },
    async getAllShows()
    {
        let url ="http://api.tvmaze.com/shows";
        let data2 ={};
        data2 = await axios.get(url);
        return data2.data;
    }

}