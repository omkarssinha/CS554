const express = require("express");
const router = express.Router();
const products = require("../data/products");

router.get("/", async (req, res) => {
    try {
        res.render("layouts/main", {"products":products} );
    }catch(e) {
        res.status(404);
    };
});
module.exports = router;