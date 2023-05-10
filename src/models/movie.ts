import { array, number, object, Schema, string } from "yup";
import { Genre } from "./genre";

export interface MovieBase {
  title: string;
  tagline?: string;
  vote_avarage?: number;
  release_date?: string;
  poster_path: string;
  overview: string;
  budget?: number;
  genres: Genre[];
  runtime: number;
}

export interface Movie extends MovieBase {
  id: number;
}

export const MovieBaseModel: Schema<Partial<MovieBase>> = object({
  title: string().required('Missing title'),
  tagline: string().optional().default(undefined),
  vote_average: number()
    .optional()
    .integer("Should be between 0 and 100")
    .min(0, "Must not be less than 0")
    .max(100, "Must not be greater than 100")
    .default(0),
  vote_count: number()
    .optional()
    .integer("Expected positive integer")
    .min(0, "Must not be less than 0")
    .default(0),
  release_date: string()
    .required("Missing release date")
    .test((date) => new Date(date).toString() !== "Invalid Date"),
  poster_path: string()
    .required("Please define poster path")
    .url("A valid URL is expected"),
  overview: string()
    .required("Please define movie's overview"),
  budget: number()
    .optional()
    .integer("Valid budget number is expected")
    .min(0, "Must not be less than 0")
    .default(undefined),
  revenue: number()
    .optional()
    .integer("Invalid revenue number")
    .min(0, "Must not be less than 0")
    .default(undefined),
  genres: array<Genre[]>().ensure().default([]),
  runtime: number()
    .integer("Invalid runtime")
    .required("Please enter runtime")
    .min(0, "Must not be less than 0"),
});