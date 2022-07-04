/* eslint-disable no-undef */
const moment = require('moment');
const Joi = require('joi');
const visitsRouter = require('express').Router();
const visitModel = require('../models/visit');
const actionModel = require('../models/action');
const Response = require('../Services/Response');

const checkVisitsFields = (data, create = false) => {
  const presence = create ? 'required' : 'optional';
  return Joi.object({
    id: Joi.number().presence('optional'),
    date: Joi.date().presence('optional'),
    actions: Joi.any().presence('required'),
    comment: Joi.string().presence('optional'),
    user_id: Joi.number().integer().presence('optional'),
    hive_id: Joi.number().integer().presence(presence),
  }).validate(data, { abortEarly: false }).error;
};

visitsRouter.get('/', (req, res) => {
  Response(() => visitModel.getAllByUser(req.currentUser.id), res);
});

visitsRouter.get('/actions', (req, res) => {
  Response(() => actionModel.findMany(), res);
});

visitsRouter.get('/:id', (req, res) => {
  Response(() => visitModel.findOne(req.params.id), res);
});

visitsRouter.post('/', (req, res) => {
  // const error = checkVisitsFields(req.body, true);
  console.log(req.body);
  const error = false;
  if (error) {
    res.status(401).send({ msg: 'Champs incorrects', error });
  } else {
    req.body.user_id = req.currentUser.id;
    req.body.date = moment().format('YYYY-MM-DD HH:mm:ss');
    Response(() => visitModel.createOne(req.body), res);
  }
});

visitsRouter.put('/:id', (req, res) => {
  const error = checkVisitsFields(req.body, true);
  if (error) {
    res.status(401).send({ msg: 'Champs incorrects', error });
  } else {
    Response(() => visitModel.updateOne(req.params.id, req.body), res);
  }
});

visitsRouter.delete('/:id', (req, res) => {
  Response(() => visitModel.deleteOne(req.params.id), res);
});

module.exports = visitsRouter;
