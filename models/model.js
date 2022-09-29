const connexion = require('../db-config');

const db = connexion.promise();

// fields mutator for boolean values
const formatBool = (value) => {
  return +value;
};

// generic FIND function
// WHERE parameter is a nested array formated like : field - symbol - value
const find = (tableName, where = [], fields = [], fieldsFormat = {}) => {
  let sqlQuery = 'SELECT * FROM ' + tableName;
  if (where.length > 0) {
    sqlQuery += ' WHERE 1';
    // construct WHERE condition
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
    // handle single or multiple results and mutate them
    if (Array.isArray(result[0])) {
      result[0].forEach((e) => (e = mutatedValues(fields, e, fieldsFormat)));
    } else {
      result[0] = mutatedValues(fields, result[0], fieldsFormat);
    }
    return result[0];
  });
};

// specific query to FIND model with userid
const findManyForUser = (tableName, userId, fields, fieldsFormat) => {
  return find(tableName, [['user_id', '=', userId]], fields, fieldsFormat);
};

// FIND with empty WHERE condition
const findMany = (tableName, fields, fieldsFormat) => {
  return find(tableName, [], fields, fieldsFormat);
};

// FIND a specific id
const findOne = (tableName, id, fields, fieldsFormat) => {
  return find(tableName, [['id', '=', id]], fields, fieldsFormat);
};

// create a new entry in the database
const createOne = (tableName, fields, values, methods) => {
  let valuesToInsert = [];
  let valuesPlaceholder = '';

  // loop through model fields
  fields.forEach((field) => {
    // check if field has a value
    if (values[field] === null) {
      return;
    }
    // build values to insert in query
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
      // lauch afterCreate hook if exists
      methods['afterCreate'] ? methods['afterCreate'](result[0], values) : '';
      return result;
    })
    .then((result) => result[0]);
};

// update a record
const updateOne = (tableName, fields, values, id, fieldsFormat) => {
  let updateQuery = '';

  // mutate value
  values = mutatedValues(fields, values, fieldsFormat);

  // build update query
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

// delete a record
const deleteOne = (tableName, id, methods) => {
  // first find the record id to delete it
  return find(tableName, [['id', '=', id]]).then((idToDelete) => {
    return db
      .query('DELETE FROM ' + tableName + ' WHERE id = ?', [id])
      .then((result) => {
        // lauch afterDelete hook if exists
        methods['afterDelete'] ? methods['afterDelete'](idToDelete) : '';
        return result;
      })
      .then((result) => result[0]);
  });
};

// delete multiple records
const deleteMany = (tableName, where = [], methods) => {
  // first find the records ids to delete them
  return find(tableName, where).then((idsToDelete) => {
    // only keep list of ids
    const idsToDeleteArray = idsToDelete.map((e) => e.id);
    // add 0 to prevent case where array is empty
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
        // lauch afterDelete hook if exists
        methods['afterDelete'] ? methods['afterDelete'](idsToDeleteArray) : '';
        return result;
      })
      .then((result) => result[0]);
  });
};

// launch fieldsFormat functions to mutate values accordingly
const mutatedValues = (fields, values, fieldsFormat) => {
  fields.forEach((field) => {
    if (values[field] === null) {
      return;
    }
    if (fieldsFormat?.bool?.includes(field)) {
      values[field] = formatBool(values[field]);
    }
    // if (fieldsFormat?.date?.includes(field)) {
    //   values[field] = formatDate(values[field]);
    // }
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
