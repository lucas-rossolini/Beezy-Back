const Joi = require('joi');
const connexion = require('../db-config');

const db = connexion.promise();

const checkObservationsFields = (data, create = false) => {
  const presence = create ? 'required' : 'optional';
  return Joi.object({
    id: Joi.number().presence('optional'),
    date: Joi.date().presence(presence),
    couvain: Joi.boolean().presence(presence),
    miel: Joi.boolean().presence(presence),
    status: Joi.string().max(100).presence(presence),
    ruche_id: Joi.number().integer().min(1).presence(presence),
  }).validate(data, { abortEarly: false }).error;
};

const findMany = (query) => {
  let sqlQuery = 'SELECT * FROM observations';
  const sqlValue = [];
  let transitionWord = ' WHERE';

  if (query.ruche_id) {
    sqlQuery += `${transitionWord} name = ?`;
    sqlValue.push(query.ruche_id);
    transitionWord = 'AND';
  }

  return db.query(sqlQuery, sqlValue).then((result) => result[0]);
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

module.exports = {
  findOne,
  findMany,
  createOne,
  updateOne,
  deleteOne,
  checkObservationsFields,
};
