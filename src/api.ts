const API_KEY = "2b0f2a46f4e7133e173911c3a5da14bf";
const BASE_PATH = "https://api.themoviedb.org/3/";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  genre_ids: string[];
  vote_average: number;
}

export interface ITvShow {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  original_language: string;
  genre_ids: number[];
}

export interface IGenres {
  id: number;
  name: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export function getMovieDetail() {
  return fetch(`${BASE_PATH}/movie/572802?api_key=${API_KEY}`).then((response) => response.json());
}
