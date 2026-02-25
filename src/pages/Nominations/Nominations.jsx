// src/pages/Nominations.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getOscarsByRange } from '../../data/oscars-loader.js';
import MovieCard from '../../components/MovieCard/MovieCard';
import PersonCard from '../../components/PersonCard/PersonCard'; // ← должен существовать

const slugToRussianTitle = {
  "best-picture":                 "Лучший фильм",
  "best-actor":                   "Лучшая мужская роль",
  "best-actress":                 "Лучшая женская роль",
  "best-supporting-actor":        "Лучшая мужская роль второго плана",
  "best-supporting-actress":      "Лучшая женская роль второго плана",
  "best-director":                "Лучший режиссер",
  "best-original-screenplay":     "Лучший сценарий",
  "best-adapted-screenplay":      "Лучший адаптированный сценарий",
  "best-cinematography":          "Лучшая работа оператора",
  "best-production-design":       "Лучшая работа художника-постановщика",
  "best-costume-design":          "Лучшие костюмы",
  "best-sound":                   "Лучший звук",
  "best-editing":                 "Лучший монтаж",
  "best-visual-effects":          "Лучшие визуальные эффекты",
  "best-makeup":                  "Лучший грим и прически",
  "best-song":                    "Лучшая песня",
  "best-score":                   "Лучший саундтрек",
  "best-animated-feature":        "Лучший анимационный фильм",
  "best-animated-short":          "Лучший короткометражный анимационный фильм",
  "best-live-action-short":       "Лучший короткометражный игровой фильм",
  "best-documentary-short":       "Лучший короткометражный документальный фильм",
  "best-international-feature":   "Лучший фильм на иностранном языке",
};

const PERSON_SLUGS = new Set([
  "best-actor",
  "best-actress",
  "best-supporting-actor",
  "best-supporting-actress",
  "best-director",
]);

const INITIAL_YEARS_BACK = 4;
const CHUNK_SIZE_YEARS = 5;
const MIN_YEAR = 1927;

function Nominations() {
  const { slug } = useParams();
  const russianTitle = slugToRussianTitle[slug];
  const isPersonCategory = PERSON_SLUGS.has(slug);

  const [yearsData, setYearsData] = useState([]); // { year, films: [...] }
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [oldestLoadedYear, setOldestLoadedYear] = useState(3000);
  const loaderRef = useRef(null);

  useEffect(() => {
    if (!russianTitle) {
      setError(`Номинация "${slug}" не найдена`);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function initialLoad() {
      setLoading(true);
      setError(null);

      try {
        const currentYear = 2026;
        const start = currentYear - INITIAL_YEARS_BACK;
        const data = await getOscarsByRange(start, currentYear);

        if (cancelled) return;

        const processed = processData(data, russianTitle);

        setYearsData(processed);
        setOldestLoadedYear(start);
      } catch (err) {
        console.error("Ошибка начальной загрузки", err);
        setError("Не удалось загрузить данные");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    initialLoad();

    return () => { cancelled = true; };
  }, [slug, russianTitle]);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        if (!entries[0].isIntersecting || loading || loadingMore) return;
        if (oldestLoadedYear <= MIN_YEAR + CHUNK_SIZE_YEARS) return;
        loadOlderChunk();
      },
      { threshold: 0.1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [yearsData, oldestLoadedYear, loading, loadingMore, russianTitle, slug]);

  const processData = (groups, title) => {
    const yearMap = new Map();

    groups.forEach(group => {
      if (!group.year) return;

      group.films.forEach(film => {
        const nom = film.oscar?.find(n => n.name?.trim() === title);
        if (nom) {
          if (!yearMap.has(group.year)) yearMap.set(group.year, []);
          yearMap.get(group.year).push({
            ...film,
            isWinner: nom.win || false,
            // сохраняем контекст для PersonCard
            nominationName: title,
          });
        }
      });
    });

    return Array.from(yearMap.entries())
      .map(([year, films]) => ({
        year,
        films: films.sort((a, b) => (b.isWinner ? 1 : 0) - (a.isWinner ? 1 : 0)),
      }))
      .sort((a, b) => b.year - a.year);
  };

  const loadOlderChunk = async () => {
    if (oldestLoadedYear <= MIN_YEAR) return;

    setLoadingMore(true);

    try {
      const end = oldestLoadedYear - 1;
      const start = Math.max(MIN_YEAR, end - CHUNK_SIZE_YEARS + 1);

      const data = await getOscarsByRange(start, end);
      const newChunks = processData(data, russianTitle);

      setYearsData(prev => [...prev, ...newChunks]);
      setOldestLoadedYear(start);
    } catch (err) {
      console.error("Ошибка подгрузки", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const hasMore = oldestLoadedYear > MIN_YEAR;

  if (loading && yearsData.length === 0) {
    return <div style={{ padding: '120px 20px', textAlign: 'center' }}>Загрузка...</div>;
  }

  if (error) {
    return <div style={{ padding: '100px 20px', textAlign: 'center', color: '#e74c3c' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>{russianTitle}</h1>

      {yearsData.length === 0 && !loading && (
        <p style={{ textAlign: 'center', color: '#888' }}>
          Данных по этой номинации пока нет
        </p>
      )}

      {yearsData.map(({ year, films }) => (
        <section key={year} style={{ marginBottom: '64px' }}>
          <h2 style={{
            fontSize: '1.8rem',
            marginBottom: '16px',
            borderBottom: '1px solid #444',
            paddingBottom: '8px',
          }}>
            {year} <span style={{ color: '#888', fontSize: '0.9em' }}>({films.length})</span>
          </h2>

          <div className={`movies-grid ${isPersonCategory ? 'person-mode' : ''}`} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '20px',
          }}>
            {films.map((entry, idx) => (
              <div
                key={`${entry.kinopoiskId || 'nom'}-${year}-${idx}`}
                className={entry.isWinner ? 'winner' : ''}
              >
                {isPersonCategory ? (
                  <PersonCard
                    movie={entry}
                    nominationContext={entry.nominationName}
                    isWinner={entry.isWinner}
                  />
                ) : (
                  <MovieCard
                    movie={entry}
                    isWinner={entry.isWinner}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      {hasMore && (
        <div
          ref={loaderRef}
          style={{ textAlign: 'center', padding: '40px 0', color: '#777' }}
        >
          {loadingMore ? 'Загружаем более ранние годы...' : 'Прокрутите вниз для загрузки старых церемоний'}
        </div>
      )}
    </div>
  );
}

export default Nominations;