import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../../../public/oscars.svg';

function Header() {
  const [openMenu, setOpenMenu] = useState(null); // null | 'nominations' | 'years' | 'countries'
  const navigate = useNavigate();

  // Статический список номинаций
  const nominations = [
    { label: "Лучший фильм", slug: "best-picture" },
    { label: "Лучшая мужская роль", slug: "best-actor" },
    { label: "Лучшая женская роль", slug: "best-actress" },
    { label: "Лучшая мужская роль второго плана", slug: "best-supporting-actor" },
    { label: "Лучшая женская роль второго плана", slug: "best-supporting-actress" },
    { label: "Лучший режиссер", slug: "best-director" },
    { label: "Лучший сценарий", slug: "best-original-screenplay" },
    { label: "Лучший адаптированный сценарий", slug: "best-adapted-screenplay" },
    { label: "Лучшая работа оператора", slug: "best-cinematography" },
    { label: "Лучшая работа художника-постановщика", slug: "best-production-design" },
    { label: "Лучшие костюмы", slug: "best-costume-design" },
    { label: "Лучший звук", slug: "best-sound" },
    { label: "Лучший монтаж", slug: "best-editing" },
    { label: "Лучшие визуальные эффекты", slug: "best-visual-effects" },
    { label: "Лучший грим и прически", slug: "best-makeup" },
    { label: "Лучшая песня", slug: "best-song" },
    { label: "Лучший саундтрек", slug: "best-score" },
    { label: "Лучший анимационный фильм", slug: "best-animated-feature" },
    { label: "Лучший короткометражный анимационный фильм", slug: "best-animated-short" },
    { label: "Лучший короткометражный игровой фильм", slug: "best-live-action-short" },
    { label: "Лучший короткометражный документальный фильм", slug: "best-documentary-short" },
    { label: "Лучший фильм на иностранном языке", slug: "best-international-feature" },
  ];

  // Статический список годов (от новых к старым)
  const years = [
    2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017,
    2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007,
    2006, 2005, 2004, 2003, 2002, 2001, 2000, 1999, 1998, 1997,
    1996, 1995, 1994, 1993, 1992, 1991, 1990, 1989, 1988, 1987,
    1986, 1985, 1984, 1983, 1982, 1981, 1980, 1979, 1978, 1977,
    1976, 1975, 1974, 1973, 1972, 1971, 1970, 1969, 1968, 1967,
    1966, 1965, 1964, 1963, 1962, 1961, 1960, 1959, 1958, 1957,
    1956, 1955, 1954, 1953, 1952, 1951, 1950, 1949, 1948, 1947,
    1946, 1945, 1944, 1943, 1942, 1941, 1940, 1939, 1938, 1937,
    1936, 1935, 1934, 1933, 1932, 1931, 1930, 1929
  ];

  // Статический массив стран (уже отсортирован по русскому алфавиту)
  const countries = [
    "Австралия", "Австрия", "Алжир", "Аргентина", "Афганистан", "Бельгия",
    "Берег Слоновой Кости", "Болгария", "Босния и Герцеговина", "Бразилия",
    "Бутан", "Вануату", "Великобритания", "Венгрия", "Венесуэла", "Вьетнам",
    "Гамбия", "Германия", "Германия (ГДР)", "Германия (ФРГ)", "Гонконг",
    "Гренландия", "Греция", "Грузия", "Дания", "Египет", "Замбия", "Зимбабве",
    "Израиль", "Индия", "Индонезия", "Иордания", "Ирак", "Иран", "Ирландия",
    "Исландия", "Испания", "Италия", "Йемен", "Казахстан", "Камбоджа", "Канада",
    "Катар", "Кения", "Кипр", "Китай", "Колумбия", "Конго", "Корея Южная",
    "Косово", "Коста-Рика", "Куба", "Кувейт", "Латвия", "Либерия", "Ливан",
    "Ливия", "Лихтенштейн", "Люксембург", "Мавритания", "Малайзия", "Мальта",
    "Марокко", "Мексика", "Монако", "Монголия", "Непал", "Нидерланды",
    "Никарагуа", "Новая Зеландия", "Норвегия", "ОАЭ", "Остров Мэн", "Пакистан",
    "Палестина", "Папуа - Новая Гвинея", "Перу", "Польша", "Португалия",
    "Пуэрто-Рико", "Россия", "Румыния", "Северная Македония", "Сингапур",
    "Сирия", "Словакия", "Словения", "СССР", "США", "Таиланд", "Тайвань",
    "Тунис", "Турция", "Украина", "Уругвай", "Фиджи", "Филиппины", "Финляндия",
    "Франция", "Хорватия", "Черногория", "Чехия", "Чехословакия", "Чили",
    "Швейцария", "Швеция", "Эквадор", "Эстония", "ЮАР", "Югославия", "Япония"
  ];

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const handleYearClick = (year) => {
    navigate(`/oscar/year/${year}`);
    setOpenMenu(null);
  };

  const handleNominationClick = (slug) => {
    navigate(`/oscar/nominations/${slug}`);
    setOpenMenu(null);
  };

  const handleCountryClick = (countryName) => {
    navigate(`/oscar/countries/${encodeURIComponent(countryName)}`);
    setOpenMenu(null);
  };

  return (
    <header className="header">
      <Link to="/oscar" style={{ color: 'white', textDecoration: 'none' }}>
      <div className="logo"> 
          <img src={logo} alt="Oscar Films Logo" />Oscar Films
        </div>
      </Link>
      <nav>

        {/* Номинации */}
        <div className="dropdown">
          <button
            onClick={() => toggleMenu('nominations')}
            className={openMenu === 'nominations' ? 'active' : ''}
          >
            Номинации ▾
          </button>

          {openMenu === 'nominations' && (
            <ul className="dropdown-menu">
              {nominations.map((nom) => (
                <li
                  key={nom.slug}
                  onClick={() => handleNominationClick(nom.slug)}
                >
                  {nom.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Года */}
        <div className="dropdown">
          <button
            onClick={() => toggleMenu('years')}
            className={openMenu === 'years' ? 'active' : ''}
          >
            Года ▾
          </button>

          {openMenu === 'years' && (
            <ul className="dropdown-menu" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {years.map((year) => (
                <li key={year} onClick={() => handleYearClick(year)}>
                  {year}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Страны */}
        <div className="dropdown">
          <button
            onClick={() => toggleMenu('countries')}
            className={openMenu === 'countries' ? 'active' : ''}
          >
            Страны ▾
          </button>

          {openMenu === 'countries' && (
            <ul className="dropdown-menu" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {countries.map((country) => (
                <li
                  key={country}
                  onClick={() => handleCountryClick(country)}
                >
                  {country}
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;