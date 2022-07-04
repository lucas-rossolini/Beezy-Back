const connexion = require('../db-config');

const db = connexion.promise();

const formatBool = (value) => {
  return +value;
};

const find = (tableName, where = [], fields = [], fieldsFormat = {}) => {
  let sqlQuery = 'SELECT * FROM ' + tableName;
  if (where.length > 0) {
    sqlQuery += ' WHERE 1';
    where.forEach((conditions) => {
      sqlQuery += ' AND ' + conditions[0] + conditions[1];
      if (conditions[1] === ' IN ') {
        sqlQuery += conditions[2];
      } else {
        sqlQuery += '"' + conditions[2] + '"';
      }
    });
  }
  return db.query(sqlQuery).then((result) => {
    if (Array.isArray(result[0])) {
      result[0].forEach((e) => (e = mutatedValues(fields, e, fieldsFormat)));
    } else {
      result[0] = mutatedValues(fields, result[0], fieldsFormat);
    }
    return result[0];
  });
};

const findManyForUser = (tableName, userId, fields, fieldsFormat) => {
  return find(tableName, [['user_id', '=', userId]], fields, fieldsFormat);
};

const findMany = (tableName, fields, fieldsFormat) => {
  return find(tableName, [], fields, fieldsFormat);
};

const findOne = (tableName, id, fields, fieldsFormat) => {
  return find(tableName, [['id', '=', id]], fields, fieldsFormat);
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
      methods['afterCreate'] ? methods['afterCreate'](result[0], values) : '';
      return result;
    })
    .then((result) => result[0]);
};

const updateOne = (tableName, fields, values, id, fieldsFormat) => {
  let updateQuery = '';

  values = mutatedValues(fields, values, fieldsFormat);
  fields.forEach((field) => {
    if (values[field] !== undefined) {
      updateQuery += `${field} = "${values[field]}", `;
    }
  });

  // remove last comma
  if (updateQuery !== '') {
    updateQuery = updateQuery.slice(0, -2);
  }

  return db
    .query(`UPDATE ${tableName} SET ${updateQuery} WHERE id = ` + id)
    .then((result) => result[0]);
};

const deleteOne = (tableName, id, methods) => {
  return find(tableName, [['id', '=', id]]).then((idToDelete) => {
    return db
      .query('DELETE FROM ' + tableName + ' WHERE id = ?', [id])
      .then((result) => {
        methods['afterDelete'] ? methods['afterDelete'](idToDelete) : '';
        return result;
      })
      .then((result) => result[0]);
  });
};

const deleteMany = (tableName, where = [], methods) => {
  return find(tableName, where).then((idsToDelete) => {
    const idsToDeleteArray = idsToDelete.map((e) => e.id);
    idsToDeleteArray.push(0);
    let sqlQuery =
      'DELETE FROM ' +
      tableName +
      ' WHERE id IN (' +
      idsToDeleteArray.join(',') +
      ')';
    return db
      .query(sqlQuery)
      .then((result) => {
        methods['afterDelete'] ? methods['afterDelete'](idsToDeleteArray) : '';
        return result;
      })
      .then((result) => result[0]);
  });
};

const mutatedValues = (fields, values, fieldsFormat) => {
  fields.forEach((field) => {
    if (values[field] === null) {
      return;
    }
    if (fieldsFormat?.bool?.includes(field)) {
      values[field] = formatBool(values[field]);
    }
  });
  return values;
};

const model = (tableName, fields, fieldsFormat = {}, methods = {}) => ({
  find: (where) => find(tableName, where, fields, fieldsFormat),
  findMany: () => findMany(tableName, fields, fieldsFormat),
  findManyForUser: (where) =>
    findManyForUser(tableName, where, fields, fieldsFormat),
  findOne: (where) => findOne(tableName, where, fields, fieldsFormat),
  createOne: (values) => createOne(tableName, fields, values, methods),
  updateOne: (id, values) =>
    updateOne(tableName, fields, values, id, fieldsFormat),
  deleteOne: (where) => deleteOne(tableName, where, methods),
  deleteMany: (where) => deleteMany(tableName, where, methods),
  query: (sqlQuery) => db.query(sqlQuery),
});

module.exports = model;
