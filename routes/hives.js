// const moment = require('moment');
const Joi = require('joi');
const hivesRouter = require('express').Router();
const hiveModel = require('../models/hive');
// const Observations = require('../models/old_observations');
const Response = require('../Services/Response');

const checkHivesFields = (data, create = false) => {
  const presence = create ? 'required' : 'optional';
  return Joi.object({
    id: Joi.number().presence('optional'),
    label: Joi.string().max(250).presence(presence),
    cluster_id: Joi.number().integer().presence('optional'),
    state: Joi.number().integer().presence(presence),
    honey_super: Joi.number().integer().presence(presence),
    swarming_risk: Joi.boolean().presence(presence),
  }).validate(data, { abortEarly: false }).error;
};

hivesRouter.get('/', (req, res) => {
  Response(() => hiveModel.findMany(), res);
});

hivesRouter.get('/:id', (req, res) => {
  Response(() => hiveModel.findOne(req.params.id), res);
});

hivesRouter.post('/', (req, res) => {
  const error = checkHivesFields(req.body, true);
  if (error) {
    res.status(401).send({ msg: 'Champs incorrects', error });
  } else {
    Response(() => hiveModel.createOne(req.body), res);
  }
});

// hivesRouter.put('/:id', (req, res) => {
//   const error = hiveModel.checkHivesFields(req.body, true);
//   if (error) {
//     res.status(401).send({ msg: 'Champs incorrects', error });
//   } else {
//     hiveModel
//       .updateOne(req.params.id, req.body)
//       .then((result) => {
//         res.send({ success: 'Ruche mise à jour avec succès !', data: result });
//       })
//       .catch((err) => {
//         console.error(err);
//         res.send('Une erreur est survenue lors de la mise à jour de la ruche');
//       });
//   }
// });

hivesRouter.put('/:id', (req, res) => {
  const error = hiveModel.checkHivesFields(req.body, true);
  if (error) {
    res.status(401).send({ msg: 'Champs incorrects', error });
  } else {
    Response(() => hiveModel.updateOne(req.params.id, req.body), res);
  }
});

// hivesRouter.delete('/:id', (req, res) => {
//   Observations.deleteAll(req.params.id)
//     .then((result) => {
//       hiveModel.deleteOne(req.params.id);
//       res.send({ success: 'Ruche supprimée avec succès !', data: result });
//     })
//     .catch((err) => {
//       console.error(err);
//       res.send('Une erreur est survenue lors de la suppression de la ruche');
//     });
// });

hivesRouter.delete('/:id', (req, res) => {
  Response(() => hiveModel.deleteOne(req.params.id), res);
});

module.exports = hivesRouter;
