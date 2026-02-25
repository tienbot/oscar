// src/components/MovieCard/MovieCard.jsx
import { useNavigate } from 'react-router-dom';
import './MovieCard.css';

function MovieCard({
  movie,
  isWinner = false,
}) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (movie.kinopoiskId) {
      navigate(`/film/${movie.kinopoiskId}`);
    }
  };

  return (
    <div
      className={`movie-card ${isWinner ? 'winner' : ''}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      style={{ cursor: 'pointer' }}
    >
      <img
        src={movie.posterUrlPreview || movie.posterUrl || '/placeholder.jpg'}
        alt={movie.nameRu || movie.nameOriginal}
        loading="lazy"
      />
      <h3 className="title">{movie.nameRu || movie.nameOriginal || '—'}</h3>
      <div className="meta">
        <span>{movie.year || '—'}</span> /{' '}
        <span>{movie.genres?.[0]?.genre || '—'}</span> /{' '}
        <span>{movie.countries?.[0]?.country || '—'}</span>
      </div>
    </div>
  );
}

export default MovieCard;