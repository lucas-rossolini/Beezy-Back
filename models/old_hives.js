const Joi = require('joi');
const connexion = require('../db-config');

const db = connexion.promise();

const checkHivesFields = (data, create = false) => {
  const presence = create ? 'required' : 'optional';
  return Joi.object({
    id: Joi.number().presence('optional'),
    name: Joi.string().max(250).presence(presence),
  }).validate(data, { abortEarly: false }).error;
};

const findMany = (query) => {
  let sqlQuery =
    'SELECT * FROM ruches INNER JOIN observations ON ruches.id = observations.ruche_id WHERE observations.date = (SELECT MAX(observations.date) from observations WHERE observations.ruche_id = ruches.id )';
  const sqlValue = [];
  let transitionWord = ' WHERE';

  if (query.name) {
    sqlQuery += `${transitionWord} name = ?`;
    sqlValue.push(query.genre);
    transitionWord = 'AND';
  }

  return db.query(sqlQuery, sqlValue).then((result) => result[0]);
};

const findOne = (hiveId) => {
  return db
    .query('SELECT * FROM ruches WHERE id = ?', [hiveId])
    .then((result) => result[0]);
};

const findLastObserv = () => {
  return db
    .query(
      'SELECT * FROM ruches INNER JOIN observations ON ruches.id = observations.ruche_id WHERE observations.date = (SELECT MAX(observations.date) from observations WHERE observations.ruche_id = ruches.id )'
    )
    .then((result) => result[0]);
};

const createOne = ({ name }) => {
  return db
    .query('INSERT INTO ruches(name) VALUES (?)', [name])
    .then((result) => result[0]);
};

const updateOne = (hiveId, hiveData) => {
  return db
    .query('UPDATE ruches SET ? WHERE id = ?', [hiveData, hiveId])
    .then((result) => result[0]);
};

const deleteOne = (hiveId) => {
  return db
    .query('DELETE FROM ruches WHERE id = ?', [hiveId])
    .then((result) => result[0]);
};

module.exports = {
  findOne,
  findMany,
  findLastObserv,
  createOne,
  updateOne,
  deleteOne,
  checkHivesFields,
};
