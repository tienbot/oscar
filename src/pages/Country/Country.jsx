import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getOscarsByRange } from '../../data/oscars-loader.js';
import MovieCard from '../../components/MovieCard/MovieCard';
import PersonCard from '../../components/PersonCard/PersonCard';

const INITIAL_YEARS_BACK = 5;
const CHUNK_SIZE_YEARS = 6;
const MIN_YEAR = 1927;

const personNominations = new Set([
  "Лучшая мужская роль",
  "Лучшая женская роль",
  "Лучшая мужская роль второго плана",
  "Лучшая женская роль второго плана",
  "Лучший режиссер",
]);

const desiredOrder = [
  "Лучший фильм","Лучшая мужская роль","Лучшая женская роль",
  "Лучшая мужская роль второго плана","Лучшая женская роль второго плана",
  "Лучший режиссер","Лучший сценарий","Лучший адаптированный сценарий",
  "Лучшая работа оператора","Лучшая работа художника-постановщика",
  "Лучшие костюмы","Лучший звук","Лучший монтаж",
  "Лучшие визуальные эффекты","Лучший грим и прически",
  "Лучшая песня","Лучший саундтрек","Лучший анимационный фильм",
  "Лучший короткометражный анимационный фильм",
  "Лучший короткометражный игровой фильм",
  "Лучший короткометражный документальный фильм",
  "Лучший фильм на иностранном языке",
];

function CountryPage() {
  const { country } = useParams();
  const decodedCountry = decodeURIComponent(country);

  const [yearsData, setYearsData] = useState([]); // [{ year, nominations: [{nominationName, films}] }]
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [oldestLoadedYear, setOldestLoadedYear] = useState(3000);
  const loaderRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function initialLoad() {
      setLoading(true);
      setError(null);

      try {
        const start = 2026 - INITIAL_YEARS_BACK;
        const data = await getOscarsByRange(start, 2026);
        if (cancelled) return;

        const processed = processData(data, decodedCountry);
        setYearsData(processed);
        setOldestLoadedYear(start);
      } catch (err) {
        setError("Не удалось загрузить данные");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    initialLoad();
    return () => { cancelled = true; };
  }, [decodedCountry]);

  const processData = (groups, targetCountry) => {
    const yearMap = new Map();

    groups.forEach(group => {
      if (!group.year) return;

      const nomMap = new Map();

      group.films.forEach(film => {
        if (!film.countries?.some(c => c.country === targetCountry)) return;

        film.oscar?.forEach(nom => {
          const name = nom.name?.trim();
          if (!name) return;

          if (!nomMap.has(name)) nomMap.set(name, []);
          nomMap.get(name).push({
            ...film,
            isWinner: nom.win || false,
            nominationName: name,
          });
        });
      });

      if (nomMap.size > 0) {
        let nominations = Array.from(nomMap.entries()).map(([nominationName, films]) => ({
          nominationName,
          films: films.sort((a, b) => (b.isWinner ? 1 : 0) - (a.isWinner ? 1 : 0)),
        }));

        nominations.sort((a, b) => {
          const ai = desiredOrder.indexOf(a.nominationName);
          const bi = desiredOrder.indexOf(b.nominationName);
          if (ai !== -1 && bi !== -1) return ai - bi;
          if (ai !== -1) return -1;
          if (bi !== -1) return 1;
          return a.nominationName.localeCompare(b.nominationName);
        });

        yearMap.set(group.year, nominations);
      }
    });

    return Array.from(yearMap.entries())
      .map(([year, nominations]) => ({ year, nominations }))
      .sort((a, b) => b.year - a.year);
  };

  const loadOlderChunk = async () => {
    if (oldestLoadedYear <= MIN_YEAR) return;
    setLoadingMore(true);

    try {
      const end = oldestLoadedYear - 1;
      const start = Math.max(MIN_YEAR, end - CHUNK_SIZE_YEARS + 1);
      const data = await getOscarsByRange(start, end);
      const newChunks = processData(data, decodedCountry);

      setYearsData(prev => [...prev, ...newChunks]);
      setOldestLoadedYear(start);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!loaderRef.current) return;
    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting || loading || loadingMore) return;
      if (oldestLoadedYear <= MIN_YEAR + CHUNK_SIZE_YEARS) return;
      loadOlderChunk();
    }, { threshold: 0.1 });

    obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, [yearsData, oldestLoadedYear, loading, loadingMore]);

  const hasMore = oldestLoadedYear > MIN_YEAR;

  if (loading && yearsData.length === 0) {
    return <div style={{ padding: '120px 20px', textAlign: 'center' }}>Загрузка фильмов из {decodedCountry}...</div>;
  }

  if (error) return <div style={{ padding: '100px', textAlign: 'center', color: '#e74c3c' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Фильмы из {decodedCountry} на Оскаре</h1>

      {yearsData.length === 0 && !loading && (
        <p style={{ textAlign: 'center', color: '#888', fontSize: '1.2rem' }}>
          Фильмов из этой страны на Оскаре пока нет
        </p>
      )}

      {yearsData.map(({ year, nominations }) => (
        <section key={year} style={{ marginBottom: '70px' }}>
          <h2 style={{ fontSize: '2rem', borderBottom: '2px solid #444', paddingBottom: '10px' }}>
            {year}
          </h2>

          {nominations.map(section => (
            <div key={section.nominationName} style={{ marginBottom: '50px' }}>
              <h3 style={{ fontSize: '1.55rem', margin: '25px 0 15px', color: '#ddd' }}>
                {section.nominationName} <span style={{ color: '#888' }}>({section.films.length})</span>
              </h3>

              <div className={`movies-grid ${personNominations.has(section.nominationName) ? 'person-mode' : ''}`} style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '20px'
              }}>
                {section.films.map((entry, idx) => (
                  <div key={`${entry.kinopoiskId}-${idx}`} className={entry.isWinner ? 'winner' : ''}>
                    {personNominations.has(section.nominationName) ? (
                      <PersonCard movie={entry} nominationContext={section.nominationName} isWinner={entry.isWinner} />
                    ) : (
                      <MovieCard movie={entry} isWinner={entry.isWinner} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}

      {hasMore && (
        <div ref={loaderRef} style={{ textAlign: 'center', padding: '50px 0', color: '#777' }}>
          {loadingMore ? 'Загружаем более ранние годы...' : ''}
        </div>
      )}
    </div>
  );
}

export default CountryPage;