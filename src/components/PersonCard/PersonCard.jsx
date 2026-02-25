import './PersonCard.css';

function PersonCard({
  movie,
  nominationContext = '',
  isWinner = false,
}) {
  // Находим нужную номинацию и первого человека в persons
  const relevantNom = movie.oscar?.find(
    (nom) => nom.name?.trim() === nominationContext
  );
  const person = relevantNom?.persons?.[0] || {};

  const handleCardClick = () => {
    if (movie.webUrl) {
      window.open(movie.webUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Fallback на обычную карточку фильма, если человека нет
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

  // Основной режим персоны
  const personUrl =
    person.webUrl ||
    `https://www.kinopoisk.ru/name/${person.kinopoiskId || person.id}/`;

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
        href={personUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="person-photo-link"
        onClick={(e) => e.stopPropagation()}
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
          href={personUrl}
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

export default PersonCard;