import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import styled from "styled-components";
import useWindowDimensions from "../useWindowDimension";
import { makeImagePath } from "../utilities";
import { useNavigate } from "react-router-dom";
import { IMovie, ITvShow } from "../api";

// Styled //
const Slider = styled(motion.div)`
  margin-bottom: 250px;
  &:last-child {
    margin-bottom: 0;
  }
  button {
    position: absolute;
    z-index: 98;
    width: 50px;
    height: 200px;
    border: none;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    margin: 0px 5px;
    opacity: 0;
    cursor: pointer;
  }
`;

const SliderTitleBox = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
  gap: 5px;
  svg {
    width: 20px;
    height: 20px;
  }
`;

const SliderTitle = styled.h2`
  font-size: 30px;
  font-weight: 600;
  padding-left: 55px;
`;

const SliderLeft = styled(motion.button)`
  left: 0;
`;

const SliderRight = styled(motion.button)`
  right: 0;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
  padding: 0px 55px;
`;

const Box = styled(motion.div)<{ $bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.$bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 30px;
  border-radius: 5px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  height: 100px;
  bottom: -90px;
  padding: 10px;
  background-color: ${(props) => props.theme.black.darker};
  opacity: 0;
  position: absolute;
  gap: 5px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;

const InfoTitle = styled.h4`
  font-size: 25px;
  font-weight: 500;
`;

const InfoData = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const InfoRating = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 20px;
  gap: 2px;
  span:last-child {
    font-size: 15px;
  }
  svg {
    width: 20px;
    height: 20px;
    margin-top: -5px;
    margin-right: 3px;
    color: ${(props) => props.theme.yellow};
  }
`;

const InfoGenres = styled.div`
  font-size: 15px;
`;

// ===== //

// Variants //
const rowVars = {
  hidden: {
    x: window.outerWidth,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth + 5,
  },
};

const boxVars = {
  normal: {
    scale: 1,
  },
  hover: {
    zIndex: 99,
    scale: 1.3,
    y: -50,
    transition: { delay: 0.2, duration: 0.2, type: "tween" },
  },
};

const enterVars = {
  hover: {
    opacity: 1,
  },
};

const infoVars = {
  hover: {
    opacity: 1,
    transition: { delay: 0.2, duration: 0.2, type: "tween" },
  },
};
// ===== //

// Interface //
interface GenreInfoProps {
  genreIds: (number | string)[];
  genres: { id: number; name: string }[];
}

interface ISliderProps {
  data: IMovie[] | ITvShow[];
  title: string;
  type: string;
}
// ===== //

const offset = 6;

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

const GenreInfo: React.FC<GenreInfoProps> = ({ genreIds, genres }) => {
  return (
    <>
      {genreIds.slice(0, 3).map((genreId) => {
        const matchingGenre = genres.find((genre) => genre.id === genreId);
        return <span key={genreId}>•{matchingGenre?.name}</span>;
      })}
    </>
  );
};

function SliderComponent({ data, title, type }: ISliderProps) {
  const navigate = useNavigate();
  const [isHover, setIsHover] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [index, setIndex] = useState(0);
  const width = useWindowDimensions();
  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };
  const IncIndex = () => {
    if (data && !isDisabled) {
      const totalMovies = data.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIsDisabled(true);
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      setTimeout(() => {
        setIsDisabled(false);
      }, 1500);
    }
  };
  const DecIndex = () => {
    if (data) {
      const totalMovies = data.length;
      const maxIndex = Math.floor(totalMovies / offset);
      if (offset * index + offset === 6) return;
      setIsDisabled(true);
      setIndex((prev) => (prev === maxIndex ? 0 : prev - 1));
      setTimeout(() => {
        setIsDisabled(false);
      }, 1500);
    }
  };
  const onBoxClicked = (movieId: any) => {
    navigate(`/movies/${movieId}`);
  };
  return (
    <Slider onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <SliderTitleBox>
        <SliderTitle>{title}</SliderTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
            clipRule="evenodd"
          />
        </svg>
      </SliderTitleBox>
      <AnimatePresence initial={false}>
        <SliderLeft
          key={title + "left"}
          onClick={DecIndex}
          variants={enterVars}
          animate={isHover ? "hover" : ""}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
              clipRule="evenodd"
            />
          </svg>
        </SliderLeft>
        <SliderRight
          key={title + "right"}
          onClick={IncIndex}
          variants={enterVars}
          animate={isHover ? "hover" : ""}
          disabled={isDisabled}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
              clipRule="evenodd"
            />
          </svg>
        </SliderRight>
        <Row
          variants={rowVars}
          initial={{ x: width }}
          animate={{ x: 0 }}
          exit={{ x: -width + 5 }}
          key={index}
          transition={{ type: "tween", duration: 1 }}
        >
          {data.slice(offset * index, offset * index + offset).map((movie) => (
            <Box
              layoutId={movie.id + title}
              variants={boxVars}
              initial="normal"
              whileHover="hover"
              key={movie.id}
              transition={{ type: "tween" }}
              $bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
              onClick={() => onBoxClicked(movie.id)}
            >
              <Info variants={infoVars}>
                <InfoTitle>
                  {movie.title
                    ? movie.title.length >= 15
                      ? movie.title.substring(0, 15) + "..."
                      : movie.title
                    : ""}
                </InfoTitle>
                <InfoData>
                  <InfoRating>
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
                    <span>{movie.vote_average.toFixed(1)}</span>
                    <span>({movie.vote_count})</span>
                  </InfoRating>
                  <InfoGenres>
                    <GenreInfo genreIds={movie.genre_ids || []} genres={genreData.genres} />
                  </InfoGenres>
                </InfoData>
              </Info>
            </Box>
          ))}
        </Row>
      </AnimatePresence>
    </Slider>
  );
}

export default SliderComponent;
