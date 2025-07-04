import Joi from "joi";

const ForgotValidationSchema = Joi.object({
  email: Joi.string().email().required(),
});

export default ForgotValidationSchema;
