import { useQuery } from "react-query";
import {
  IGetMoviesResult,
  getPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utilities";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import SliderComponent from "../Components/Slider";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ $bgPhoto: string }>`
  height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.$bgPhoto});
  background-size: cover;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 68px;
  font-weight: 800;
  color: white;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
`;

const TitleBtns = styled.div`
  display: flex;
  gap: 10px;
  svg {
    width: 30px;
    height: 30px;
  }
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    background-color: white;
    width: 120px;
    height: 50px;
    border-radius: 10px;
    border: none;
    font-size: 23px;
    cursor: pointer;
    &:last-child {
      width: 170px;
      background-color: rgba(113, 113, 115, 0.8);
      color: white;
    }
  }
`;

const TitleInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  span {
    margin-top: 4px;
    font-weight: 600;
  }
  svg {
    width: 30px;
    height: 30px;
    color: yellow;
  }
  & > div {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 25px;
    font-weight: 600;
  }
`;

const Slider = styled.div``;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const Movie = styled(motion.div)`
  width: 60vw;
  height: 80vh;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const MovieCover = styled.div`
  width: 100%;
  height: 80%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top center;
`;

const MovieTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  padding: 10px;
  font-size: 6rem;
  font-weight: 800;
  position: relative;
  top: -140px;
`;

const MovieOverview = styled.p`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  top: -50px;
`;

const genreData = {
  genres: [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
  ],
};

interface GenreInfoProps {
  genreIds: (number | string)[];
  genres: { id: number; name: string }[];
}

const GenreInfo: React.FC<GenreInfoProps> = ({ genreIds, genres }) => {
  return (
    <>
      {genreIds.map((genreId) => {
        const matchingGenre = genres.find((genre) => genre.id === genreId);
        return <span key={genreId}>•{matchingGenre?.name}</span>;
      })}
    </>
  );
};

function Home() {
  const navigate = useNavigate();
  const movieMatch = useMatch("/movies/:movieId");
  const { scrollY } = useScroll();
  // Api Data //
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getPlayingMovies
  );
  const { data: popData, isLoading: isPopDataLoading } = useQuery<IGetMoviesResult>(
    ["movies", "popular"],
    getPopularMovies
  );
  const { data: topData, isLoading: isTopDataLoading } = useQuery<IGetMoviesResult>(
    ["movies", "topRated"],
    getTopRatedMovies
  );
  const { data: upcoming, isLoading: isUpcomingLoading } = useQuery<IGetMoviesResult>(
    ["movies", "upcoming"],
    getUpcomingMovies
  );
  // ===== //
  const onBoxClicked = (movieId: any) => {
    navigate(`/movies/${movieId}`);
  };
  const onOverlayClick = () => {
    navigate("/");
  };
  const clickedMovie =
    (movieMatch?.params.movieId &&
      data?.results.find((movie) => String(movie.id) === movieMatch.params.movieId)) ||
    popData?.results.find((movie) => String(movie.id) === movieMatch?.params.movieId) ||
    topData?.results.find((movie) => String(movie.id) === movieMatch?.params.movieId) ||
    upcoming?.results.find((movie) => String(movie.id) === movieMatch?.params.movieId);
  return (
    <Wrapper>
      {isLoading || isPopDataLoading || isTopDataLoading || isUpcomingLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner $bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <TitleBtns>
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                    clipRule="evenodd"
                  />
                </svg>
                Play
              </button>
              <button onClick={() => onBoxClicked(data?.results[0].id)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                  />
                </svg>
                More Info
              </button>
            </TitleBtns>
            <TitleInfo>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{data?.results[0].vote_average.toFixed(1)}</span>
                <GenreInfo genreIds={data?.results[0].genre_ids || []} genres={genreData.genres} />
              </div>
            </TitleInfo>
          </Banner>
          <Slider>
            <SliderComponent data={data?.results ?? []} title="Playing Now" type="movie" />
            <SliderComponent data={popData?.results ?? []} title="Trending Now" type="movie" />
            <SliderComponent data={topData?.results ?? []} title="Top Rated" type="movie" />
            <SliderComponent data={upcoming?.results ?? []} title="Upcoming" type="movie" />
          </Slider>

          <AnimatePresence>
            {movieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                ></Overlay>
                <Movie style={{ top: scrollY.get() + 100 }} layoutId={movieMatch.params.movieId}>
                  {clickedMovie && (
                    <>
                      <MovieCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.poster_path
                          )}`,
                        }}
                      />
                      <MovieTitle>{clickedMovie.title?.substring(0, 20)}</MovieTitle>
                      <MovieOverview>{clickedMovie.overview}</MovieOverview>
                    </>
                  )}
                </Movie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
