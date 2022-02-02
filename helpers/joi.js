const Joi = require("joi")

const schema = Joi.object({
	required: Joi.string().max(255).required(),
	optionnal: Joi.string().max(255),
})

/*

Use method :

  schema.validate(objValue-with-same-key)

or promise based :

  const value = await schema.validateAsync(objValue-with-same-key)

*/
