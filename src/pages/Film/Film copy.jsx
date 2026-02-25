// src/pages/Film/Film.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOscarsByRange } from '../../data/oscars-loader.js';
import loadingSvg from '@/assets/loading.svg';
import './FilmPage.css';

// Глобальный кэш — данные загружаются только один раз
let globalCache = null;

function FilmPage() {
  const { kinopoiskId } = useParams();
  const navigate = useNavigate();

  const [film, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadFilm() {
      setLoading(true);
      setError(null);

      try {
        // Если данные ещё не загружены — грузим один раз
        if (!globalCache) {
          globalCache = await getOscarsByRange(1929, 2026);
        }

        // Ищем фильм в уже загруженных данных
        let found = null;
        for (const group of globalCache) {
          found = group.films.find(f => String(f.kinopoiskId) === kinopoiskId);
          if (found) break;
        }

        if (found) {
          setFilm(found);
          document.title = `${found.nameRu || found.nameOriginal} — Oscar Films`;
        } else {
          setError('Фильм не найден');
        }
      } catch (err) {
        console.error(err);
        setError('Ошибка загрузки фильма');
      } finally {
        setLoading(false);
      }
    }

    loadFilm();

    return () => {
      document.title = 'Oscar Films';
    };
  }, [kinopoiskId]);

  // ======================= РЕНДЕР =======================

  if (loading) {
    return (
      <div className="film-loading">
        <img src={loadingSvg} alt="Загрузка..." />
        <p>Загрузка фильма...</p>
      </div>
    );
  }

  if (error || !film) {
    return (
      <div className="film-error">
        <h1>Фильм не найден</h1>
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>← Назад</button>
      </div>
    );
  }

  return (
    <div className="film-root">
      <div className="film-container">

        {/* Левая колонка — постер */}
        <div className="film-column-left">
          <div className="film-poster-section">
            <div className="poster-wrapper">
              <img
                className="film-poster-img"
                src={film.posterUrl || film.posterUrlPreview}
                alt={film.nameRu}
                loading="eager"
              />
            </div>
            <a href={film.webUrl} target="_blank" rel="noopener noreferrer" className="kp-link">
              Подробнее на Кинопоиске →
            </a>
          </div>
        </div>

        {/* Правая колонка */}
        <div className="film-column-right">
          <div className="film-header">
            <h1 className="film-title">{film.nameRu} <span>({film.year})</span></h1>
            {film.nameOriginal && film.nameOriginal !== film.nameRu && (
              <h2 className="film-original">
                {film.nameOriginal}  
                <span className="film-age">{film.ageLimitLine}</span>
              </h2>
            )}
          </div>

          <div className="film-meta">
            <div>{film.countries?.map(c => c.country).join(', ')}</div>
            <div>{film.genres?.map(g => g.genre).join(', ')}</div>
            {film.filmLength && <div>{film.filmLength}</div>}
            {film.ratingMpaa && <div>{film.ratingMpaa}</div>}
          </div>

          <div className="film-ratings">
            {film.ratingKinopoisk && (
              <div>Кинопоиск <strong>{film.ratingKinopoisk}</strong></div>
            )}
            {film.ratingImdb && (
              <div>IMDb <strong>{film.ratingImdb}</strong></div>
            )}
          </div>

          {/* Создатели */}
          <div className="film-crew">
            <h3>Создатели</h3>
            <div className="crew-list">
              {film.director?.length > 0 && (
                <div><strong>Режиссёр:</strong> {film.director.map(d => d.nameRu).join(', ')}</div>
              )}
              {film.writer?.length > 0 && (
                <div><strong>Сценарий:</strong> {film.writer.map(w => w.nameRu).join(', ')}</div>
              )}
              {film.producer?.length > 0 && (
                <div><strong>Продюсер:</strong> {film.producer.map(p => p.nameRu).join(', ')}</div>
              )}
              {film.composer?.length > 0 && (
                <div><strong>Композитор:</strong> {film.composer.map(c => c.nameRu).join(', ')}</div>
              )}
              {film.design?.length > 0 && (
                <div><strong>Художник:</strong> {film.design.map(d => d.nameRu).join(', ')}</div>
              )}
              {film.editor?.length > 0 && (
                <div><strong>Монтаж:</strong> {film.editor.map(e => e.nameRu).join(', ')}</div>
              )}
            </div>
          </div>

          {/* Актёры (лениво) */}
          {film.actor?.length > 0 && <LazyCast actor={film.actor} />}

          {film.description && (
            <div className="film-description">
              <h3>Описание</h3>
              <p>{film.description}</p>
            </div>
          )}

          {/* Номинации */}
          {film.oscar?.length > 0 && (
            <div className="film-awards">
              <h3>Номинации на Оскар ({film.nominatedYear || '—'})</h3>
              <ul className="awards-list">
                {film.oscar.map((nom, i) => (
                  <li key={i} className={nom.win ? 'award-winner' : ''}>
                    {nom.name} {nom.win && <span className="winner-badge">— Победитель</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Ленивый блок актёров */
function LazyCast({ actor }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!show) {
    return (
      <div className="film-cast">
        <h3>В главных ролях</h3>
        <div style={{ 
          height: '220px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <img src={loadingSvg} alt="Загрузка актёров..." style={{ width: '48px' }} />
        </div>
      </div>
    );
  }

  if (!actor || actor.length === 0) {
    return null;
  }

  return (
    <div className="film-cast">
      <h3>В главных ролях</h3>
      <div className="cast-list">
        {actor.slice(0, 12).map((a, i) => (
          <div key={i} className="cast-item">
            <img
              src={a.posterUrl || a.posterUrlPreview || '/placeholder-person.jpg'}
              alt={a.nameRu || a.nameEn || 'Актёр'}
              className="cast-photo"
              loading="lazy"
            />
            <div className="cast-name">
              <strong>{a.nameRu || a.nameEn || '—'}</strong>
              {a.description && (
                <span className="cast-role"> — {a.description}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FilmPage;