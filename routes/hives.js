const Joi = require('joi');
const hivesRouter = require('express').Router();
const hiveModel = require('../models/hive');
const Response = require('../Services/Response');

// check input fields for hive with JOI validator
const checkHivesFields = (data, create = false) => {
  const presence = create ? 'required' : 'optional';
  return Joi.object({
    id: Joi.number().presence('optional'),
    label: Joi.string().max(250).presence(presence),
    cluster_id: Joi.number().integer().presence('optional'),
    state: Joi.number().integer().presence(presence),
    honey_super: Joi.number().integer().presence(presence),
    swarming_risk: Joi.number().integer().presence(presence),
    queen_birth: Joi.number().integer().presence(presence),
    behaviour: Joi.number().integer().presence(presence),
  }).validate(data, { abortEarly: false }).error;
};

// all hives for current user route
hivesRouter.get('/', (req, res) => {
  Response(() => hiveModel.getAllForUser(req.currentUser.id), res);
});

// hives count group by state route
hivesRouter.get('/group-by-state', (req, res) => {
  Response(() => {
    return (
      hiveModel
        .getAllForUserByState(req.currentUser.id)
        .then((hiveByState) => {
          let hiveByStateProcessed = {};
          hiveByState.forEach(
            (e) => (hiveByStateProcessed[e.state] = e.hive_count)
          );
          return hiveByStateProcessed;
        })
        // add hive count with swarminng risk
        .then((hiveByStateProcessed) => {
          return hiveModel
            .getAllForUserBySwarm(req.currentUser.id)
            .then((result) => {
              hiveByStateProcessed['swarm'] = result[0].swarm_count;
              return hiveByStateProcessed;
            });
        })
    );
  }, res);
});

// get single hive route
hivesRouter.get('/:id', (req, res) => {
  Response(() => hiveModel.findOneWithVisits(req.params.id), res);
});

// add new hive route
hivesRouter.post('/', (req, res) => {
  const error = checkHivesFields(req.body, true);
  if (error) {
    res.status(401).send({ msg: 'Champs incorrects', error });
  } else {
    req.body.currentUser = req.currentUser;
    Response(() => hiveModel.createOne(req.body), res);
  }
});

// update hive route
hivesRouter.put('/:id', (req, res) => {
  const error = checkHivesFields(req.body, true);
  if (error) {
    res.status(401).send({ msg: 'Champs incorrects', error });
  } else {
    Response(() => hiveModel.updateOne(req.params.id, req.body), res);
  }
});

// delete hive route
hivesRouter.delete('/:id', (req, res) => {
  Response(() => hiveModel.deleteOne(req.params.id), res);
});

module.exports = hivesRouter;
