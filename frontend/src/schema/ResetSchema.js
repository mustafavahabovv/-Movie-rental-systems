import * as yup from "yup";

export const resetschema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
  confirmpassword: yup
    .string()
    .required("ConfirmPassword is required")
    .oneOf([yup.ref("password", yup.password)], "Password's not match"),
});