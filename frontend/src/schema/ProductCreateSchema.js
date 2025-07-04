import * as yup from "yup";

export const productSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  categories: yup
    .array()
    .of(yup.string().required("Each category must be a string"))
    .min(1, "At least one category is required")
    .required("Category is required"),
  image: yup
    .mixed()
    .nullable()
    .notRequired()
    .test("fileSize", "Image is too large", (value) => {
      if (!value) return true; // şəkil yoxdursa, OK-dir
      return value.size <= 5 * 1024 * 1024; // məsələn 5MB limit
    }),

  description: yup.string().required("Description is required"),
  author: yup.string().required("Author is required"),


});