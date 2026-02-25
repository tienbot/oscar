// src/components/MovieCard/MovieCard.jsx
import './MovieCard.css';

function MovieCard({
  movie,
  isWinner = false,
  isPersonCategory = false,
  nominationContext = '',
}) {
  // Клик по всей карточке → открывает фильм на Кинопоиске (как в Home)
  const handleCardClick = () => {
    if (movie.webUrl) {
      window.open(movie.webUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // ==================== РЕЖИМ ПЕРСОНЫ ====================
  if (isPersonCategory && nominationContext) {
    // Находим нужную номинацию в массиве oscar
    const relevantNom = movie.oscar?.find(
      (nom) => nom.name?.trim() === nominationContext
    );

    // Берём первого человека из persons этой номинации
    const person = relevantNom?.persons?.[0] || {};

    // Если человека не нашли — fallback на обычную карточку фильма
    if (!person || (!person.nameRu && !person.nameEn)) {
      return (
        <div
          className={`movie-card ${isWinner ? 'winner' : ''}`}
          onClick={handleCardClick}
          role="button"
          tabIndex={0}
          style={{ cursor: movie.webUrl ? 'pointer' : 'default' }}
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

    // Карточка персоны
    return (
      <div
        className={`movie-card person-card ${isWinner ? 'winner' : ''}`}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        style={{ cursor: movie.webUrl ? 'pointer' : 'default' }}
      >
        {/* Клик по фото → страница человека */}
        <a
          href={person.webUrl || `https://www.kinopoisk.ru/name/${person.kinopoiskId || person.id}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="person-photo-link"
          onClick={(e) => e.stopPropagation()} // важно! чтобы не открывался фильм
        >
          <img
            src={person.posterUrl || person.posterUrlPreview || '/placeholder-person.jpg'}
            alt={person.nameRu || person.nameEn || 'Персона'}
            className="person-photo"
            loading="lazy"
          />
        </a>

        <div className="person-info">
          <a
            href={person.webUrl || `https://www.kinopoisk.ru/name/${person.kinopoiskId || person.id}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="person-name"
            onClick={(e) => e.stopPropagation()}
          >
            {person.nameRu || person.nameEn || '—'}
          </a>
          <span className="separator"> — </span>
          <span className="film-title">
            {movie.nameRu || movie.nameOriginal || '—'}
          </span>
        </div>
      </div>
    );
  }

  // ==================== ОБЫЧНЫЙ РЕЖИМ (фильм) ====================
  return (
    <div
      className={`movie-card ${isWinner ? 'winner' : ''}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      style={{ cursor: movie.webUrl ? 'pointer' : 'default' }}
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