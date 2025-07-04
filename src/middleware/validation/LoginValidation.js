import Joi from "joi";

const LoginValidationSchema = Joi.object({
  username: Joi.required(),
  password: Joi.string().min(6).required(),
});

export default LoginValidationSchema;
