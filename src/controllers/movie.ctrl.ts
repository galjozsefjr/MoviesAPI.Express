import { readFileSync } from "fs";
import { remove } from "lodash";
import { resolve } from "path";

import { Movie, MovieBase } from "../models";
import { generateId } from "../utils";
import { SearchQuery, filterMovies, paginateMovies, searchMovies, sortMovies } from "../utils/search";

const MOVIES: Movie[] = ((path) => {
  try {
    const rawData = readFileSync(path, "utf8");
    return JSON.parse(rawData) as Movie[];
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})(resolve(__dirname, "data/movies.json"));


export const getMovies = (query: SearchQuery): Promise<ReturnType<typeof paginateMovies>> => {
  const foundMovies = searchMovies(MOVIES, query);
  const filteredMovies = filterMovies(foundMovies, query);
  const sortedMovies = sortMovies(filteredMovies, query);
  return Promise.resolve(paginateMovies(sortedMovies, query));
};

export const getMovieById = (movieId: Movie["id"]): Promise<Movie | undefined> => {
  return Promise.resolve(MOVIES.find((movie) => movie.id === movieId));
}

export const deleteMovie = (movieId: Movie["id"]): Promise<number> => {
  const removedElements = remove(MOVIES, (movie) => movie.id === movieId);

  return Promise.resolve(removedElements.length);
}

export const addMovie = (movie: MovieBase): Promise<Movie> => {
  const newMovie = {
    ...movie,
    id: generateId(),
  }

  MOVIES.push(newMovie)

  return Promise.resolve(newMovie);
}

export const updateMovie = (movie: Movie): Promise<Movie> => {
  const movieIndex = MOVIES.findIndex((m) => m.id === movie.id);

  if (movieIndex < 0) {
    return Promise.reject(`Movie not found: "${movie.id}"`);
  }

  MOVIES[movieIndex] = movie;

  return Promise.resolve(movie);
}