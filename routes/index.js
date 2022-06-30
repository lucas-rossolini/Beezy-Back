const AuthRouter = require('./auth');
const HivesRouter = require('./hives');
const LogoutRouter = require('./logout');

const userModel = require('../models/user');

function parseCookies(request) {
  const list = {};
  const cookieHeader = request.headers?.cookie;
  if (!cookieHeader) return list;
  cookieHeader.split(`;`).forEach(function (cookie) {
    let [name, ...rest] = cookie.split(`=`);
    name = name?.trim();
    if (!name) return;
    const value = rest.join(`=`).trim();
    if (!value) return;
    list[name] = decodeURIComponent(value);
  });

  return list;
}

const setupApp = async (app) => {
  await app.use(async (req, res, next) => {
    app.request.cookies = parseCookies(app.request);
    await userModel
      .find([['email', '=', req.headers.authorization]])
      .then((result) => (global.currentUser = result[0]));

    next();
  });
  app.use('/auth', AuthRouter);
  app.use('/hives', HivesRouter);
  app.use('/logout', LogoutRouter);
};

module.exports = {
  setupApp,
};
