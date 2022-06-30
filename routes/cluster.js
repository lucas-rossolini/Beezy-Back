// const moment = require('moment');
const Joi = require('joi');
const clusterRouter = require('express').Router();
const clusterModel = require('../models/cluster');
const Response = require('../Services/Response');

const checkClusterFields = (data, create = false) => {
  const presence = create ? 'required' : 'optional';
  return Joi.object({
    id: Joi.number().presence('optional'),
    label: Joi.string().max(250).presence(presence),
    state: Joi.number().presence(presence),
    swarming_risk: Joi.boolean(),
  }).validate(data, { abortEarly: false }).error;
};

clusterRouter.get('/', (req, res) => {
  Response(() => clusterModel.findMany(), res);
});

clusterRouter.get('/:id', (req, res) => {
  Response(() => clusterModel.findOne(req.params.id), res);
});

clusterRouter.post('/', (req, res) => {
  const error = checkClusterFields(req.body, true);
  if (error) {
    res.status(401).send({ msg: 'Champs incorrects', error });
  } else {
    Response(() => clusterModel.createOne(req.body), res);
  }
});

clusterRouter.put('/:id', (req, res) => {
  const error = clusterModel.checkHivesFields(req.body, true);
  if (error) {
    res.status(401).send({ msg: 'Champs incorrects', error });
  } else {
    clusterModel
      .updateOne(req.params.id, req.body)
      .then((result) => {
        res.send({ success: 'Ruche mise à jour avec succès !', data: result });
      })
      .catch((err) => {
        console.error(err);
        res.send('Une erreur est survenue lors de la mise à jour de la ruche');
      });
  }
});

module.exports = clusterRouter;
