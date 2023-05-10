import { Registration, User } from "../../models";
import { Schema, object, string } from "yup";

export const RegisterSchema: Schema<Partial<Registration>> = object().shape({
  email: string().ensure()
    .required("Please enter your email address")
    .email("Invalid email address"),
  password: string().ensure().trim()
    .required("Please enter a password")
    .min(10, "Your password must be at least 10 characters"),
  firstName: string().ensure().trim()
    .required("Please enter your first name"),
  lastName: string().ensure().trim()
    .required("Please enter your last name")
});