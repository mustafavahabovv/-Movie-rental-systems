import Joi from "joi";

const RegisterValidationSchema = Joi.object({
  image: Joi.string(),
  name: Joi.string().min(3).max(30).required(),
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export default RegisterValidationSchema;
