const mongoCollections = require('../config/mongoCollections');
let { ObjectId } = require('mongodb');
const Blogs = mongoCollections.blogs;

module.exports = {

    async addComment(id,comment, commenter) 
    {
      const blogCollection = await Blogs();
      const idOfComment = ObjectId();
      
      let newComment = {
         id : idOfComment,
         userThatPostedComment : commenter,
         comment : comment
      };
      let parsedId = ObjectId(id);
      return blogCollection
        .updateOne({ _id: parsedId }, { $push: { comments: newComment } })
    },

    async removeComment(blogId, commentId) 
    {
      const blogCollection = await Blogs();
      /*let parsedId = ObjectId(id);
      let blogId;
  
      const commentAll = await blogCollection.find({},{projection: {_id:1, comments: 1}}).toArray();
      for(let i of commentAll)
      {
        if(i.comments.length==0)
        continue;
  
        for(let j of i.comments)
        {
          if(j.id == id)
          {
            blogId = i._id;
            break;
          }
        }
      }

      let parsedId1 = ObjectId(blogId);*/
      //return await blogCollection.update({ id:"60577a3953e3f554d46e07e0"},{$pull : { "comments" : {"id": parsedId} } } );
        //WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
        return blogCollection
        .updateOne({ _id: ObjectId(blogId) }, { $pull: { comments: { id: ObjectId(commentId) } } });
    }
}