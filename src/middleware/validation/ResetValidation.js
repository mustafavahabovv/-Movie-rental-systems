import Joi from "joi";

const ResetValidationSchema = Joi.object({
  password: Joi.string().min(6).required(),
});

export default ResetValidationSchema;
