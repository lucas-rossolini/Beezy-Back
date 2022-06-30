const connexion = require('../db-config');

const db = connexion.promise();

const find = (tableName, where = []) => {
  let sqlQuery = 'SELECT * FROM ' + tableName;
  if (where.length > 0) {
    sqlQuery += ' WHERE 1';
    where.forEach((conditions) => {
      sqlQuery +=
        ' AND ' + conditions[0] + conditions[1] + '"' + conditions[2] + '"';
    });
  }
  return db.query(sqlQuery).then((result) => {
    return result[0];
  });
};

const findManyForUser = (tableName, userId) => {
  return find(tableName, [['user_id', '=', userId]]);
};

const findMany = (tableName) => {
  return find(tableName);
};

const findOne = (tableName, id) => {
  return find(tableName, [['id', '=', id]]);
};

const createOne = (tableName, fields, values, methods) => {
  let valuesToInsert = [];
  let valuesPlaceholder = '';

  fields.forEach((field) => {
    if (values[field] === null) {
      return;
    }
    valuesToInsert.push(values[field]);
    valuesPlaceholder += '?,';
  });

  // remove last comma
  valuesPlaceholder = valuesPlaceholder.slice(0, -1);

  return db
    .query(
      `INSERT INTO ${tableName} (${fields.toString()}) VALUES (${valuesPlaceholder})`,
      valuesToInsert
    )
    .then((result) => {
      methods['afterCreate'] ? methods['afterCreate'](result[0]) : '';
      return result;
    })
    .then((result) => result[0]);
};

const deleteOne = (tablename, id) => {
  return db
    .query('DELETE FROM ' + tablename + ' WHERE id = ?', [id])
    .then((result) => result[0]);
};

const model = (tableName, fields, methods = {}) => ({
  find: (where) => find(tableName, where, methods),
  findMany: (where) => findMany(tableName, where),
  findManyForUser: (where) => findManyForUser(tableName, where),
  findOne: (where) => findOne(tableName, where),
  createOne: (values) => createOne(tableName, fields, values, methods),
  // updateOne: (values) => updateOne(tableName, fields, values, where),
  deleteOne: (where) => deleteOne(tableName, where),
});

module.exports = model;
