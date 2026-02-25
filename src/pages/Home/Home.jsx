import { useState, useEffect, useRef } from 'react';
import { getOscarsByRange } from '../../data/oscars-loader.js';
import MovieCard from '../../components/MovieCard/MovieCard';
import loadingSvg from '../../assets/loading.svg';
import './Home.css';

const ITEMS_PER_PAGE = 24;
const INITIAL_YEARS_BACK = 2;
const CHUNK_SIZE_YEARS = 2;

function Home() {
  const [bestPictureNominees, setBestPictureNominees] = useState([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [oldestLoadedYear, setOldestLoadedYear] = useState(3000);
  const loaderRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function initialLoad() {
      setIsLoading(true);
      setError(null);

      try {
        const startYear = 2026 - INITIAL_YEARS_BACK;
        const data = await getOscarsByRange(startYear, 2026);

        if (cancelled) return;

        const movies = data.flatMap(group => group.films || []);

        const nominees = movies
          .filter(movie =>
            movie?.oscar?.some(nom => {
              const name = (nom?.name || '').trim().toLowerCase();
              return (
                name === 'лучший фильм' ||
                name === 'best picture' ||
                name.includes('outstanding picture') ||
                name.includes('outstanding production')
              );
            })
          )
          .sort((a, b) => Number(b.year || 0) - Number(a.year || 0));

        setBestPictureNominees(nominees);
        setOldestLoadedYear(startYear);
      } catch (err) {
        console.error('Ошибка первичной загрузки', err);
        setError('Не удалось загрузить номинантов');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    initialLoad();

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        if (!entries[0].isIntersecting || isLoading || isLoadingMore) return;

        if (visibleCount >= bestPictureNominees.length - ITEMS_PER_PAGE * 1.5) {
          loadOlderChunk();
        } else {
          setVisibleCount(prev => Math.min(prev + ITEMS_PER_PAGE, bestPictureNominees.length));
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [bestPictureNominees.length, visibleCount, isLoading, isLoadingMore]);

  const loadOlderChunk = async () => {
    if (oldestLoadedYear <= 1927) return;

    setIsLoadingMore(true);

    try {
      const endYear = oldestLoadedYear - 1;
      const startYear = Math.max(1927, endYear - CHUNK_SIZE_YEARS + 1);

      const data = await getOscarsByRange(startYear, endYear);
      const newMovies = data.flatMap(group => group.films || []);

      const newNominees = newMovies
        .filter(movie =>
          movie?.oscar?.some(nom => {
            const name = (nom?.name || '').trim().toLowerCase();
            return (
              name === 'лучший фильм' ||
              name === 'best picture' ||
              name.includes('outstanding picture') ||
              name.includes('outstanding production')
            );
          })
        )
        .sort((a, b) => Number(b.year || 0) - Number(a.year || 0));

      setBestPictureNominees(prev => [...prev, ...newNominees]);
      setOldestLoadedYear(startYear);
    } catch (err) {
      console.error('Ошибка подгрузки старых данных', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const hasMore = visibleCount < bestPictureNominees.length || oldestLoadedYear > 1927;

  if (error) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h1 style={{ color: '#e74c3c' }}>Ошибка</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (isLoading && bestPictureNominees.length === 0) {
    return (
      <div className="loading">
        <img src={loadingSvg} alt="Загрузка..." />
        <p style={{ color: '#777', fontSize: '1.1rem' }}>Загрузка номинантов...</p>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="movies-grid">
        {bestPictureNominees.slice(0, visibleCount).map((movie, idx) => (
          <MovieCard
            key={`${movie.kinopoiskId || 'nom'}-${idx}`}
            movie={movie}
          />
        ))}
      </div>

      {hasMore && (
        <div className="loading-more" ref={loaderRef}>
          {isLoadingMore
            ? 'Загружаем более ранние годы...'
            : `Загружено номинантов: ${bestPictureNominees.length}`}
        </div>
      )}
    </div>
  );
}

export default Home;