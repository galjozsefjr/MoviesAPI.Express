import { Movie } from "models";
import { SearchQuery } from "./search-query";

export const filterMovies = (movies: Movie[], { filter }: SearchQuery) => {
  let data = [...movies];

  const parsedGenres = filter && filter.split(',');

  if (parsedGenres && parsedGenres.length) {
    const filterLength = parsedGenres.length;
    const filterMap = parsedGenres.reduce(
      (prev, curr) => Object.assign(prev, { [curr.toLowerCase().trim()]: true }),
      {},
    );

    data = movies.filter(item => {
      const array = item.genres || [];

      const count = array.reduce(
        (prev, curr) => prev + (filterMap[(curr as unknown as string).toLowerCase().trim()] ? 1 : 0),
        0,
      );

      return count >= filterLength;
    });
  }

  return data
}
