const authRouter = require('express').Router();
const Joi = require('joi');
const Response = require('../Services/Response');
const userModel = require('../models/user');
const crypto = require('crypto');

//hash password function
const getSHA256 = function (input) {
  return crypto.createHash('sha256').update(input).digest('hex');
};

// check input fields for user with JOI validator
const checkUserFields = (data, create = false) => {
  const presence = create ? 'required' : 'optional';
  return Joi.object({
    id: Joi.number().presence('optional'),
    first_name: Joi.string().max(250).presence(presence),
    last_name: Joi.string().max(250).presence(presence),
    email: Joi.string().email().max(250).presence(presence),
    password: Joi.string().max(250).presence(presence),
  }).validate(data, { abortEarly: false }).error;
};

// authentification route
authRouter.post('/', (req, res) => {
  Response(
    () =>
      userModel
        .find([
          ['email', '=', req.body.email],
          ['password', '=', getSHA256(req.body.password)],
        ])
        .then((auth) => {
          if (auth.length === 1) {
            // create random token for user
            auth[0].token =
              Math.random().toString(36) + Math.random().toString(36);
            userModel.updateOne(auth[0].id, auth[0]);

            // return only current user token for further authentification
            return auth[0].token;
          }
          return false;
        }),
    res
  );
});

// create user route
authRouter.post('/create-user', (req, res) => {
  const error = checkUserFields(req.body, true);
  if (error) {
    res.status(401).send({ msg: 'Champs incorrects', error });
  } else {
    // hash password
    req.body.password = getSHA256(req.body.password);
    Response(() => userModel.createOne(req.body), res);
  }
});

// logout route
authRouter.post('/logout', (req, res) => {
  // empty current user token to prevent authentification aka logout
  Response(() => userModel.updateOne(req.currentUser.id, { token: '' }), res);
});

module.exports = authRouter;
