const productRoutes = require("./products");

const constructorMethod = app => {
    app.use("/", productRoutes);

    app.use("*", (req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
};

module.exports = constructorMethod;