import { object, string } from "yup";

export const LoginSchema = object().shape({
  username: string().ensure()
    .required("Please enter your username")
    .max(100, "Too long username"),
  password: string().ensure()
    .required("Please enter your password")
    .min(10, "Your password is too short")
});