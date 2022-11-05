const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const static = express.static(__dirname + "/public");  

const app = express();
const configRoutes = require("./routes");

app.use("/", static);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: true} ));
app.engine('handlebars', exphbs( {defaultLayout: 'main'} ));
app.set('view engine', 'handlebars')  

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
})