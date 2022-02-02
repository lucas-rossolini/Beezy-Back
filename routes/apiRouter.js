const ApiRouter = require("express").Router()
const router = ApiRouter

router.get("/", async (req, res) => {
	try {
		console.log("GET /api/")

		res.status(200).json({
			success: true,
			msg: "",
		})
	} catch (err) {
		res.status(500).json({
			success: false,
			msg: err.message ? err.message : err.sqlMessage,
		})
	}
})

module.exports = ApiRouter
