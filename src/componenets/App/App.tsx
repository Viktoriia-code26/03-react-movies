import css from "../App/App.module.css";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import SearchBar from "../SearchBar/SearchBar";
import Loader from "../Loader/Loader";
import type { Movie } from "../../types/movie";
import { useState } from "react";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { fetchMovie } from "../../services/movieService";
import toast, { Toaster } from "react-hot-toast";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const closeModal = () => setIsModalOpen(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      toast.error("Please enter your search query.");
      return;
    }

    try {
      setLoading(true);
      setIsError(false);
      setMovies([]);

      const data = await fetchMovie(query);

      if (data.length === 0) {
        toast.error("No movies found for your request.");
        return;
      }

      setMovies(data);
    } catch {
      setIsError(true);
      toast.error("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={css.app}>
      {isModalOpen && selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}

      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {movies.length > 0 && (
        <MovieGrid
          movies={movies}
          onSelectMovie={(movie) => {
            setSelectedMovie(movie);
            setIsModalOpen(true);
          }}
        />
      )}

      <Toaster position="top-right" />
    </div>
  );
}