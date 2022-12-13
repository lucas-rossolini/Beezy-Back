const model = require('./model');
const userHiveModel = require('./userHives');
const visitModel = require('./visit');

const fieldsFormat = { bool: ['swarming_risk'] };

// construct model instance with hive table informations
const modelInstance = model(
  'hive',
  [
    'label',
    'cluster_id',
    'honey_super',
    'state',
    'swarming_risk',
    'queen_birth',
    'behaviour',
  ],
  fieldsFormat,
  {
    afterCreate: (createdData, insertedValues) => {
      userHiveModel.createOne({
        hive_id: createdData.insertId,
        user_id: insertedValues.currentUser.id,
      });
    },
    afterDelete: (idToDelete) => {
      visitModel.deleteMany([['hive_id', '=', idToDelete[0].id]]);
    },
  }
);

// specific query to get all hives annd their visits for one user
const getAllForUser = (user_id) => {
  let sqlQuery =
    'SELECT hive.*, visit.date as last_visit_date ' +
    'FROM hive ' +
    'LEFT JOIN visit ON (visit.hive_id = hive.id AND visit.id = (SELECT MAX(visit_group.id) FROM visit as visit_group WHERE visit_group.hive_id = hive.id)) ' +
    'JOIN user_hives ON user_hives.hive_id = hive.id ' +
    'WHERE user_hives.user_id = ' +
    user_id;
  return modelInstance.query(sqlQuery).then((result) => result[0]);
};

// specific query to get count of hives by state
const getAllForUserByState = (user_id) => {
  let sqlQuery =
    'SELECT COUNT(hive.id) as hive_count, state ' +
    'FROM hive ' +
    'JOIN user_hives ON user_hives.hive_id = hive.id ' +
    'WHERE user_hives.user_id = ' +
    user_id +
    ' GROUP BY state';

  return modelInstance.query(sqlQuery).then((result) => result[0]);
};

// specific query to get count of hives with a swarming risk
const getAllForUserBySwarm = (user_id) => {
  let sqlQuery =
    'SELECT COUNT(hive.id) as swarm_count ' +
    'FROM hive ' +
    'JOIN user_hives ON user_hives.hive_id = hive.id ' +
    'WHERE swarming_risk = 1 AND user_hives.user_id = ' +
    user_id;

  return modelInstance.query(sqlQuery).then((result) => result[0]);
};

// specific quesry to get one hive with all its visits and linked actions
const findOneWithVisits = (hive_id) => {
  let sqlQuery =
    'SELECT hive.*, visit.id as visit_id, visit.comment as visit_comment, visit.date as visit_date, action.label as action_label, visit_actions.comment as action_comment, visit_actions.id as visit_action_id ' +
    'FROM hive ' +
    'LEFT JOIN visit ON visit.hive_id = hive.id ' +
    'LEFT JOIN visit_actions ON visit_actions.visit_id = visit.id ' +
    'LEFT JOIN action ON visit_actions.action_id = action.id ' +
    'WHERE hive.id = ' +
    hive_id;

  return modelInstance.query(sqlQuery).then((result) => {
    // formatting result object
    let formatedHive = {};
    const resultHive = result[0];

    formatedHive.id = resultHive[0].id;
    formatedHive.label = resultHive[0].label;
    formatedHive.honey_super = resultHive[0].honey_super;
    formatedHive.state = resultHive[0].state;
    formatedHive.swarming_risk = resultHive[0].swarming_risk;
    formatedHive.cluster_id = resultHive[0].cluster_id;
    formatedHive.queen_birth = resultHive[0].queen_birth;
    formatedHive.behaviour = resultHive[0].behaviour;
    formatedHive.visits = {};

    // looping throught actions
    resultHive.forEach((e) => {
      if (formatedHive.visits[e.visit_id] === undefined) {
        formatedHive.visits[e.visit_id] = {};
        formatedHive.visits[e.visit_id].actions = {};
        formatedHive.visits[e.visit_id].id = e.visit_id;
        formatedHive.visits[e.visit_id].comment = e.visit_comment;
        formatedHive.visits[e.visit_id].date = e.visit_date;
      }
      formatedHive.visits[e.visit_id].actions[e.visit_action_id] = {};
      formatedHive.visits[e.visit_id].actions[e.visit_action_id].label =
        e.action_label;
      formatedHive.visits[e.visit_id].actions[e.visit_action_id].comment =
        e.action_comment;
    });
    return formatedHive;
  });
};

module.exports = {
  ...modelInstance,
  getAllForUser: (user_id) => getAllForUser(user_id),
  getAllForUserByState: (user_id) => getAllForUserByState(user_id),
  getAllForUserBySwarm: (user_id) => getAllForUserBySwarm(user_id),
  findOneWithVisits: (hive_id) => findOneWithVisits(hive_id),
};
