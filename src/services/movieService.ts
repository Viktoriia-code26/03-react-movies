import axios from "axios";
import type { Movie } from "../types/movie";

interface MovieHttpResponse {
  results: Movie[];
}

const token = import.meta.env.VITE_TMDB_TOKEN;
export async function fetchMovie(
  query: string = "Inception"
): Promise<Movie[]> {
  const url = `https://api.themoviedb.org/3/search/movie`;

  const response = await axios.get<MovieHttpResponse>(url, {
    params: {
      query,
      language: "en-US",
      page: 1,
      include_adult: false,
    },
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    },
  });

  return response.data.results;
}
