const authRouter = require('express').Router();
const Joi = require('joi');
// const Model = require('../models/model');
const Response = require('../Services/Response');
const userModel = require('../models/user');
const crypto = require('crypto');

const getSHA256 = function (input) {
  return crypto.createHash('sha256').update(input).digest('hex');
};

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

authRouter.post('/', (req, res) => {
  userModel
    .find([
      ['email', '=', req.body.email],
      ['password', '=', getSHA256(req.body.password)],
    ])
    .then((auth) => {
      if (auth.length === 1) {
        auth[0].token = Math.random().toString(36) + Math.random().toString(36);
        userModel.updateOne(auth[0].id, auth[0]);
        res.status(200).json(auth[0].token);
      } else {
        res.status(401).send('Accès refusé');
      }
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .send(
          'Une erreur est survenue pour récupérer les utilisateurs depuis le serveur'
        );
    });
});

authRouter.post('/create-user', (req, res) => {
  const error = checkUserFields(req.body, true);
  if (error) {
    res.status(401).send({ msg: 'Champs incorrects', error });
  } else {
    req.body.password = getSHA256(req.body.password);
    Response(() => userModel.createOne(req.body), res);
  }
});

authRouter.post('/logout', (req, res) => {
  Response(() => userModel.updateOne(req.currentUser.id, { token: '' }), res);
});

module.exports = authRouter;
