/* eslint-disable no-undef */
const model = require('./model');
const visitActionsModel = require('./visitActions');

const fieldsFormat = {};

const modelInstance = model(
  'visit',
  ['date', 'comment', 'user_id', 'hive_id'],
  fieldsFormat,
  {
    afterCreate: (createdData, insertedValues) => {
      for (const [actionId, actionComment] of Object.entries(
        insertedValues.actions
      )) {
        visitActionsModel.createOne({
          visit_id: createdData.insertId,
          action_id: actionId,
          comment: actionComment,
        });
      }
    },
    afterDelete: (idsToDelete) => {
      if (!Number.isInteger(idsToDelete[0])) {
        idsToDelete = idsToDelete.map((e) => e.id);
      }
      visitActionsModel.deleteMany([
        ['visit_id', ' IN ', '(' + idsToDelete.join(',') + ')'],
      ]);
    },
  }
);

const getAllByUser = (user_id) => {
  let sqlQuery =
    'SELECT visit.*, visit_actions.id as va_id, action.label, hive.label as hive_label ' +
    'FROM visit ' +
    'LEFT JOIN visit_actions ON visit_actions.visit_id = visit.id ' +
    'LEFT JOIN action ON visit_actions.action_id = action.id ' +
    'LEFT JOIN hive ON visit.hive_id = hive.id ' +
    'WHERE visit.user_id = ' +
    user_id;
  return modelInstance.query(sqlQuery).then((result) => result[0]);
};

module.exports = {
  ...modelInstance,
  getAllByUser: (hive_id) => getAllByUser(hive_id),
};
