const Joi = require('joi').extend(require('@joi/date'));
const connexion = require('../db-config');

const db = connexion.promise();

const checkObservationFields = (data, create = false) => {
  const presence = create ? 'required' : 'optional';
  return Joi.object({
    date: Joi.string().max(255).presence(presence),
    couvain: Joi.number().presence(presence),
    miel: Joi.number().presence(presence),
    status: Joi.string().max(100).presence(presence),
    ruche_id: Joi.number().integer().min(1).presence(presence),
  }).validate(data, { abortEarly: false }).error;
};

const findMany = (rucheId) => {
  return db
    .query(
      'SELECT * FROM observations WHERE ruche_id = ? ORDER BY observations.date DESC',
      [rucheId]
    )
    .then((result) => result[0]);
};

const findOne = (observationId) => {
  return db
    .query('SELECT * FROM observations WHERE id = ?', [observationId])
    .then((result) => result[0]);
};

const createOne = ({ date, couvain, miel, status, ruche_id }) => {
  return db
    .query(
      'INSERT INTO observations(`date`, `couvain`, `miel`, `status`, `ruche_id`) VALUES (?, ?, ?, ?, ?)',
      [date, couvain, miel, status, ruche_id]
    )
    .then((result) => result[0]);
};

const updateOne = (observationId, observationData) => {
  return db
    .query('UPDATE observations SET ? WHERE id = ?', [
      observationData,
      observationId,
    ])
    .then((result) => result[0]);
};

const deleteOne = (observationId) => {
  return db
    .query('DELETE FROM observations WHERE id = ?', [observationId])
    .then((result) => result[0]);
};

const deleteAll = (rucheId) => {
  return db
    .query('DELETE FROM observations WHERE ruche_id = ?', [rucheId])
    .then((result) => result[0]);
};

module.exports = {
  findOne,
  findMany,
  createOne,
  updateOne,
  deleteOne,
  deleteAll,
  checkObservationFields,
};
