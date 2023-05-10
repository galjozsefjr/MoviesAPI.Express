import { Movie } from "models"
import { SearchQuery } from "./search-query"

export const sortMovies = (movies: Movie[], { sortBy, sortOrder }: SearchQuery) => {
  const data = [...movies];

  if (sortBy && sortOrder) {
    data.sort((a, b) => {
      let aField = a[sortBy]
      let bField = b[sortBy]

      if (sortOrder === "desc") {
        const tmp = aField;
        aField = bField;
        bField = tmp;
      }

      if (typeof aField === "string") {
        return aField.localeCompare(bField as string);
      }

      if (typeof aField === "number") {
        return aField - (bField as number);
      }

      return 0;
    })
  }

  return data;
}