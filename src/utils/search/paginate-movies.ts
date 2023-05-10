import { Movie } from "models";
import { SearchQuery } from "./search-query";

export const paginateMovies = (movies: Movie[], { offset, limit }: SearchQuery) => {
  const totalAmount = movies.length;
  const data = movies.slice(offset, offset + limit);

  return {
    totalAmount,
    data,
  };
}
