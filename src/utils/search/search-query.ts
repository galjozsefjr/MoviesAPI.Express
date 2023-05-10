import { Movie } from "models";
import { number, string } from "yup";
import { Schema, object } from "yup";

export interface SearchQuery {
  filter?: string;
  search?: string;
  searchBy?: "title" | "genres";
  sortBy?: keyof Movie;
  sortOrder?: "asc" | "desc";
  offset?: number;
  limit?: number;
}

export const SearchQueryModel: Schema<SearchQuery> = object({
  filter: string().optional().default(undefined),
  search: string().optional().default(undefined),
  searchBy: string().oneOf(["title", "genres"]).optional().default("title"),
  sortOrder: string().optional().oneOf(["asc", "desc"]).default("asc"),
  offset: number().optional().default(0),
  limit: number().optional().default(10),
});