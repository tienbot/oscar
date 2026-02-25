// oscars-loader.js
const PERIODS = [
  '1929-1931', '1932-1934', '1935-1936', '1937-1938', '1939-1940',
  '1941-1942', '1943-1944', '1945-1946', '1947-1948', '1949-1950',
  '1951-1952', '1953-1954', '1955-1956', '1957-1958', '1959-1960',
  '1961-1962', '1963-1964', '1965-1966', '1967-1968', '1969-1970',
  '1971-1972', '1973-1974', '1975-1976', '1977-1978', '1979-1980',
  '1981-1982', '1983-1984', '1985-1986', '1987-1988', '1989-1990',
  '1991-1992', '1993-1994', '1995-1996', '1997-1998', '1999-2000',
  '2001-2002', '2003-2004', '2005-2006', '2007-2008', '2009-2010',
  '2011-2012', '2013-2014', '2015-2016', '2017-2018', '2019-2020',
  '2021-2022', '2023-2024', '2025-2026'
];

const cache = new Map();           // '1929-1931' → [ {year, films}, ... ]
let allOscarsLoaded = false;
let allOscarsCache = [];

// =============================================
// 1. Определяем, в каком файле лежит нужный год
// =============================================
function getPeriodKey(year) {
  for (const p of PERIODS) {
    const [start, end = start] = p.split('-').map(Number);
    if (year >= start && year <= end) return p;
  }
  return null;
}

// =============================================
// 2. Ленивая загрузка одного периода
// =============================================
async function loadPeriod(key) {
  if (cache.has(key)) return cache.get(key);

  const module = await import(`./oscar_${key}.js`);
  const data = module.default || [];
  cache.set(key, data);
  return data;
}

// =============================================
// 3. Основные публичные функции
// =============================================

/** Получить данные только за один год (самый частый кейс) */
export async function getOscarsByYear(year) {
  const key = getPeriodKey(year);
  if (!key) return [];

  const data = await loadPeriod(key);
  return data.filter(item => item.year === year);
}

/** Получить всё (загружается только при первом вызове) */
export async function getAllOscars() {
  if (allOscarsLoaded) return allOscarsCache;

  // Загружаем все периоды параллельно
  const promises = PERIODS.map(key => loadPeriod(key));
  const allChunks = await Promise.all(promises);

  allOscarsCache = allChunks
    .flat()                                   // объединяем все {year, films}
    .sort((a, b) => (b.year || 0) - (a.year || 0)); // от новых к старым

  allOscarsLoaded = true;
  return allOscarsCache;
}

/** Получить несколько лет сразу (например, для диапазона) */
export async function getOscarsByRange(startYear, endYear) {
  const years = [];
  for (let y = startYear; y <= endYear; y++) {
    years.push(y);
  }

  const uniquePeriods = new Set(years.map(getPeriodKey).filter(Boolean));
  const promises = [...uniquePeriods].map(loadPeriod);

  await Promise.all(promises);

  // Теперь все нужные периоды в кэше — просто фильтруем
  const result = [];
  for (let y = startYear; y <= endYear; y++) {
    const data = await getOscarsByYear(y); // уже из кэша
    result.push(...data);
  }
  return result;
}