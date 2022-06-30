/* eslint-disable no-undef */
const model = require('./model');
const userHiveModel = require('./userHives');

module.exports = model(
  'hive',
  ['label', 'cluster_id', 'honey_super', 'state', 'swarming_risk'],
  {
    afterCreate: (data) => {
      console.log(currentUser);
      userHiveModel.createOne({
        hive_id: data.insertId,
        user_id: currentUser.id,
      });
    },
  }
);
