const ApiRouter = require("./apiRouter")

const setupApp = (app) => {
	app.use("/api", ApiRouter)
}

module.exports = {
	setupApp,
}
