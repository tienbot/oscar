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

// Глобальный кэш для полного диапазона
let fullCache = null;
let fullCachePromise = null;

async function loadAllData() {
  if (fullCache) return fullCache;
  if (fullCachePromise) return fullCachePromise;

  fullCachePromise = (async () => {
    try {
      const allChunks = await Promise.all(
        PERIODS.map(async (period) => {
          const module = await import(`./oscar_${period}.js`);
          return module.default || [];
        })
      );
      fullCache = allChunks.flat();
      return fullCache;
    } finally {
      fullCachePromise = null;
    }
  })();

  return fullCachePromise;
}

const cache = new Map(); // кэш отдельных периодов

function getPeriodKey(year) {
  for (const p of PERIODS) {
    const [s, e = s] = p.split('-').map(Number);
    if (year >= s && year <= e) return p;
  }
  return null;
}

async function loadPeriod(key) {
  if (cache.has(key)) return cache.get(key);

  const module = await import(`./oscar_${key}.js`);
  const data = module.default || [];
  cache.set(key, data);
  return data;
}

// ────────────────────────────────────────────────
// Публичные функции
// ────────────────────────────────────────────────

export async function getOscarsByRange(startYear, endYear) {
  // Если запрашивается почти весь диапазон → используем полный кэш
  if (endYear - startYear >= 80) {
    const all = await loadAllData();
    return all.filter(g => g.year >= startYear && g.year <= endYear);
  }

  // Иначе — загружаем только нужные периоды
  const periods = new Set();
  for (let y = startYear; y <= endYear; y++) {
    const key = getPeriodKey(y);
    if (key) periods.add(key);
  }

  const promises = [...periods].map(loadPeriod);
  await Promise.all(promises);

  const result = [];
  for (let y = startYear; y <= endYear; y++) {
    const periodData = cache.get(getPeriodKey(y)) || [];
    const group = periodData.find(g => g.year === y);
    if (group) result.push(group);
  }

  return result;
}

// Для Header — только годы (быстрее)
export async function getAvailableYears() {
  const all = await loadAllData();
  const yearsSet = new Set(all.map(g => g.year).filter(y => Number.isInteger(y)));
  return [...yearsSet].sort((a, b) => b - a);
}