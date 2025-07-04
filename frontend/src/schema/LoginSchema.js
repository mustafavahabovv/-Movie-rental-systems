import * as yup from "yup";

export const loginschema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .lowercase("Username must be lowercase"),
  password: yup.string().required("Password is required"),
});
