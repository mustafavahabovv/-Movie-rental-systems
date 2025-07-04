import * as yup from "yup";

export const forgotschema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter valid email address")
    .required("Email is required"),
});
