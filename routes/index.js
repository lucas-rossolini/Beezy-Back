const HivesRouter = require('./hives');
const ObservationsRouter = require('./observations');

const setupApp = (app) => {
  app.use('/hives', HivesRouter);
  app.use('/observations', ObservationsRouter);
};

module.exports = {
  setupApp,
};
