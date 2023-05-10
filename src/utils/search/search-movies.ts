import { Movie } from "models";
import { SearchQuery } from "./search-query";

export const searchMovies = (movies: Movie[], query: SearchQuery) => {
  let data = [...movies];
  const { search, searchBy } = query;

  if (search && searchBy) {
    switch (searchBy) {
      case "title":
        data = movies.filter(
          (item) => (new RegExp(search, 'i')).test(item.title),
        );
        break;

      case "genres": {
        const query = `${search[0].toUpperCase()}${search.slice(1)}`
        data = movies.filter(
          (item) => item.genres.some(genre => (genre as unknown as string).includes(query)),
        )
        break;
      }
    }
  }
  return data;
}