const AuthRouter = require('./auth');
const HivesRouter = require('./hives');
const VisitsRouter = require('./visits');

const userModel = require('../models/user');

// Define auth routes and use middleware to load current user
const setupApp = (app) => {
  app.use(
    '/auth',
    async (req, res, next) => {
      await userModel
        .find([['token', '=', req.headers.authorization]])
        .then((result) => {
          req.currentUser = result[0];
        });
      next();
    },
    AuthRouter
  );

  // Define hives routes and use middleware to load current user
  app.use(
    '/hives',
    async (req, res, next) => {
      await userModel
        .find([['token', '=', req.headers.authorization]])
        .then((result) => {
          req.currentUser = result[0];
        });
      next();
    },
    HivesRouter
  );

  // Define visits routes and use middleware to load current user
  app.use(
    '/visits',
    async (req, res, next) => {
      await userModel
        .find([['token', '=', req.headers.authorization]])
        .then((result) => {
          req.currentUser = result[0];
        });
      next();
    },
    VisitsRouter
  );
};

module.exports = {
  setupApp,
};
