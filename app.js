const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
//const url = require("url");
const app = express();
const configRoutes = require('./routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

app.use(session({
    name: 'AuthCookie',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 6000000 }
  }));

  app.use('/', async (req,res,next)=>{
    let user_status;
    if(req.session.user)
    user_status="User is logged in";
    else
    user_status="User is not logged in";

    //console.log(user_status);
    next();
  });

  app.post('/blog', async (req,res,next)=>{
    if(!req.session.user)
    return res.status(403).json({"error": "User not logged in"});
    else
    next();
  });

  app.put('/blog/:id', async (req,res,next)=>{
    if(!req.session.user)
    return res.status(403).json({"error": "User not logged in"});
    else
    next();
  });

  app.patch('/blog/:id', async (req,res,next)=>{
    //console.log(req.session.id);
    if(!req.session.user)
    return res.status(403).json({"error": "User not logged in"});
    else
    next();
  });

  app.post('/blog/:id/comments', async (req,res,next)=>{
    //console.log(req.session.id);
    if(!req.session.user)
    return res.status(403).json({"error": "User not logged in"});
    else
    next();
  });

  app.delete('/blog/:blogId/:commentId', async (req,res,next)=>{
    //console.log(req.session.id);
    if(!req.session.user)
    return res.status(403).json({"error": "User not logged in"});
    else
    next();
  });

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});