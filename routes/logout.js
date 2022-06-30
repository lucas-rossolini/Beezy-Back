const logoutRouter = require('express').Router();
const Model = require('../models/model');
const userModel = require('../models/user');

logoutRouter.post('/', (req, res) => {
  Model.find(userModel.tableName, [])
    .then((auth) => {
      if (auth.length === 1) {
        res.status(200).json(auth);
      } else {
        res.status(401).send('Accès refusé');
      }
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .send(
          'Une erreur est survenue pour récupérer les ruches depuis le serveur'
        );
    });
});

// authRouter.get('/session', (req, res) => {

// });

module.exports = logoutRouter;
