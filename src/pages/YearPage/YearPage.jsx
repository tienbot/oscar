// src/pages/YearPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOscarsByRange } from '@/data/oscars-loader.js';
import MovieCard from '@/components/MovieCard/MovieCard';
import PersonCard from '@/components/PersonCard/PersonCard';
import loadingSvg from '@/assets/loading.svg';

function YearPage() {
  const { year } = useParams();
  const yearNum = Number(year);

  const [nominationsData, setNominationsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Желаемый порядок номинаций
  const desiredOrder = [
    "Лучший фильм",
    "Лучшая мужская роль",
    "Лучшая женская роль",
    "Лучшая мужская роль второго плана",
    "Лучшая женская роль второго плана",
    "Лучший режиссер",
    "Лучший сценарий",
    "Лучший адаптированный сценарий",
    "Лучшая работа оператора",
    "Лучшая работа художника-постановщика",
    "Лучшие костюмы",
    "Лучший звук",
    "Лучший монтаж",
    "Лучшие визуальные эффекты",
    "Лучший грим и прически",
    "Лучшая песня",
    "Лучший саундтрек",
    "Лучший анимационный фильм",
    "Лучший короткометражный анимационный фильм",
    "Лучший короткометражный игровой фильм",
    "Лучший короткометражный документальный фильм",
    "Лучший фильм на иностранном языке",
  ];

  // Номинации, где показываем человека (фото + формат "Имя — Фильм")
  const personNominations = new Set([
    "Лучшая мужская роль",
    "Лучшая женская роль",
    "Лучшая мужская роль второго плана",
    "Лучшая женская роль второго плана",
    "Лучший режиссер",
  ]);

  // Меняем заголовок вкладки браузера
  useEffect(() => {
    document.title = `Номинации ${yearNum} года`;
    return () => {
      document.title = 'Oscar Films';
    };
  }, [yearNum]);

  useEffect(() => {
    if (!yearNum || isNaN(yearNum)) {
      setError('Неверный год');
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadYear() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getOscarsByRange(yearNum, yearNum);
        if (cancelled) return;

        const yearGroup = data.find(g => g.year === yearNum);
        if (!yearGroup || !yearGroup.films?.length) {
          setNominationsData([]);
          return;
        }

        const nominationMap = new Map();

        yearGroup.films.forEach(film => {
          (film.oscar || []).forEach(nom => {
            const nomName = nom.name?.trim();
            if (!nomName) return;

            if (!nominationMap.has(nomName)) {
              nominationMap.set(nomName, []);
            }

            const existing = nominationMap.get(nomName);
            if (!existing.some(f => f.kinopoiskId === film.kinopoiskId)) {
              existing.push({
                ...film,
                win: nom.win || false,
                isWinner: nom.win || false,
              });
            }
          });
        });

        let grouped = Array.from(nominationMap.entries()).map(([nominationName, films]) => ({
          nominationName,
          films: films.sort((a, b) => (b.isWinner ? 1 : 0) - (a.isWinner ? 1 : 0)),
          isPersonCategory: personNominations.has(nominationName),
        }));

        // Сортировка по желаемому порядку
        grouped.sort((a, b) => {
          const aIndex = desiredOrder.indexOf(a.nominationName);
          const bIndex = desiredOrder.indexOf(b.nominationName);
          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
          if (aIndex !== -1) return -1;
          if (bIndex !== -1) return 1;
          return a.nominationName.localeCompare(b.nominationName);
        });

        setNominationsData(grouped);
      } catch (err) {
        console.error('Ошибка загрузки года', err);
        setError('Не удалось загрузить данные за этот год');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadYear();

    return () => { cancelled = true; };
  }, [yearNum]);

  if (isLoading) {
    return (
      <div className="loading">
        <img src={loadingSvg} alt="Загрузка..." />
        <p>Загрузка номинантов {year} года</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: '#e74c3c' }}>
        <h1>Ошибка</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (nominationsData.length === 0) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>За {year} год данных нет</h2>
        <p>Возможно, церемония ещё не состоялась или данные отсутствуют</p>
      </div>
    );
  }

  return (
    <div className="year-page">
      <h1>Оскар — {year} год</h1>

      {nominationsData.map(section => (
        <section key={section.nominationName} className="nomination-section">
          <h2 className="nomination-title">
            {section.nominationName}
          </h2>

          <div className={`movies-grid ${section.isPersonCategory ? 'person-mode' : ''}`}>
            {section.films.map((entry, idx) => (
              <div
                key={`${entry.kinopoiskId || 'nom'}-${idx}`}
                className={`card-wrapper ${entry.isWinner ? 'winner' : ''}`}
              >
                {section.isPersonCategory ? (
                  <PersonCard
                    movie={entry}
                    nominationContext={section.nominationName}
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
    </div>
  );
}

export default YearPage;