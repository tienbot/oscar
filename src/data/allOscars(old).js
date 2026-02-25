import oscar1929_1931 from './oscar_1929-1931.js';
import oscar1932_1934 from './oscar_1932-1934.js';
import oscar1935_1936 from './oscar_1935-1936.js';
import oscar1937_1938 from './oscar_1937-1938.js';
import oscar1939_1940 from './oscar_1939-1940.js';
import oscar1941_1942 from './oscar_1941-1942.js';
import oscar1943_1944 from './oscar_1943-1944.js';
import oscar1945_1946 from './oscar_1945-1946.js';
import oscar1947_1948 from './oscar_1947-1948.js';
import oscar1949_1950 from './oscar_1949-1950.js';
import oscar1951_1952 from './oscar_1951-1952.js';
import oscar1953_1954 from './oscar_1953-1954.js';
import oscar1955_1956 from './oscar_1955-1956.js';
import oscar1957_1958 from './oscar_1957-1958.js';
import oscar1959_1960 from './oscar_1959-1960.js';
import oscar1961_1962 from './oscar_1961-1962.js';
import oscar1963_1964 from './oscar_1963-1964.js';
import oscar1965_1966 from './oscar_1965-1966.js';
import oscar1967_1968 from './oscar_1967-1968.js';
import oscar1969_1970 from './oscar_1969-1970.js';
import oscar1971_1972 from './oscar_1971-1972.js';
import oscar1973_1974 from './oscar_1973-1974.js';
import oscar1975_1976 from './oscar_1975-1976.js';
import oscar1977_1978 from './oscar_1977-1978.js';
import oscar1979_1980 from './oscar_1979-1980.js';
import oscar1981_1982 from './oscar_1981-1982.js';
import oscar1983_1984 from './oscar_1983-1984.js';
import oscar1985_1986 from './oscar_1985-1986.js';
import oscar1987_1988 from './oscar_1987-1988.js';
import oscar1989_1990 from './oscar_1989-1990.js';
import oscar1991_1992 from './oscar_1991-1992.js';
import oscar1993_1994 from './oscar_1993-1994.js';
import oscar1995_1996 from './oscar_1995-1996.js';
import oscar1997_1998 from './oscar_1997-1998.js';
import oscar1999_2000 from './oscar_1999-2000.js';
import oscar2001_2002 from './oscar_2001-2002.js';
import oscar2003_2004 from './oscar_2003-2004.js';
import oscar2005_2006 from './oscar_2005-2006.js';
import oscar2007_2008 from './oscar_2007-2008.js';
import oscar2009_2010 from './oscar_2009-2010.js';
import oscar2011_2012 from './oscar_2011-2012.js';
import oscar2013_2014 from './oscar_2013-2014.js';
import oscar2015_2016 from './oscar_2015-2016.js';
import oscar2017_2018 from './oscar_2017-2018.js';
import oscar2019_2020 from './oscar_2019-2020.js';
import oscar2021_2022 from './oscar_2021-2022.js';
import oscar2023_2024 from './oscar_2023-2024.js';
import oscar2025_2026 from './oscar_2025-2026.js';

const allOscars = [
  ...oscar1929_1931,
  ...oscar1932_1934,
  ...oscar1935_1936,
  ...oscar1937_1938,
  ...oscar1939_1940,
  ...oscar1941_1942,
  ...oscar1943_1944,
  ...oscar1945_1946,
  ...oscar1947_1948,
  ...oscar1949_1950,
  ...oscar1951_1952,
  ...oscar1953_1954,
  ...oscar1955_1956,
  ...oscar1957_1958,
  ...oscar1959_1960,
  ...oscar1961_1962,
  ...oscar1963_1964,
  ...oscar1965_1966,
  ...oscar1967_1968,
  ...oscar1969_1970,
  ...oscar1971_1972,
  ...oscar1973_1974,
  ...oscar1975_1976,
  ...oscar1977_1978,
  ...oscar1979_1980,
  ...oscar1981_1982,
  ...oscar1983_1984,
  ...oscar1985_1986,
  ...oscar1987_1988,
  ...oscar1989_1990,
  ...oscar1991_1992,
  ...oscar1993_1994,
  ...oscar1995_1996,
  ...oscar1997_1998,
  ...oscar1999_2000,
  ...oscar2001_2002,
  ...oscar2003_2004,
  ...oscar2005_2006,
  ...oscar2007_2008,
  ...oscar2009_2010,
  ...oscar2011_2012,
  ...oscar2013_2014,
  ...oscar2015_2016,
  ...oscar2017_2018,
  ...oscar2019_2020,
  ...oscar2021_2022,
  ...oscar2023_2024,
  ...oscar2025_2026,
].flat(); // убираем undefined, если какой-то импорт не сработал

// Сортировка ОТ СТАРЫХ К НОВЫМ (1929 → 2026)
allOscars.sort((a, b) => (b.year || 0) - (a.year || 0));

console.log(`[allOscars] Загружено ${allOscars.length} групп`);
console.log(`[allOscars] Первый год:`, allOscars[0]?.year);
console.log(`[allOscars] Последний год:`, allOscars[allOscars.length - 1]?.year);
console.log(`[allOscars] Пример первой группы:`, allOscars[0]);

export default allOscars;