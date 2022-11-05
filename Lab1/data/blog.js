const mongoCollections = require('../config/mongoCollections');
const Blogs = mongoCollections.blogs;
let { ObjectId } = require('mongodb');

module.exports = {

    async getListOfBlogs(offset,take) {
      const blogCollection = await Blogs();
      const blogList = await blogCollection.find({}).skip(offset).limit(take).toArray();
      if (!blogList) throw 'No Blogs in system!';
      return blogList;
    },
  
    async getBlogById(id) {
      const blogCollection = await Blogs();
      let parsedId = ObjectId(id);
      const blog = await blogCollection.findOne({ _id: parsedId });
      if (!blog) throw 'Blog Not Found';
      return blog;
    },
  
    async addBlog(title, blog, user) 
    {
      const blogCollection = await Blogs();
      //console.log("We are in add blog");
      let newBlog = {
         title : title,
         body : blog,
         userThatPosted: user,
         comments: []
      };
      //console.log(user);
      const newInsertInformation = await blogCollection.insertOne(newBlog);
      if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
      return await this.getBlogById(newInsertInformation.insertedId);
    },

    async updateBlog(id, updatedBlog) {
        const blog = await this.getBlogById(id);
        //console.log(blog);
        let comments = blog.comments;

        let blogUpdateInfo = {
            title: updatedBlog.title,
            body: updatedBlog.body,
            comments: comments,
            userThatPosted: blog.userThatPosted
        };

        if(blogUpdateInfo.title==null)
        blogUpdateInfo.title = blog.title;
        if(blogUpdateInfo.body==null)
        blogUpdateInfo.body = blog.body;


        const blogCollection = await Blogs();
        let parsedId = ObjectId(id);
        const updateInfo = await blogCollection.updateOne(
            { _id: parsedId },
            { $set: blogUpdateInfo }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw 'Update failed';

        return await this.getBlogById(id);
    }
}