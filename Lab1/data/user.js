let { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const Users = mongoCollections.users;
const bcrypt = require('bcrypt');

var salt = bcrypt.genSaltSync(9);

module.exports = {

    async addUser(name, username, password) 
    {
      const userCollection = await Users();
      if(await userCollection.findOne({ username: username })) throw "This username is already taken";
      
      var hash = await bcrypt.hashSync(password, salt);
      let newUser = {
         name : name,
         username : username,
         password : hash
      };
      const newInsertInformation = await userCollection.insertOne(newUser);
      if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
      return await this.getUserById(newInsertInformation.insertedId);
    },

    async getUserById(id) {
        const userCollection = await Users();
        let parsedId = ObjectId(id);
        const user = await userCollection.findOne({ _id: parsedId });
        if (!user) throw 'Blog Not Found';

        let userToShow = {
            id : id,
            username: user.username
        }
        return userToShow;
    },
    async authenticateUser(username, password) { 

        if(!username || !password) throw "You must provide both username and password"
        const userCollection = await Users();
        const user = await userCollection.findOne({ username: username });
        if (!user) throw 'Check your login data: Either username or password is wrong';
        let match = await bcrypt.compare(password, user.password);
        if(!match) throw 'Check your login data: Either username or password is wrong';  

        //return await userCollection.updateOne({ username: username }, { $push: { sessions: session_id } });
        return await this.getUserById(user._id);
    }


}