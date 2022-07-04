/* eslint-disable no-undef */
const AuthRouter = require('./auth');
const HivesRouter = require('./hives');
const VisitsRouter = require('./visits');
const LogoutRouter = require('./logout');

const userModel = require('../models/user');

// function parseCookies(request) {
//   const list = {};
//   const cookieHeader = request.headers?.cookie;
//   if (!cookieHeader) return list;
//   cookieHeader.split(`;`).forEach(function (cookie) {
//     let [name, ...rest] = cookie.split(`=`);
//     name = name?.trim();
//     if (!name) return;
//     const value = rest.join(`=`).trim();
//     if (!value) return;
//     list[name] = decodeURIComponent(value);
//   });

//   return list;
// }

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
  app.use('/logout', LogoutRouter);
};

module.exports = {
  setupApp,
};
