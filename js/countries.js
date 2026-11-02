// Ländernamen (Deutsch) und Standardwährung je ISO-3166-1-Alpha-2-Code.
const COUNTRIES = {
  AD: { name: 'Andorra', currency: 'EUR', continent: 'eu', capital: 'Andorra la Vella', population: 80000, language: 'Katalanisch', lat: 42.5, lng: 1.52 },
  AE: { name: 'Vereinigte Arabische Emirate', currency: 'AED', continent: 'as', capital: 'Abu Dhabi', population: 9900000, language: 'Arabisch', lat: 24.47, lng: 54.37 },
  AF: { name: 'Afghanistan', currency: 'AFN', continent: 'as', capital: 'Kabul', population: 40000000, language: 'Paschtu, Dari', lat: 34.53, lng: 69.17 },
  AG: { name: 'Antigua und Barbuda', currency: 'XCD', continent: 'na', capital: 'St. John\'s', population: 100000, language: 'Englisch', lat: 17.12, lng: -61.85 },
  AI: { name: 'Anguilla', currency: 'XCD', continent: 'na', un: false },
  AL: { name: 'Albanien', currency: 'ALL', continent: 'eu', capital: 'Tirana', population: 2800000, language: 'Albanisch', lat: 41.33, lng: 19.82 },
  AM: { name: 'Armenien', currency: 'AMD', continent: 'as', capital: 'Jerewan', population: 2970000, language: 'Armenisch', lat: 40.18, lng: 44.51 },
  AO: { name: 'Angola', currency: 'AOA', continent: 'af', capital: 'Luanda', population: 35000000, language: 'Portugiesisch', lat: -8.84, lng: 13.23 },
  AR: { name: 'Argentinien', currency: 'ARS', continent: 'sa', capital: 'Buenos Aires', population: 46000000, language: 'Spanisch', lat: -34.61, lng: -58.38 },
  AS: { name: 'Amerikanisch-Samoa', currency: 'USD', continent: 'oc', un: false },
  AT: { name: 'Österreich', currency: 'EUR', continent: 'eu', capital: 'Wien', population: 9000000, language: 'Deutsch', lat: 48.21, lng: 16.37 },
  AU: { name: 'Australien', currency: 'AUD', continent: 'oc', capital: 'Canberra', population: 26000000, language: 'Englisch', lat: -35.28, lng: 149.13 },
  AW: { name: 'Aruba', currency: 'AWG', continent: 'na', un: false },
  AZ: { name: 'Aserbaidschan', currency: 'AZN', continent: 'as', capital: 'Baku', population: 10400000, language: 'Aserbaidschanisch', lat: 40.41, lng: 49.87 },
  BA: { name: 'Bosnien und Herzegowina', currency: 'BAM', continent: 'eu', capital: 'Sarajevo', population: 3200000, language: 'Bosnisch, Kroatisch, Serbisch', lat: 43.86, lng: 18.41 },
  BB: { name: 'Barbados', currency: 'BBD', continent: 'na', capital: 'Bridgetown', population: 280000, language: 'Englisch', lat: 13.1, lng: -59.62 },
  BD: { name: 'Bangladesch', currency: 'BDT', continent: 'as', capital: 'Dhaka', population: 173000000, language: 'Bengalisch', lat: 23.81, lng: 90.41 },
  BE: { name: 'Belgien', currency: 'EUR', continent: 'eu', capital: 'Brüssel', population: 11700000, language: 'Niederländisch, Französisch, Deutsch', lat: 50.85, lng: 4.35 },
  BF: { name: 'Burkina Faso', currency: 'XOF', continent: 'af', capital: 'Ouagadougou', population: 23000000, language: 'Französisch', lat: 12.37, lng: -1.52 },
  BG: { name: 'Bulgarien', currency: 'BGN', continent: 'eu', capital: 'Sofia', population: 6400000, language: 'Bulgarisch', lat: 42.7, lng: 23.32 },
  BH: { name: 'Bahrain', currency: 'BHD', continent: 'as', capital: 'Manama', population: 1500000, language: 'Arabisch', lat: 26.23, lng: 50.59 },
  BI: { name: 'Burundi', currency: 'BIF', continent: 'af', capital: 'Gitega', population: 13000000, language: 'Kirundi, Französisch', lat: -3.43, lng: 29.93 },
  BJ: { name: 'Benin', currency: 'XOF', continent: 'af', capital: 'Porto-Novo', population: 13700000, language: 'Französisch', lat: 6.5, lng: 2.6 },
  BL: { name: 'Saint-Barthélemy', currency: 'EUR', continent: 'na', un: false },
  BM: { name: 'Bermuda', currency: 'BMD', continent: 'na', un: false },
  BN: { name: 'Brunei', currency: 'BND', continent: 'as', capital: 'Bandar Seri Begawan', population: 460000, language: 'Malaiisch', lat: 4.94, lng: 114.94 },
  BO: { name: 'Bolivien', currency: 'BOB', continent: 'sa', capital: 'Sucre', population: 12200000, language: 'Spanisch', lat: -19.03, lng: -65.26 },
  BQ: { name: 'Bonaire, Sint Eustatius und Saba', currency: 'USD', continent: 'na', un: false },
  BR: { name: 'Brasilien', currency: 'BRL', continent: 'sa', capital: 'Brasília', population: 216000000, language: 'Portugiesisch', lat: -15.79, lng: -47.88 },
  BS: { name: 'Bahamas', currency: 'BSD', continent: 'na', capital: 'Nassau', population: 400000, language: 'Englisch', lat: 25.06, lng: -77.35 },
  BT: { name: 'Bhutan', currency: 'BTN', continent: 'as', capital: 'Thimphu', population: 780000, language: 'Dzongkha', lat: 27.47, lng: 89.64 },
  BW: { name: 'Botswana', currency: 'BWP', continent: 'af', capital: 'Gaborone', population: 2600000, language: 'Englisch, Setswana', lat: -24.63, lng: 25.9 },
  BY: { name: 'Belarus', currency: 'BYN', continent: 'eu', capital: 'Minsk', population: 9200000, language: 'Belarussisch, Russisch', lat: 53.9, lng: 27.57 },
  BZ: { name: 'Belize', currency: 'BZD', continent: 'na', capital: 'Belmopan', population: 410000, language: 'Englisch', lat: 17.25, lng: -88.77 },
  CA: { name: 'Kanada', currency: 'CAD', continent: 'na', capital: 'Ottawa', population: 40000000, language: 'Englisch, Französisch', lat: 45.42, lng: -75.7 },
  CD: { name: 'Demokratische Republik Kongo', currency: 'CDF', continent: 'af', capital: 'Kinshasa', population: 102000000, language: 'Französisch', lat: -4.32, lng: 15.31 },
  CF: { name: 'Zentralafrikanische Republik', currency: 'XAF', continent: 'af', capital: 'Bangui', population: 5700000, language: 'Französisch, Sango', lat: 4.37, lng: 18.56 },
  CG: { name: 'Kongo-Brazzaville', currency: 'XAF', continent: 'af', capital: 'Brazzaville', population: 6000000, language: 'Französisch', lat: -4.26, lng: 15.24 },
  CH: { name: 'Schweiz', currency: 'CHF', continent: 'eu', capital: 'Bern', population: 8900000, language: 'Deutsch, Französisch, Italienisch, Rätoromanisch', lat: 46.95, lng: 7.45 },
  CI: { name: 'Elfenbeinküste', currency: 'XOF', continent: 'af', capital: 'Yamoussoukro', population: 29000000, language: 'Französisch', lat: 6.83, lng: -5.29 },
  CK: { name: 'Cookinseln', currency: 'NZD', continent: 'oc', un: false },
  CL: { name: 'Chile', currency: 'CLP', continent: 'sa', capital: 'Santiago', population: 19500000, language: 'Spanisch', lat: -33.45, lng: -70.67 },
  CM: { name: 'Kamerun', currency: 'XAF', continent: 'af', capital: 'Yaoundé', population: 28000000, language: 'Französisch, Englisch', lat: 3.87, lng: 11.52 },
  CN: { name: 'China', currency: 'CNY', continent: 'as', capital: 'Peking', population: 1410000000, language: 'Mandarin', lat: 39.9, lng: 116.41 },
  CO: { name: 'Kolumbien', currency: 'COP', continent: 'sa', capital: 'Bogotá', population: 52000000, language: 'Spanisch', lat: 4.71, lng: -74.07 },
  CR: { name: 'Costa Rica', currency: 'CRC', continent: 'na', capital: 'San José', population: 5200000, language: 'Spanisch', lat: 9.93, lng: -84.08 },
  CU: { name: 'Kuba', currency: 'CUP', continent: 'na', capital: 'Havanna', population: 11000000, language: 'Spanisch', lat: 23.13, lng: -82.38 },
  CV: { name: 'Kap Verde', currency: 'CVE', continent: 'af', capital: 'Praia', population: 590000, language: 'Portugiesisch', lat: 14.93, lng: -23.51 },
  CW: { name: 'Curaçao', currency: 'ANG', continent: 'na', un: false },
  CY: { name: 'Zypern', currency: 'EUR', continent: 'eu', capital: 'Nikosia', population: 1200000, language: 'Griechisch, Türkisch', lat: 35.17, lng: 33.37 },
  CZ: { name: 'Tschechien', currency: 'CZK', continent: 'eu', capital: 'Prag', population: 10900000, language: 'Tschechisch', lat: 50.08, lng: 14.44 },
  DE: { name: 'Deutschland', currency: 'EUR', continent: 'eu', capital: 'Berlin', population: 84700000, language: 'Deutsch', lat: 52.52, lng: 13.4 },
  DJ: { name: 'Dschibuti', currency: 'DJF', continent: 'af', capital: 'Dschibuti-Stadt', population: 1100000, language: 'Arabisch, Französisch', lat: 11.59, lng: 43.15 },
  DK: { name: 'Dänemark', currency: 'DKK', continent: 'eu', capital: 'Kopenhagen', population: 5900000, language: 'Dänisch', lat: 55.68, lng: 12.57 },
  DM: { name: 'Dominica', currency: 'XCD', continent: 'na', capital: 'Roseau', population: 72000, language: 'Englisch', lat: 15.3, lng: -61.39 },
  DO: { name: 'Dominikanische Republik', currency: 'DOP', continent: 'na', capital: 'Santo Domingo', population: 11300000, language: 'Spanisch', lat: 18.49, lng: -69.93 },
  DZ: { name: 'Algerien', currency: 'DZD', continent: 'af', capital: 'Algier', population: 46000000, language: 'Arabisch', lat: 36.75, lng: 3.06 },
  EC: { name: 'Ecuador', currency: 'USD', continent: 'sa', capital: 'Quito', population: 18200000, language: 'Spanisch', lat: -0.23, lng: -78.52 },
  EE: { name: 'Estland', currency: 'EUR', continent: 'eu', capital: 'Tallinn', population: 1370000, language: 'Estnisch', lat: 59.44, lng: 24.75 },
  EG: { name: 'Ägypten', currency: 'EGP', continent: 'af', capital: 'Kairo', population: 112000000, language: 'Arabisch', lat: 30.04, lng: 31.24 },
  ER: { name: 'Eritrea', currency: 'ERN', continent: 'af', capital: 'Asmara', population: 3700000, language: 'Tigrinya, Arabisch', lat: 15.34, lng: 38.93 },
  ES: { name: 'Spanien', currency: 'EUR', continent: 'eu', capital: 'Madrid', population: 48000000, language: 'Spanisch', lat: 40.42, lng: -3.7 },
  ET: { name: 'Äthiopien', currency: 'ETB', continent: 'af', capital: 'Addis Abeba', population: 128000000, language: 'Amharisch', lat: 9.03, lng: 38.74 },
  FI: { name: 'Finnland', currency: 'EUR', continent: 'eu', capital: 'Helsinki', population: 5600000, language: 'Finnisch, Schwedisch', lat: 60.17, lng: 24.94 },
  FJ: { name: 'Fidschi', currency: 'FJD', continent: 'oc', capital: 'Suva', population: 930000, language: 'Englisch, Fidschianisch', lat: -18.14, lng: 178.44 },
  FK: { name: 'Falklandinseln', currency: 'FKP', continent: 'sa', un: false },
  FM: { name: 'Mikronesien', currency: 'USD', continent: 'oc', capital: 'Palikir', population: 105000, language: 'Englisch', lat: 6.92, lng: 158.16 },
  FO: { name: 'Färöer', currency: 'DKK', continent: 'eu', un: false },
  FR: { name: 'Frankreich', currency: 'EUR', continent: 'eu', capital: 'Paris', population: 68000000, language: 'Französisch', lat: 48.86, lng: 2.35 },
  GA: { name: 'Gabun', currency: 'XAF', continent: 'af', capital: 'Libreville', population: 2400000, language: 'Französisch', lat: 0.39, lng: 9.45 },
  GB: { name: 'Vereinigtes Königreich', currency: 'GBP', continent: 'eu', capital: 'London', population: 68000000, language: 'Englisch', lat: 51.51, lng: -0.13 },
  GD: { name: 'Grenada', currency: 'XCD', continent: 'na', capital: 'St. George\'s', population: 115000, language: 'Englisch', lat: 12.06, lng: -61.75 },
  GE: { name: 'Georgien', currency: 'GEL', continent: 'as', capital: 'Tiflis', population: 3700000, language: 'Georgisch', lat: 41.72, lng: 44.79 },
  GG: { name: 'Guernsey', currency: 'GBP', continent: 'eu', un: false },
  GH: { name: 'Ghana', currency: 'GHS', continent: 'af', capital: 'Accra', population: 34000000, language: 'Englisch', lat: 5.6, lng: -0.19 },
  GI: { name: 'Gibraltar', currency: 'GIP', continent: 'eu', un: false },
  GL: { name: 'Grönland', currency: 'DKK', continent: 'na', un: false },
  GM: { name: 'Gambia', currency: 'GMD', continent: 'af', capital: 'Banjul', population: 2700000, language: 'Englisch', lat: 13.45, lng: -16.58 },
  GN: { name: 'Guinea', currency: 'GNF', continent: 'af', capital: 'Conakry', population: 14000000, language: 'Französisch', lat: 9.64, lng: -13.58 },
  GQ: { name: 'Äquatorialguinea', currency: 'XAF', continent: 'af', capital: 'Malabo', population: 1700000, language: 'Spanisch, Französisch', lat: 3.75, lng: 8.78 },
  GR: { name: 'Griechenland', currency: 'EUR', continent: 'eu', capital: 'Athen', population: 10400000, language: 'Griechisch', lat: 37.98, lng: 23.73 },
  GS: { name: 'Südgeorgien und die Südlichen Sandwichinseln', currency: 'GBP', continent: 'sa', un: false },
  GT: { name: 'Guatemala', currency: 'GTQ', continent: 'na', capital: 'Guatemala-Stadt', population: 18000000, language: 'Spanisch', lat: 14.63, lng: -90.51 },
  GU: { name: 'Guam', currency: 'USD', continent: 'oc', un: false },
  GW: { name: 'Guinea-Bissau', currency: 'XOF', continent: 'af', capital: 'Bissau', population: 2100000, language: 'Portugiesisch', lat: 11.86, lng: -15.6 },
  GY: { name: 'Guyana', currency: 'GYD', continent: 'sa', capital: 'Georgetown', population: 830000, language: 'Englisch', lat: 6.8, lng: -58.16 },
  HN: { name: 'Honduras', currency: 'HNL', continent: 'na', capital: 'Tegucigalpa', population: 10600000, language: 'Spanisch', lat: 14.07, lng: -87.19 },
  HR: { name: 'Kroatien', currency: 'EUR', continent: 'eu', capital: 'Zagreb', population: 3900000, language: 'Kroatisch', lat: 45.81, lng: 15.98 },
  HT: { name: 'Haiti', currency: 'HTG', continent: 'na', capital: 'Port-au-Prince', population: 11700000, language: 'Französisch, Haitianisch-Kreolisch', lat: 18.59, lng: -72.31 },
  HU: { name: 'Ungarn', currency: 'HUF', continent: 'eu', capital: 'Budapest', population: 9600000, language: 'Ungarisch', lat: 47.5, lng: 19.04 },
  ID: { name: 'Indonesien', currency: 'IDR', continent: 'as', capital: 'Jakarta', population: 280000000, language: 'Indonesisch', lat: -6.21, lng: 106.85 },
  IE: { name: 'Irland', currency: 'EUR', continent: 'eu', capital: 'Dublin', population: 5200000, language: 'Englisch, Irisch', lat: 53.35, lng: -6.26 },
  IL: { name: 'Israel', currency: 'ILS', continent: 'as', capital: 'Jerusalem', population: 9800000, language: 'Hebräisch, Arabisch', lat: 31.77, lng: 35.21 },
  IM: { name: 'Isle of Man', currency: 'GBP', continent: 'eu', un: false },
  IN: { name: 'Indien', currency: 'INR', continent: 'as', capital: 'Neu-Delhi', population: 1440000000, language: 'Hindi, Englisch', lat: 28.61, lng: 77.21 },
  IQ: { name: 'Irak', currency: 'IQD', continent: 'as', capital: 'Bagdad', population: 45000000, language: 'Arabisch, Kurdisch', lat: 33.31, lng: 44.36 },
  IR: { name: 'Iran', currency: 'IRR', continent: 'as', capital: 'Teheran', population: 89000000, language: 'Persisch', lat: 35.69, lng: 51.39 },
  IS: { name: 'Island', currency: 'ISK', continent: 'eu', capital: 'Reykjavík', population: 390000, language: 'Isländisch', lat: 64.15, lng: -21.94 },
  IT: { name: 'Italien', currency: 'EUR', continent: 'eu', capital: 'Rom', population: 59000000, language: 'Italienisch', lat: 41.9, lng: 12.5 },
  JE: { name: 'Jersey', currency: 'GBP', continent: 'eu', un: false },
  JM: { name: 'Jamaika', currency: 'JMD', continent: 'na', capital: 'Kingston', population: 2800000, language: 'Englisch', lat: 17.97, lng: -76.79 },
  JO: { name: 'Jordanien', currency: 'JOD', continent: 'as', capital: 'Amman', population: 11300000, language: 'Arabisch', lat: 31.95, lng: 35.93 },
  JP: { name: 'Japan', currency: 'JPY', continent: 'as', capital: 'Tokio', population: 124000000, language: 'Japanisch', lat: 35.68, lng: 139.65 },
  KE: { name: 'Kenia', currency: 'KES', continent: 'af', capital: 'Nairobi', population: 55000000, language: 'Englisch, Swahili', lat: -1.29, lng: 36.82 },
  KG: { name: 'Kirgisistan', currency: 'KGS', continent: 'as', capital: 'Bischkek', population: 7000000, language: 'Kirgisisch, Russisch', lat: 42.87, lng: 74.59 },
  KH: { name: 'Kambodscha', currency: 'KHR', continent: 'as', capital: 'Phnom Penh', population: 17000000, language: 'Khmer', lat: 11.56, lng: 104.92 },
  KI: { name: 'Kiribati', currency: 'AUD', continent: 'oc', capital: 'Tarawa', population: 130000, language: 'Englisch, Gilbertesisch', lat: 1.33, lng: 173.02 },
  KM: { name: 'Komoren', currency: 'KMF', continent: 'af', capital: 'Moroni', population: 870000, language: 'Komorisch, Arabisch, Französisch', lat: -11.7, lng: 43.26 },
  KN: { name: 'St. Kitts und Nevis', currency: 'XCD', continent: 'na', capital: 'Basseterre', population: 47000, language: 'Englisch', lat: 17.3, lng: -62.73 },
  KP: { name: 'Nordkorea', currency: 'KPW', continent: 'as', capital: 'Pjöngjang', population: 26000000, language: 'Koreanisch', lat: 39.02, lng: 125.75 },
  KR: { name: 'Südkorea', currency: 'KRW', continent: 'as', capital: 'Seoul', population: 51700000, language: 'Koreanisch', lat: 37.57, lng: 126.98 },
  KW: { name: 'Kuwait', currency: 'KWD', continent: 'as', capital: 'Kuwait-Stadt', population: 4300000, language: 'Arabisch', lat: 29.38, lng: 47.98 },
  KY: { name: 'Kaimaninseln', currency: 'KYD', continent: 'na', un: false },
  KZ: { name: 'Kasachstan', currency: 'KZT', continent: 'as', capital: 'Astana', population: 20000000, language: 'Kasachisch, Russisch', lat: 51.18, lng: 71.45 },
  LA: { name: 'Laos', currency: 'LAK', continent: 'as', capital: 'Vientiane', population: 7600000, language: 'Laotisch', lat: 17.97, lng: 102.63 },
  LB: { name: 'Libanon', currency: 'LBP', continent: 'as', capital: 'Beirut', population: 5400000, language: 'Arabisch', lat: 33.89, lng: 35.5 },
  LC: { name: 'St. Lucia', currency: 'XCD', continent: 'na', capital: 'Castries', population: 180000, language: 'Englisch', lat: 14.01, lng: -60.99 },
  LI: { name: 'Liechtenstein', currency: 'CHF', continent: 'eu', capital: 'Vaduz', population: 40000, language: 'Deutsch', lat: 47.14, lng: 9.52 },
  LK: { name: 'Sri Lanka', currency: 'LKR', continent: 'as', capital: 'Colombo', population: 22000000, language: 'Singhalesisch, Tamilisch', lat: 6.93, lng: 79.85 },
  LR: { name: 'Liberia', currency: 'LRD', continent: 'af', capital: 'Monrovia', population: 5400000, language: 'Englisch', lat: 6.3, lng: -10.8 },
  LS: { name: 'Lesotho', currency: 'LSL', continent: 'af', capital: 'Maseru', population: 2300000, language: 'Sesotho, Englisch', lat: -29.31, lng: 27.48 },
  LT: { name: 'Litauen', currency: 'EUR', continent: 'eu', capital: 'Vilnius', population: 2860000, language: 'Litauisch', lat: 54.69, lng: 25.28 },
  LU: { name: 'Luxemburg', currency: 'EUR', continent: 'eu', capital: 'Luxemburg', population: 670000, language: 'Luxemburgisch, Französisch, Deutsch', lat: 49.61, lng: 6.13 },
  LV: { name: 'Lettland', currency: 'EUR', continent: 'eu', capital: 'Riga', population: 1880000, language: 'Lettisch', lat: 56.95, lng: 24.11 },
  LY: { name: 'Libyen', currency: 'LYD', continent: 'af', capital: 'Tripolis', population: 7000000, language: 'Arabisch', lat: 32.89, lng: 13.19 },
  MA: { name: 'Marokko', currency: 'MAD', continent: 'af', capital: 'Rabat', population: 37800000, language: 'Arabisch, Berbersprachen', lat: 34.02, lng: -6.84 },
  MC: { name: 'Monaco', currency: 'EUR', continent: 'eu', capital: 'Monaco', population: 39000, language: 'Französisch', lat: 43.74, lng: 7.42 },
  MD: { name: 'Moldau', currency: 'MDL', continent: 'eu', capital: 'Chișinău', population: 2500000, language: 'Rumänisch', lat: 47.01, lng: 28.86 },
  ME: { name: 'Montenegro', currency: 'EUR', continent: 'eu', capital: 'Podgorica', population: 620000, language: 'Montenegrinisch', lat: 42.44, lng: 19.26 },
  MF: { name: 'Saint-Martin', currency: 'EUR', continent: 'na', un: false },
  MG: { name: 'Madagaskar', currency: 'MGA', continent: 'af', capital: 'Antananarivo', population: 30000000, language: 'Malagasy, Französisch', lat: -18.88, lng: 47.51 },
  MH: { name: 'Marshallinseln', currency: 'USD', continent: 'oc', capital: 'Majuro', population: 42000, language: 'Marshallesisch, Englisch', lat: 7.09, lng: 171.38 },
  MK: { name: 'Nordmazedonien', currency: 'MKD', continent: 'eu', capital: 'Skopje', population: 1830000, language: 'Mazedonisch', lat: 42, lng: 21.43 },
  ML: { name: 'Mali', currency: 'XOF', continent: 'af', capital: 'Bamako', population: 23000000, language: 'Französisch', lat: 12.65, lng: -8 },
  MM: { name: 'Myanmar', currency: 'MMK', continent: 'as', capital: 'Naypyidaw', population: 54000000, language: 'Birmanisch', lat: 19.76, lng: 96.08 },
  MN: { name: 'Mongolei', currency: 'MNT', continent: 'as', capital: 'Ulaanbaatar', population: 3400000, language: 'Mongolisch', lat: 47.89, lng: 106.91 },
  MP: { name: 'Nördliche Marianen', currency: 'USD', continent: 'oc', un: false },
  MR: { name: 'Mauretanien', currency: 'MRU', continent: 'af', capital: 'Nouakchott', population: 4900000, language: 'Arabisch', lat: 18.09, lng: -15.98 },
  MS: { name: 'Montserrat', currency: 'XCD', continent: 'na', un: false },
  MT: { name: 'Malta', currency: 'EUR', continent: 'eu', capital: 'Valletta', population: 540000, language: 'Maltesisch, Englisch', lat: 35.9, lng: 14.51 },
  MU: { name: 'Mauritius', currency: 'MUR', continent: 'af', capital: 'Port Louis', population: 1270000, language: 'Englisch', lat: -20.16, lng: 57.5 },
  MV: { name: 'Maledive', currency: 'MVR', continent: 'as', capital: 'Malé', population: 520000, language: 'Dhivehi', lat: 4.18, lng: 73.51 },
  MW: { name: 'Malawi', currency: 'MWK', continent: 'af', capital: 'Lilongwe', population: 20400000, language: 'Englisch, Chichewa', lat: -13.96, lng: 33.79 },
  MX: { name: 'Mexiko', currency: 'MXN', continent: 'na', capital: 'Mexiko-Stadt', population: 128000000, language: 'Spanisch', lat: 19.43, lng: -99.13 },
  MY: { name: 'Malaysia', currency: 'MYR', continent: 'as', capital: 'Kuala Lumpur', population: 34000000, language: 'Malaiisch', lat: 3.14, lng: 101.69 },
  MZ: { name: 'Mosambik', currency: 'MZN', continent: 'af', capital: 'Maputo', population: 33000000, language: 'Portugiesisch', lat: -25.97, lng: 32.57 },
  NA: { name: 'Namibia', currency: 'NAD', continent: 'af', capital: 'Windhoek', population: 2600000, language: 'Englisch', lat: -22.56, lng: 17.08 },
  NC: { name: 'Neukaledonien', currency: 'XPF', continent: 'oc', un: false },
  NE: { name: 'Niger', currency: 'XOF', continent: 'af', capital: 'Niamey', population: 26000000, language: 'Französisch', lat: 13.51, lng: 2.11 },
  NF: { name: 'Norfolkinsel', currency: 'AUD', continent: 'oc', un: false },
  NG: { name: 'Nigeria', currency: 'NGN', continent: 'af', capital: 'Abuja', population: 224000000, language: 'Englisch', lat: 9.08, lng: 7.4 },
  NI: { name: 'Nicaragua', currency: 'NIO', continent: 'na', capital: 'Managua', population: 6900000, language: 'Spanisch', lat: 12.11, lng: -86.24 },
  NL: { name: 'Niederlande', currency: 'EUR', continent: 'eu', capital: 'Amsterdam', population: 17900000, language: 'Niederländisch', lat: 52.37, lng: 4.9 },
  NO: { name: 'Norwegen', currency: 'NOK', continent: 'eu', capital: 'Oslo', population: 5500000, language: 'Norwegisch', lat: 59.91, lng: 10.75 },
  NP: { name: 'Nepal', currency: 'NPR', continent: 'as', capital: 'Kathmandu', population: 30000000, language: 'Nepalesisch', lat: 27.72, lng: 85.32 },
  NR: { name: 'Nauru', currency: 'AUD', continent: 'oc', capital: 'Yaren', population: 12000, language: 'Nauruisch, Englisch', lat: -0.55, lng: 166.92 },
  NU: { name: 'Niue', currency: 'NZD', continent: 'oc', un: false },
  NZ: { name: 'Neuseeland', currency: 'NZD', continent: 'oc', capital: 'Wellington', population: 5200000, language: 'Englisch, Māori', lat: -41.29, lng: 174.78 },
  OM: { name: 'Oman', currency: 'OMR', continent: 'as', capital: 'Maskat', population: 4600000, language: 'Arabisch', lat: 23.59, lng: 58.41 },
  PA: { name: 'Panama', currency: 'PAB', continent: 'na', capital: 'Panama-Stadt', population: 4400000, language: 'Spanisch', lat: 8.98, lng: -79.52 },
  PE: { name: 'Peru', currency: 'PEN', continent: 'sa', capital: 'Lima', population: 34000000, language: 'Spanisch', lat: -12.05, lng: -77.04 },
  PF: { name: 'Französisch-Polynesien', currency: 'XPF', continent: 'oc', un: false },
  PG: { name: 'Papua-Neuguinea', currency: 'PGK', continent: 'oc', capital: 'Port Moresby', population: 10300000, language: 'Englisch, Tok Pisin', lat: -9.48, lng: 147.15 },
  PH: { name: 'Philippinen', currency: 'PHP', continent: 'as', capital: 'Manila', population: 114000000, language: 'Filipino, Englisch', lat: 14.6, lng: 120.98 },
  PK: { name: 'Pakistan', currency: 'PKR', continent: 'as', capital: 'Islamabad', population: 240000000, language: 'Urdu', lat: 33.72, lng: 73.04 },
  PL: { name: 'Polen', currency: 'PLN', continent: 'eu', capital: 'Warschau', population: 37600000, language: 'Polnisch', lat: 52.23, lng: 21.01 },
  PM: { name: 'Saint-Pierre und Miquelon', currency: 'EUR', continent: 'na', un: false },
  PN: { name: 'Pitcairninseln', currency: 'NZD', continent: 'oc', un: false },
  PR: { name: 'Puerto Rico', currency: 'USD', continent: 'na', un: false },
  PT: { name: 'Portugal', currency: 'EUR', continent: 'eu', capital: 'Lissabon', population: 10500000, language: 'Portugiesisch', lat: 38.72, lng: -9.14 },
  PW: { name: 'Palau', currency: 'USD', continent: 'oc', capital: 'Ngerulmud', population: 18000, language: 'Palauisch, Englisch', lat: 7.5, lng: 134.62 },
  PY: { name: 'Paraguay', currency: 'PYG', continent: 'sa', capital: 'Asunción', population: 6900000, language: 'Spanisch, Guaraní', lat: -25.3, lng: -57.64 },
  QA: { name: 'Katar', currency: 'QAR', continent: 'as', capital: 'Doha', population: 2700000, language: 'Arabisch', lat: 25.29, lng: 51.53 },
  RO: { name: 'Rumänien', currency: 'RON', continent: 'eu', capital: 'Bukarest', population: 19000000, language: 'Rumänisch', lat: 44.43, lng: 26.1 },
  RS: { name: 'Serbien', currency: 'RSD', continent: 'eu', capital: 'Belgrad', population: 6600000, language: 'Serbisch', lat: 44.79, lng: 20.45 },
  RU: { name: 'Russland', currency: 'RUB', continent: 'eu', capital: 'Moskau', population: 144000000, language: 'Russisch', lat: 55.76, lng: 37.62 },
  RW: { name: 'Ruanda', currency: 'RWF', continent: 'af', capital: 'Kigali', population: 13900000, language: 'Kinyarwanda, Französisch, Englisch', lat: -1.94, lng: 30.06 },
  SA: { name: 'Saudi-Arabien', currency: 'SAR', continent: 'as', capital: 'Riad', population: 36000000, language: 'Arabisch', lat: 24.71, lng: 46.68 },
  SB: { name: 'Salomonen', currency: 'SBD', continent: 'oc', capital: 'Honiara', population: 740000, language: 'Englisch', lat: -9.43, lng: 159.95 },
  SC: { name: 'Seychellen', currency: 'SCR', continent: 'af', capital: 'Victoria', population: 100000, language: 'Seychellenkreol, Englisch, Französisch', lat: -4.62, lng: 55.45 },
  SD: { name: 'Sudan', currency: 'SDG', continent: 'af', capital: 'Khartum', population: 48000000, language: 'Arabisch', lat: 15.5, lng: 32.56 },
  SE: { name: 'Schweden', currency: 'SEK', continent: 'eu', capital: 'Stockholm', population: 10600000, language: 'Schwedisch', lat: 59.33, lng: 18.07 },
  SG: { name: 'Singapur', currency: 'SGD', continent: 'as', capital: 'Singapur', population: 5900000, language: 'Englisch, Malaiisch, Mandarin, Tamil', lat: 1.35, lng: 103.82 },
  SH: { name: 'St. Helena', currency: 'SHP', continent: 'af', un: false },
  SI: { name: 'Slowenien', currency: 'EUR', continent: 'eu', capital: 'Ljubljana', population: 2100000, language: 'Slowenisch', lat: 46.06, lng: 14.51 },
  SK: { name: 'Slowakei', currency: 'EUR', continent: 'eu', capital: 'Bratislava', population: 5400000, language: 'Slowakisch', lat: 48.15, lng: 17.11 },
  SL: { name: 'Sierra Leone', currency: 'SLE', continent: 'af', capital: 'Freetown', population: 8600000, language: 'Englisch', lat: 8.48, lng: -13.23 },
  SM: { name: 'San Marino', currency: 'EUR', continent: 'eu', capital: 'San Marino', population: 34000, language: 'Italienisch', lat: 43.94, lng: 12.46 },
  SN: { name: 'Senegal', currency: 'XOF', continent: 'af', capital: 'Dakar', population: 18000000, language: 'Französisch', lat: 14.69, lng: -17.44 },
  SO: { name: 'Somalia', currency: 'SOS', continent: 'af', capital: 'Mogadischu', population: 18100000, language: 'Somali, Arabisch', lat: 2.04, lng: 45.34 },
  SR: { name: 'Suriname', currency: 'SRD', continent: 'sa', capital: 'Paramaribo', population: 620000, language: 'Niederländisch', lat: 5.87, lng: -55.17 },
  SS: { name: 'Südsudan', currency: 'SSP', continent: 'af', capital: 'Juba', population: 11000000, language: 'Englisch', lat: 4.85, lng: 31.58 },
  ST: { name: 'São Tomé und Príncipe', currency: 'STN', continent: 'af', capital: 'São Tomé', population: 230000, language: 'Portugiesisch', lat: 0.33, lng: 6.73 },
  SV: { name: 'El Salvador', currency: 'USD', continent: 'na', capital: 'San Salvador', population: 6300000, language: 'Spanisch', lat: 13.69, lng: -89.22 },
  SX: { name: 'Sint Maarten', currency: 'ANG', continent: 'na', un: false },
  SY: { name: 'Syrien', currency: 'SYP', continent: 'as', capital: 'Damaskus', population: 23000000, language: 'Arabisch', lat: 33.51, lng: 36.28 },
  SZ: { name: 'Eswatini', currency: 'SZL', continent: 'af', capital: 'Mbabane', population: 1200000, language: 'Siswati, Englisch', lat: -26.32, lng: 31.14 },
  TC: { name: 'Turks- und Caicosinseln', currency: 'USD', continent: 'na', un: false },
  TD: { name: 'Tschad', currency: 'XAF', continent: 'af', capital: 'N\'Djamena', population: 18000000, language: 'Französisch, Arabisch', lat: 12.13, lng: 15.06 },
  TF: { name: 'Französische Süd- und Antarktisgebiete', currency: 'EUR', continent: 'af', un: false },
  TG: { name: 'Togo', currency: 'XOF', continent: 'af', capital: 'Lomé', population: 9000000, language: 'Französisch', lat: 6.17, lng: 1.23 },
  TH: { name: 'Thailand', currency: 'THB', continent: 'as', capital: 'Bangkok', population: 71600000, language: 'Thai', lat: 13.75, lng: 100.5 },
  TJ: { name: 'Tadschikistan', currency: 'TJS', continent: 'as', capital: 'Duschanbe', population: 10100000, language: 'Tadschikisch', lat: 38.56, lng: 68.79 },
  TK: { name: 'Tokelau', currency: 'NZD', continent: 'oc', un: false },
  TL: { name: 'Timor-Leste', currency: 'USD', continent: 'as', capital: 'Dili', population: 1400000, language: 'Tetum, Portugiesisch', lat: -8.56, lng: 125.57 },
  TM: { name: 'Turkmenistan', currency: 'TMT', continent: 'as', capital: 'Aşgabat', population: 6400000, language: 'Turkmenisch', lat: 37.95, lng: 58.38 },
  TN: { name: 'Tunesien', currency: 'TND', continent: 'af', capital: 'Tunis', population: 12300000, language: 'Arabisch', lat: 36.81, lng: 10.18 },
  TO: { name: 'Tonga', currency: 'TOP', continent: 'oc', capital: 'Nukuʻalofa', population: 104000, language: 'Tongaisch, Englisch', lat: -21.14, lng: -175.2 },
  TR: { name: 'Türkei', currency: 'TRY', continent: 'as', capital: 'Ankara', population: 85600000, language: 'Türkisch', lat: 39.93, lng: 32.86 },
  TT: { name: 'Trinidad und Tobago', currency: 'TTD', continent: 'na', capital: 'Port of Spain', population: 1500000, language: 'Englisch', lat: 10.65, lng: -61.52 },
  TV: { name: 'Tuvalu', currency: 'AUD', continent: 'oc', capital: 'Funafuti', population: 11000, language: 'Tuvaluisch, Englisch', lat: -8.52, lng: 179.2 },
  TZ: { name: 'Tansania', currency: 'TZS', continent: 'af', capital: 'Dodoma', population: 67000000, language: 'Swahili, Englisch', lat: -6.17, lng: 35.74 },
  UA: { name: 'Ukraine', currency: 'UAH', continent: 'eu', capital: 'Kiew', population: 37000000, language: 'Ukrainisch', lat: 50.45, lng: 30.52 },
  UG: { name: 'Uganda', currency: 'UGX', continent: 'af', capital: 'Kampala', population: 48000000, language: 'Englisch, Swahili', lat: 0.35, lng: 32.58 },
  US: { name: 'Vereinigte Staaten', currency: 'USD', continent: 'na', capital: 'Washington, D.C.', population: 335000000, language: 'Englisch', lat: 38.9, lng: -77.04 },
  UY: { name: 'Uruguay', currency: 'UYU', continent: 'sa', capital: 'Montevideo', population: 3400000, language: 'Spanisch', lat: -34.9, lng: -56.16 },
  UZ: { name: 'Usbekistan', currency: 'UZS', continent: 'as', capital: 'Taschkent', population: 36000000, language: 'Usbekisch', lat: 41.3, lng: 69.24 },
  VA: { name: 'Vatikanstadt', currency: 'EUR', continent: 'eu', capital: 'Vatikanstadt', population: 800, language: 'Latein, Italienisch', lat: 41.9, lng: 12.45 },
  VC: { name: 'St. Vincent und die Grenadinen', currency: 'XCD', continent: 'na', capital: 'Kingstown', population: 104000, language: 'Englisch', lat: 13.16, lng: -61.22 },
  VE: { name: 'Venezuela', currency: 'VES', continent: 'sa', capital: 'Caracas', population: 28000000, language: 'Spanisch', lat: 10.49, lng: -66.88 },
  VG: { name: 'Britische Jungferninseln', currency: 'USD', continent: 'na', un: false },
  VI: { name: 'Amerikanische Jungferninseln', currency: 'USD', continent: 'na', un: false },
  VN: { name: 'Vietnam', currency: 'VND', continent: 'as', capital: 'Hanoi', population: 100000000, language: 'Vietnamesisch', lat: 21.03, lng: 105.85 },
  VU: { name: 'Vanuatu', currency: 'VUV', continent: 'oc', capital: 'Port Vila', population: 330000, language: 'Bislama, Englisch, Französisch', lat: -17.73, lng: 168.32 },
  WF: { name: 'Wallis und Futuna', currency: 'XPF', continent: 'oc', un: false },
  WS: { name: 'Samoa', currency: 'WST', continent: 'oc', capital: 'Apia', population: 220000, language: 'Samoanisch, Englisch', lat: -13.83, lng: -171.76 },
  XK: { name: 'Kosovo', currency: 'EUR', continent: 'eu', un: false, capital: 'Pristina', population: 1600000, language: 'Albanisch, Serbisch', lat: 42.67, lng: 21.17 },
  YE: { name: 'Jemen', currency: 'YER', continent: 'as', capital: 'Sanaa', population: 34000000, language: 'Arabisch', lat: 15.37, lng: 44.19 },
  ZA: { name: 'Südafrika', currency: 'ZAR', continent: 'af', capital: 'Pretoria', population: 63000000, language: 'Zulu, Xhosa, Englisch, Afrikaans u.a. (11 Amtssprachen)', lat: -25.75, lng: 28.19 },
  ZM: { name: 'Sambia', currency: 'ZMW', continent: 'af', capital: 'Lusaka', population: 20500000, language: 'Englisch', lat: -15.39, lng: 28.32 },
  ZW: { name: 'Simbabwe', currency: 'ZWL', continent: 'af', capital: 'Harare', population: 16300000, language: 'Englisch, Shona, Ndebele', lat: -17.83, lng: 31.05 },
};

const Countries = {
  all: COUNTRIES,
  name(code) {
    return (COUNTRIES[code] && COUNTRIES[code].name) || code;
  },
  currency(code) {
    return (COUNTRIES[code] && COUNTRIES[code].currency) || 'EUR';
  },
  facts(code) {
    const c = COUNTRIES[code];
    if (!c || !c.capital) return null;
    return { capital: c.capital, population: c.population, language: c.language };
  },
  latLng(code) {
    const c = COUNTRIES[code];
    if (!c || typeof c.lat !== 'number') return null;
    return { lat: c.lat, lng: c.lng };
  },
  formatPopulation(n) {
    if (!n) return '';
    if (n >= 1000000) return (n / 1000000).toLocaleString('de-DE', { maximumFractionDigits: 1 }) + ' Mio.';
    return n.toLocaleString('de-DE');
  },
  sortedCodes() {
    return Object.keys(COUNTRIES).sort((a, b) => COUNTRIES[a].name.localeCompare(COUNTRIES[b].name, 'de'));
  },
  continent(code) {
    return (COUNTRIES[code] && COUNTRIES[code].continent) || null;
  },
  isUN(code) {
    const c = COUNTRIES[code];
    return !!c && c.un !== false;
  },
  unCodes() {
    return Object.keys(COUNTRIES).filter((c) => Countries.isUN(c));
  },
  codesByContinent(key, unOnly) {
    return Object.keys(COUNTRIES).filter((c) => COUNTRIES[c].continent === key && (!unOnly || Countries.isUN(c)));
  },
  flagEmoji(code) {
    if (!code || !/^[A-Za-z]{2}$/.test(code)) return '🏳️';
    return code.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
  },

  // Durchsuchbare Länderauswahl als Bottom-Sheet. opts: { title, selected, codes, onSelect }
  openPickerSheet(opts) {
    opts = opts || {};
    const codes = opts.codes || Countries.sortedCodes();
    App.openSheet(opts.title || 'Land auswählen', (body) => {
      body.innerHTML =
        '<input id="cp-search" class="search-input" type="text" placeholder="Land suchen…" autofocus>' +
        '<div id="cp-list" class="picker-list"></div>';

      function render(filter) {
        const f = (filter || '').trim().toLowerCase();
        const matches = codes.filter((c) => !f || Countries.name(c).toLowerCase().includes(f));
        const list = App.qs('#cp-list', body);
        list.innerHTML = matches.length === 0 ? '<p class="muted center">Keine Treffer</p>' : matches.map((c) =>
          '<button class="list-item" data-code="' + c + '">' +
          '<div class="country-flag-box" style="background:var(--bg-sunken)">' + Countries.flagEmoji(c) + '</div>' +
          '<div class="main"><div class="title">' + App.escapeHtml(Countries.name(c)) + '</div></div>' +
          (c === opts.selected ? '<span class="chev">✓</span>' : '<span class="chev">›</span>') +
          '</button>'
        ).join('');
        App.qsa('[data-code]', list).forEach((btn) => {
          btn.addEventListener('click', () => {
            App.closeSheet();
            opts.onSelect(btn.dataset.code);
          });
        });
      }
      render('');
      App.qs('#cp-search', body).addEventListener('input', (e) => render(e.target.value));
    });
  },
};

const CONTINENTS = [
  { key: 'eu', label: 'Europa' },
  { key: 'af', label: 'Afrika' },
  { key: 'as', label: 'Asien' },
  { key: 'na', label: 'Nordamerika' },
  { key: 'sa', label: 'Südamerika' },
  { key: 'oc', label: 'Ozeanien' },
];
