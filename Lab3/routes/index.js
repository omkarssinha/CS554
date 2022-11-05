const showRoutes = require('./shows');
const searchRoutes = require('./search');
const homepageRoutes = require('./homepage');
const popularsearchRoutes = require('./popularsearches')

const constructorMethod = (app) => {

  app.use('/', homepageRoutes);

  app.use('/shows', showRoutes);
  
  app.use('/search', searchRoutes);

  app.use('/popularsearches', popularsearchRoutes);
    
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;