const express = require('express');
const querystring = require('querystring');
const router = express.Router();
const data = require('../data');
const blogData = data.blog;
const userData = data.user;
const commentData = data.comment;

router.get('/logout', async (req, res) => {

    req.session.destroy();
    console.log("logged out");
    res.json({Success: "Logged out successfully"});
});

router.get('/?', async (req, res) => {
  
    let skip = 0;
    let take = 20;
    if(req.query.skip)
    skip = req.query.skip;
    if(req.query.take)
    take = req.query.take;
    
    if(take>100)
    take =100;

    try {
      const blogList = await blogData.getListOfBlogs(parseInt(skip),parseInt(take));
      res.json(blogList);
    } catch (e) {
      res.status(500).json({ error: e });
    }
});

router.get('/:id', async (req, res) => {
    try {
      const blog = await blogData.getBlogById(req.params.id);
      res.status(200).json(blog);
    } catch (e) {
      let error = e.toString();
      res.status(404).json({"error": error });
    }
});

router.post('/', async (req, res) => {
    
    if(Object.keys(req.body).length!==2)
    {
      res.status(400).json({ error: 'Field count is not correct' });
      return;
    }
    const newblogData = req.body;

    if(!newblogData.title || !newblogData.body) {
        res.status(400).json({ error: 'You must Supply All fields' });
        return;
    }
    if(newblogData.title==""){
        res.status(400).json({ error: 'Title must not be an empty string' });
        return;
    }
    if(newblogData.body==""){
        res.status(400).json({ error: 'Blog content must not be an empty string' });
        return;
    }

    let user = {id: req.session.user.id, username: req.session.user.username }
    newblogData.userThatPosted = user;
    //console.log(newblogData);
    try {
        const { title, body, userThatPosted } = newblogData;
        const newblog = await blogData.addBlog(title, body, userThatPosted);
        res.status(200).json(newblog);
    } catch (e) {        
        let error= e.toString();
        res.status(500).json({ error: error});
    }
});

router.put('/:id', async (req, res) => {
    if(Object.keys(req.body).length!==2)
    {
      res.status(400).json({ error: 'Field count is not correct' });
      return;
    }
    const updatedData = req.body;

    if(!updatedData.title || !updatedData.body) {
        res.status(400).json({ error: 'You must Supply All fields' });
        return;
    }
    if(updatedData.title==""){
        res.status(400).json({ error: 'Title must not be an empty string' });
        return;
    }
    if(updatedData.body==""){
        res.status(400).json({ error: 'Blog content must not be an empty string' });
        return;
    }

    let blog1;
    try {
      blog1 = await blogData.getBlogById(req.params.id);
    } catch (e) {
      res.status(404).json({ error: 'blog not found1' });
      return;
    }

    if(blog1.userThatPosted.id !== req.session.user.id){
        res.status(404).json({ error: 'Cannot update blog by a different user' });
        return;
    }
    
    try {
      const updatedblog = await blogData.updateBlog(req.params.id, updatedData);
      res.status(200).json(updatedblog);
    } catch (e) {
      res.status(500).json({ error: e });
    }
});

router.patch('/:id', async (req, res) => {
    if(Object.keys(req.body).length>2 || Object.keys(req.body).length<1)
    {
      res.status(400).json({ error: 'Field count is not correct' });
      return;
    }
    const requestBody = req.body;
    let patchList = Object.keys(req.body);

    for(let i of patchList)
    {
      if(i!="title" && i!="body")
      {
        res.status(400).json({ error: 'Bad Data: Wrong Fields are present' });
        return;
      }
    }

    let oldblog;
    let updatedObject = {};
    try {
        oldblog = await blogData.getBlogById(req.params.id);
        if (requestBody.title && requestBody.title !== oldblog.title)
            updatedObject.title = requestBody.title;
        if (requestBody.body && requestBody.body !== oldblog.body)
            updatedObject.body = requestBody.body;
    } catch (e) {
        res.status(404).json({ error: 'blog not found2' });
        return;
    }
    if(oldblog.userThatPosted.id !== req.session.user.id){
        res.status(404).json({ error: 'Cannot update blog by a different user' });
        return;
    }

    if(requestBody.title && requestBody.title==""){
        res.status(400).json({ error: 'Title must not be an empty string' });
        return;
    }
    if(requestBody.body && requestBody.body==""){
        res.status(400).json({ error: 'Blog must not be an empty string' });
        return;
    }

    if (Object.keys(updatedObject).length !== 0) {
        try {
          //console.log(updatedObject);
          const updatedblog = await blogData.updateBlog(
            req.params.id,
            updatedObject
          );
          res.status(200).json(updatedblog);
        } catch (e) {
          res.status(500).json({ error: e });
        }
    } else {
        res.status(400).json({
          "error":
            'No fields have been changed from their initial values, so no update has occurred'
        });
    }  
});

router.post('/:id/comments', async (req, res) => {
    //console.log(req.body)
    if(Object.keys(req.body).length!==1)
    {
      res.status(400).json({ error: 'Field count is not correct' });
      return;
    }
    const newCommentData = req.body;

    if(!newCommentData.comment)
    {
        res.status(400).json({ error: 'You must Supply All fields' });
        return;
    }
    if(newCommentData.comment==""){
        res.status(400).json({ error: 'Comment must not be an empty string' });
        return;
    }

    newCommentData.userThatPostedComment={
        _id: req.session.user.id,
        username: req.session.user.username
    }
    try {
        const { comment, userThatPostedComment} = newCommentData;
        const newComment = await commentData.addComment(req.params.id, comment, userThatPostedComment);
        res.status(200).json(newComment);
    } catch (e) {
        let error = e.toString();
        res.status(500).json({ "error": error });
    }
});

router.delete('/:blogId/:commentId', async (req, res) => {
    //console.log(req.params)
    if (!req.params.blogId) {
      res.status(400).json({ error: 'You must Supply an ID of blog to delete' });
      return;
    }
    if (!req.params.commentId) {
      res.status(400).json({ error: 'You must Supply an ID of comment to delete' });
      return;
    }
    let comment;
    try {
       let blog = await blogData.getBlogById(req.params.blogId);
       for(let i of blog.comments)
       {
            //console.log(i.id.toString());
            //console.log(req.params.commentId);
            if(i.id.toString()===req.params.commentId)
            {
                comment = i;
                break;
            }
            continue;
       }
       //comment = blog//await commentData.getCommentById(req.params.blogId,req.params.commentId);
    } catch (e) {
      res.status(404).json({ error: 'comment not found' });
      return;
    }
    if(comment.userThatPostedComment._id !== req.session.user.id){
        res.status(404).json({ error: 'Cannot delete comment by a different user' });
        return;
    }

    try {      
      await commentData.removeComment(req.params.blogId,req.params.commentId);
      res.sendStatus(200);
    } catch (e) {
      res.status(500).json({ error: e });
    }
});

router.post('/signup', async (req, res) => {
    if(Object.keys(req.body).length!==3)
    {
      res.status(400).json({ error: 'Field count is not correct' });
      return;
    }
    const signupData = req.body;

    if(!signupData.name || !signupData.username || !signupData.password) {
        res.status(400).json({ error: 'You must Supply All fields' });
        return;
    }
    if(signupData.name==""){
        res.status(400).json({ error: 'Name must not be an empty string' });
        return;
    }
    if(signupData.username==""){
        res.status(400).json({ error: 'Username must not be an empty string' });
        return;
    }
    if(signupData.password==""){
        res.status(400).json({ error: 'Password must not be an empty string' });
        return;
    }

    try {
        const { name, username, password } = signupData;
        username = username.toLowerCase();
        const newUser = await userData.addUser(name, username, password);
        res.status(200).json(newUser);
    } catch (e) {        
        let error= e.toString();
        res.status(500).json({ error: error});
    }

});
/*
router.post("/login", async (req, res) => {
    
    let username = req.body.username;
    let password= req.body.password;

    let failed=1;
    for(let i of userData)
    {
        if(i.username===username)
        {
            let match = await bcrypt.compare(password, i.password);
            if(match)
            {
                failed=0;
                req.session.user={id: i._id, username: i.username};
                break;
            }
        }
    }
    if(failed==0)
    {
        let user = userData.getUserByID(req.session.user.id);
        console.log(user);
        res.status(200);
    }
    else
    {
        res.status(401).json({ error: 'Login unsuccessful' });
    }
});*/


router.post("/login", async (req, res) => {

    try{    
        let username = req.body.username;
        let password= req.body.password;
        
        username = username.toLowerCase();
        loggingUser=  await userData.authenticateUser(username,password);
        
        req.session.user={username: loggingUser.yusername, id: loggingUser.id};
        res.status(200).json({loggingUser});

    }catch(e){
        let error = e.toString();
        res.status(401).json({ error: error });
    }
});

module.exports = router;