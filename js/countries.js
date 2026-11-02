// Ländernamen (Deutsch) und Standardwährung je ISO-3166-1-Alpha-2-Code.
const COUNTRIES = {
  AD: { name: 'Andorra', currency: 'EUR', continent: 'eu', capital: 'Andorra la Vella', population: 80000, language: 'Katalanisch', lat: 42.5, lng: 1.52 , emergency: 'Polizei 110 · Rettung 116 · Feuerwehr 118'},
  AE: { name: 'Vereinigte Arabische Emirate', currency: 'AED', continent: 'as', capital: 'Abu Dhabi', population: 9900000, language: 'Arabisch', lat: 24.47, lng: 54.37 , emergency: 'Polizei 999 · Rettung 998 · Feuerwehr 997'},
  AF: { name: 'Afghanistan', currency: 'AFN', continent: 'as', capital: 'Kabul', population: 40000000, language: 'Paschtu, Dari', lat: 34.53, lng: 69.17 , emergency: 'Polizei 119 · Rettung 112'},
  AG: { name: 'Antigua und Barbuda', currency: 'XCD', continent: 'na', capital: 'St. John\'s', population: 100000, language: 'Englisch', lat: 17.12, lng: -61.85 , emergency: '911 / 999'},
  AI: { name: 'Anguilla', currency: 'XCD', continent: 'na', un: false , emergency: '911'},
  AL: { name: 'Albanien', currency: 'ALL', continent: 'eu', capital: 'Tirana', population: 2800000, language: 'Albanisch', lat: 41.33, lng: 19.82 , emergency: 'Polizei 129 · Rettung 127 · Feuerwehr 128 (Handy: 112)'},
  AM: { name: 'Armenien', currency: 'AMD', continent: 'as', capital: 'Jerewan', population: 2970000, language: 'Armenisch', lat: 40.18, lng: 44.51 , emergency: '112'},
  AO: { name: 'Angola', currency: 'AOA', continent: 'af', capital: 'Luanda', population: 35000000, language: 'Portugiesisch', lat: -8.84, lng: 13.23 , emergency: 'Polizei 113 · Rettung 112/116 · Feuerwehr 115'},
  AR: { name: 'Argentinien', currency: 'ARS', continent: 'sa', capital: 'Buenos Aires', population: 46000000, language: 'Spanisch', lat: -34.61, lng: -58.38 , emergency: 'Polizei 101 · Rettung 107 · Feuerwehr 100 (auch 911)'},
  AS: { name: 'Amerikanisch-Samoa', currency: 'USD', continent: 'oc', un: false , emergency: '911'},
  AT: { name: 'Österreich', currency: 'EUR', continent: 'eu', capital: 'Wien', population: 9000000, language: 'Deutsch', lat: 48.21, lng: 16.37 , emergency: 'Polizei 133 · Rettung 144 · Feuerwehr 122 (auch 112)'},
  AU: { name: 'Australien', currency: 'AUD', continent: 'oc', capital: 'Canberra', population: 26000000, language: 'Englisch', lat: -35.28, lng: 149.13 , emergency: '000 (Handy: 112)'},
  AW: { name: 'Aruba', currency: 'AWG', continent: 'na', un: false , emergency: '911'},
  AZ: { name: 'Aserbaidschan', currency: 'AZN', continent: 'as', capital: 'Baku', population: 10400000, language: 'Aserbaidschanisch', lat: 40.41, lng: 49.87 , emergency: '112'},
  BA: { name: 'Bosnien und Herzegowina', currency: 'BAM', continent: 'eu', capital: 'Sarajevo', population: 3200000, language: 'Bosnisch, Kroatisch, Serbisch', lat: 43.86, lng: 18.41 , emergency: 'Polizei 122 · Rettung 124 · Feuerwehr 123'},
  BB: { name: 'Barbados', currency: 'BBD', continent: 'na', capital: 'Bridgetown', population: 280000, language: 'Englisch', lat: 13.1, lng: -59.62 , emergency: 'Polizei 211 · Rettung 511 · Feuerwehr 311'},
  BD: { name: 'Bangladesch', currency: 'BDT', continent: 'as', capital: 'Dhaka', population: 173000000, language: 'Bengalisch', lat: 23.81, lng: 90.41 , emergency: '999'},
  BE: { name: 'Belgien', currency: 'EUR', continent: 'eu', capital: 'Brüssel', population: 11700000, language: 'Niederländisch, Französisch, Deutsch', lat: 50.85, lng: 4.35 , emergency: '112 (Polizei auch 101)'},
  BF: { name: 'Burkina Faso', currency: 'XOF', continent: 'af', capital: 'Ouagadougou', population: 23000000, language: 'Französisch', lat: 12.37, lng: -1.52 , emergency: 'Polizei 17 · Rettung 112 · Feuerwehr 18'},
  BG: { name: 'Bulgarien', currency: 'BGN', continent: 'eu', capital: 'Sofia', population: 6400000, language: 'Bulgarisch', lat: 42.7, lng: 23.32 , emergency: '112'},
  BH: { name: 'Bahrain', currency: 'BHD', continent: 'as', capital: 'Manama', population: 1500000, language: 'Arabisch', lat: 26.23, lng: 50.59 , emergency: '999 (Handy: 112)'},
  BI: { name: 'Burundi', currency: 'BIF', continent: 'af', capital: 'Gitega', population: 13000000, language: 'Kirundi, Französisch', lat: -3.43, lng: 29.93 , emergency: 'Polizei 117 · Rettung 112 · Feuerwehr 118'},
  BJ: { name: 'Benin', currency: 'XOF', continent: 'af', capital: 'Porto-Novo', population: 13700000, language: 'Französisch', lat: 6.5, lng: 2.6 , emergency: 'Polizei 117 · Rettung 112 · Feuerwehr 118'},
  BL: { name: 'Saint-Barthélemy', currency: 'EUR', continent: 'na', un: false , emergency: 'Polizei 17 · Feuerwehr 18'},
  BM: { name: 'Bermuda', currency: 'BMD', continent: 'na', un: false , emergency: '911'},
  BN: { name: 'Brunei', currency: 'BND', continent: 'as', capital: 'Bandar Seri Begawan', population: 460000, language: 'Malaiisch', lat: 4.94, lng: 114.94 , emergency: 'Polizei 993 · Rettung 991 · Feuerwehr 995'},
  BO: { name: 'Bolivien', currency: 'BOB', continent: 'sa', capital: 'Sucre', population: 12200000, language: 'Spanisch', lat: -19.03, lng: -65.26 , emergency: 'Polizei 110 · Rettung 118 · Feuerwehr 119 (auch 911)'},
  BQ: { name: 'Bonaire, Sint Eustatius und Saba', currency: 'USD', continent: 'na', un: false , emergency: '911'},
  BR: { name: 'Brasilien', currency: 'BRL', continent: 'sa', capital: 'Brasília', population: 216000000, language: 'Portugiesisch', lat: -15.79, lng: -47.88 , emergency: 'Polizei 190 · Rettung 192 · Feuerwehr 193'},
  BS: { name: 'Bahamas', currency: 'BSD', continent: 'na', capital: 'Nassau', population: 400000, language: 'Englisch', lat: 25.06, lng: -77.35 , emergency: '911 (Handy: 112)'},
  BT: { name: 'Bhutan', currency: 'BTN', continent: 'as', capital: 'Thimphu', population: 780000, language: 'Dzongkha', lat: 27.47, lng: 89.64 , emergency: 'Polizei 113 · Rettung 112 · Feuerwehr 110'},
  BW: { name: 'Botswana', currency: 'BWP', continent: 'af', capital: 'Gaborone', population: 2600000, language: 'Englisch, Setswana', lat: -24.63, lng: 25.9 , emergency: 'Polizei 999 · Rettung 997 · Feuerwehr 998 (Handy: 112)'},
  BY: { name: 'Belarus', currency: 'BYN', continent: 'eu', capital: 'Minsk', population: 9200000, language: 'Belarussisch, Russisch', lat: 53.9, lng: 27.57 , emergency: 'Polizei 102 · Rettung 103 · Feuerwehr 101'},
  BZ: { name: 'Belize', currency: 'BZD', continent: 'na', capital: 'Belmopan', population: 410000, language: 'Englisch', lat: 17.25, lng: -88.77 , emergency: '911'},
  CA: { name: 'Kanada', currency: 'CAD', continent: 'na', capital: 'Ottawa', population: 40000000, language: 'Englisch, Französisch', lat: 45.42, lng: -75.7 , emergency: '911'},
  CD: { name: 'Demokratische Republik Kongo', currency: 'CDF', continent: 'af', capital: 'Kinshasa', population: 102000000, language: 'Französisch', lat: -4.32, lng: 15.31 , emergency: '112'},
  CF: { name: 'Zentralafrikanische Republik', currency: 'XAF', continent: 'af', capital: 'Bangui', population: 5700000, language: 'Französisch, Sango', lat: 4.37, lng: 18.56 , emergency: 'Polizei 117 · Rettung 1220 · Feuerwehr 118'},
  CG: { name: 'Kongo-Brazzaville', currency: 'XAF', continent: 'af', capital: 'Brazzaville', population: 6000000, language: 'Französisch', lat: -4.26, lng: 15.24 , emergency: 'Polizei 117 · Feuerwehr 118'},
  CH: { name: 'Schweiz', currency: 'CHF', continent: 'eu', capital: 'Bern', population: 8900000, language: 'Deutsch, Französisch, Italienisch, Rätoromanisch', lat: 46.95, lng: 7.45 , emergency: 'Polizei 117 · Rettung 144 · Feuerwehr 118'},
  CI: { name: 'Elfenbeinküste', currency: 'XOF', continent: 'af', capital: 'Yamoussoukro', population: 29000000, language: 'Französisch', lat: 6.83, lng: -5.29 , emergency: 'Polizei 110/111 · Rettung 185 · Feuerwehr 180'},
  CK: { name: 'Cookinseln', currency: 'NZD', continent: 'oc', un: false , emergency: '999'},
  CL: { name: 'Chile', currency: 'CLP', continent: 'sa', capital: 'Santiago', population: 19500000, language: 'Spanisch', lat: -33.45, lng: -70.67 , emergency: 'Polizei 133 · Rettung 131 · Feuerwehr 132'},
  CM: { name: 'Kamerun', currency: 'XAF', continent: 'af', capital: 'Yaoundé', population: 28000000, language: 'Französisch, Englisch', lat: 3.87, lng: 11.52 , emergency: 'Polizei 117 · Rettung 119 · Feuerwehr 118 (Handy: 112)'},
  CN: { name: 'China', currency: 'CNY', continent: 'as', capital: 'Peking', population: 1410000000, language: 'Mandarin', lat: 39.9, lng: 116.41 , emergency: 'Polizei 110 · Rettung 120 · Feuerwehr 119'},
  CO: { name: 'Kolumbien', currency: 'COP', continent: 'sa', capital: 'Bogotá', population: 52000000, language: 'Spanisch', lat: 4.71, lng: -74.07 , emergency: '112 (Rettung 125 · Feuerwehr 119)'},
  CR: { name: 'Costa Rica', currency: 'CRC', continent: 'na', capital: 'San José', population: 5200000, language: 'Spanisch', lat: 9.93, lng: -84.08 , emergency: '911 (Handy: 112)'},
  CU: { name: 'Kuba', currency: 'CUP', continent: 'na', capital: 'Havanna', population: 11000000, language: 'Spanisch', lat: 23.13, lng: -82.38 , emergency: 'Polizei 106 · Rettung 104 · Feuerwehr 105'},
  CV: { name: 'Kap Verde', currency: 'CVE', continent: 'af', capital: 'Praia', population: 590000, language: 'Portugiesisch', lat: 14.93, lng: -23.51 , emergency: 'Polizei 132 · Rettung 130 · Feuerwehr 131', embassyDe: { name: 'Kein deutsches Konsulat vor Ort – zuständig: Deutsche Botschaft Lissabon', address: 'Campo dos Mártires da Pátria 38, 1169-043 Lissabon, Portugal', phone: '+351 21 881 02 10', note: 'Notfalltelefon Lissabon: +351 96 580 80 92 · Honorarkonsul in Mindelo (kein Pass-/Visaservice): Carlos Ferreira Santos, Tel. +238 231 27 25, mindelo@hk-diplo.de' }},
  CW: { name: 'Curaçao', currency: 'ANG', continent: 'na', un: false , emergency: '911 (Rettung auch 910/912)'},
  CY: { name: 'Zypern', currency: 'EUR', continent: 'eu', capital: 'Nikosia', population: 1200000, language: 'Griechisch, Türkisch', lat: 35.17, lng: 33.37 , emergency: '112'},
  CZ: { name: 'Tschechien', currency: 'CZK', continent: 'eu', capital: 'Prag', population: 10900000, language: 'Tschechisch', lat: 50.08, lng: 14.44 , emergency: '112'},
  DE: { name: 'Deutschland', currency: 'EUR', continent: 'eu', capital: 'Berlin', population: 84700000, language: 'Deutsch', lat: 52.52, lng: 13.4 , emergency: 'Polizei 110 · Rettung/Feuerwehr 112'},
  DJ: { name: 'Dschibuti', currency: 'DJF', continent: 'af', capital: 'Dschibuti-Stadt', population: 1100000, language: 'Arabisch, Französisch', lat: 11.59, lng: 43.15 , emergency: 'Polizei 17 · Rettung 19 · Feuerwehr 18'},
  DK: { name: 'Dänemark', currency: 'DKK', continent: 'eu', capital: 'Kopenhagen', population: 5900000, language: 'Dänisch', lat: 55.68, lng: 12.57 , emergency: '112'},
  DM: { name: 'Dominica', currency: 'XCD', continent: 'na', capital: 'Roseau', population: 72000, language: 'Englisch', lat: 15.3, lng: -61.39 , emergency: '999'},
  DO: { name: 'Dominikanische Republik', currency: 'DOP', continent: 'na', capital: 'Santo Domingo', population: 11300000, language: 'Spanisch', lat: 18.49, lng: -69.93 , emergency: '911 (Handy: 112)'},
  DZ: { name: 'Algerien', currency: 'DZD', continent: 'af', capital: 'Algier', population: 46000000, language: 'Arabisch', lat: 36.75, lng: 3.06 , emergency: 'Polizei 1548 · Rettung 14'},
  EC: { name: 'Ecuador', currency: 'USD', continent: 'sa', capital: 'Quito', population: 18200000, language: 'Spanisch', lat: -0.23, lng: -78.52 , emergency: 'Polizei 101 · Rettung 131 · Feuerwehr 102 (auch 911)'},
  EE: { name: 'Estland', currency: 'EUR', continent: 'eu', capital: 'Tallinn', population: 1370000, language: 'Estnisch', lat: 59.44, lng: 24.75 , emergency: '112'},
  EG: { name: 'Ägypten', currency: 'EGP', continent: 'af', capital: 'Kairo', population: 112000000, language: 'Arabisch', lat: 30.04, lng: 31.24 , emergency: 'Polizei 122 · Rettung 123 · Feuerwehr 180 (Handy: 112)'},
  ER: { name: 'Eritrea', currency: 'ERN', continent: 'af', capital: 'Asmara', population: 3700000, language: 'Tigrinya, Arabisch', lat: 15.34, lng: 38.93 , emergency: 'Polizei 113 · Rettung 114 · Feuerwehr 116'},
  ES: { name: 'Spanien', currency: 'EUR', continent: 'eu', capital: 'Madrid', population: 48000000, language: 'Spanisch', lat: 40.42, lng: -3.7 , emergency: '112'},
  ET: { name: 'Äthiopien', currency: 'ETB', continent: 'af', capital: 'Addis Abeba', population: 128000000, language: 'Amharisch', lat: 9.03, lng: 38.74 , emergency: 'Polizei 991 · Rettung 907 · Feuerwehr 939 (teils 911)'},
  FI: { name: 'Finnland', currency: 'EUR', continent: 'eu', capital: 'Helsinki', population: 5600000, language: 'Finnisch, Schwedisch', lat: 60.17, lng: 24.94 , emergency: '112'},
  FJ: { name: 'Fidschi', currency: 'FJD', continent: 'oc', capital: 'Suva', population: 930000, language: 'Englisch, Fidschianisch', lat: -18.14, lng: 178.44 , emergency: 'Polizei 917 · Feuerwehr 910 (auch 911)'},
  FK: { name: 'Falklandinseln', currency: 'FKP', continent: 'sa', un: false , emergency: '112 / 999'},
  FM: { name: 'Mikronesien', currency: 'USD', continent: 'oc', capital: 'Palikir', population: 105000, language: 'Englisch', lat: 6.92, lng: 158.16 , emergency: '911'},
  FO: { name: 'Färöer', currency: 'DKK', continent: 'eu', un: false , emergency: '112'},
  FR: { name: 'Frankreich', currency: 'EUR', continent: 'eu', capital: 'Paris', population: 68000000, language: 'Französisch', lat: 48.86, lng: 2.35 , emergency: 'Rettung 15 · Polizei 17 · Feuerwehr 18 (auch 112)'},
  GA: { name: 'Gabun', currency: 'XAF', continent: 'af', capital: 'Libreville', population: 2400000, language: 'Französisch', lat: 0.39, lng: 9.45 , emergency: 'Polizei 1730 · Rettung 1300 · Feuerwehr 18'},
  GB: { name: 'Vereinigtes Königreich', currency: 'GBP', continent: 'eu', capital: 'London', population: 68000000, language: 'Englisch', lat: 51.51, lng: -0.13 , emergency: '999 / 112'},
  GD: { name: 'Grenada', currency: 'XCD', continent: 'na', capital: 'St. George\'s', population: 115000, language: 'Englisch', lat: 12.06, lng: -61.75 , emergency: '911'},
  GE: { name: 'Georgien', currency: 'GEL', continent: 'as', capital: 'Tiflis', population: 3700000, language: 'Georgisch', lat: 41.72, lng: 44.79 , emergency: '112'},
  GG: { name: 'Guernsey', currency: 'GBP', continent: 'eu', un: false , emergency: '112 / 999'},
  GH: { name: 'Ghana', currency: 'GHS', continent: 'af', capital: 'Accra', population: 34000000, language: 'Englisch', lat: 5.6, lng: -0.19 , emergency: 'Polizei 191 · Rettung 193 · Feuerwehr 192 (Handy: 112)'},
  GI: { name: 'Gibraltar', currency: 'GIP', continent: 'eu', un: false , emergency: '112 / 999'},
  GL: { name: 'Grönland', currency: 'DKK', continent: 'na', un: false , emergency: '112'},
  GM: { name: 'Gambia', currency: 'GMD', continent: 'af', capital: 'Banjul', population: 2700000, language: 'Englisch', lat: 13.45, lng: -16.58 , emergency: '112'},
  GN: { name: 'Guinea', currency: 'GNF', continent: 'af', capital: 'Conakry', population: 14000000, language: 'Französisch', lat: 9.64, lng: -13.58 , emergency: 'Polizei 117 · Rettung 18'},
  GQ: { name: 'Äquatorialguinea', currency: 'XAF', continent: 'af', capital: 'Malabo', population: 1700000, language: 'Spanisch, Französisch', lat: 3.75, lng: 8.78 , emergency: 'Polizei 114 · Rettung 115 · Feuerwehr 112'},
  GR: { name: 'Griechenland', currency: 'EUR', continent: 'eu', capital: 'Athen', population: 10400000, language: 'Griechisch', lat: 37.98, lng: 23.73 , emergency: '112'},
  GS: { name: 'Südgeorgien und die Südlichen Sandwichinseln', currency: 'GBP', continent: 'sa', un: false , emergency: '999'},
  GT: { name: 'Guatemala', currency: 'GTQ', continent: 'na', capital: 'Guatemala-Stadt', population: 18000000, language: 'Spanisch', lat: 14.63, lng: -90.51 , emergency: 'Polizei 110 · Rettung 122 · Feuerwehr 123'},
  GU: { name: 'Guam', currency: 'USD', continent: 'oc', un: false , emergency: '911'},
  GW: { name: 'Guinea-Bissau', currency: 'XOF', continent: 'af', capital: 'Bissau', population: 2100000, language: 'Portugiesisch', lat: 11.86, lng: -15.6 , emergency: 'Polizei 117 · Rettung 119 · Feuerwehr 118 (Handy: 112)'},
  GY: { name: 'Guyana', currency: 'GYD', continent: 'sa', capital: 'Georgetown', population: 830000, language: 'Englisch', lat: 6.8, lng: -58.16 , emergency: 'Polizei 911 · Rettung 913 · Feuerwehr 912'},
  HN: { name: 'Honduras', currency: 'HNL', continent: 'na', capital: 'Tegucigalpa', population: 10600000, language: 'Spanisch', lat: 14.07, lng: -87.19 , emergency: 'Polizei 911 · Rettung 195 · Feuerwehr 198'},
  HR: { name: 'Kroatien', currency: 'EUR', continent: 'eu', capital: 'Zagreb', population: 3900000, language: 'Kroatisch', lat: 45.81, lng: 15.98 , emergency: '112'},
  HT: { name: 'Haiti', currency: 'HTG', continent: 'na', capital: 'Port-au-Prince', population: 11700000, language: 'Französisch, Haitianisch-Kreolisch', lat: 18.59, lng: -72.31 , emergency: 'Polizei 122 · Rettung 116 · Feuerwehr 115'},
  HU: { name: 'Ungarn', currency: 'HUF', continent: 'eu', capital: 'Budapest', population: 9600000, language: 'Ungarisch', lat: 47.5, lng: 19.04 , emergency: '112'},
  ID: { name: 'Indonesien', currency: 'IDR', continent: 'as', capital: 'Jakarta', population: 280000000, language: 'Indonesisch', lat: -6.21, lng: 106.85 , emergency: 'Polizei 110 · Rettung 118/119 · Feuerwehr 113 (auch 112)'},
  IE: { name: 'Irland', currency: 'EUR', continent: 'eu', capital: 'Dublin', population: 5200000, language: 'Englisch, Irisch', lat: 53.35, lng: -6.26 , emergency: '112 / 999'},
  IL: { name: 'Israel', currency: 'ILS', continent: 'as', capital: 'Jerusalem', population: 9800000, language: 'Hebräisch, Arabisch', lat: 31.77, lng: 35.21 , emergency: 'Polizei 100 · Rettung 101 · Feuerwehr 102 (Handy: 112)'},
  IM: { name: 'Isle of Man', currency: 'GBP', continent: 'eu', un: false , emergency: '112 / 999'},
  IN: { name: 'Indien', currency: 'INR', continent: 'as', capital: 'Neu-Delhi', population: 1440000000, language: 'Hindi, Englisch', lat: 28.61, lng: 77.21 , emergency: 'Polizei 100 · Rettung 108 · Feuerwehr 101 (auch 112)'},
  IQ: { name: 'Irak', currency: 'IQD', continent: 'as', capital: 'Bagdad', population: 45000000, language: 'Arabisch, Kurdisch', lat: 33.31, lng: 44.36 , emergency: 'Polizei 104 · Rettung 122 · Feuerwehr 115'},
  IR: { name: 'Iran', currency: 'IRR', continent: 'as', capital: 'Teheran', population: 89000000, language: 'Persisch', lat: 35.69, lng: 51.39 , emergency: 'Polizei 110 · Rettung 115 · Feuerwehr 125'},
  IS: { name: 'Island', currency: 'ISK', continent: 'eu', capital: 'Reykjavík', population: 390000, language: 'Isländisch', lat: 64.15, lng: -21.94 , emergency: '112'},
  IT: { name: 'Italien', currency: 'EUR', continent: 'eu', capital: 'Rom', population: 59000000, language: 'Italienisch', lat: 41.9, lng: 12.5 , emergency: '112'},
  JE: { name: 'Jersey', currency: 'GBP', continent: 'eu', un: false , emergency: '112 / 999'},
  JM: { name: 'Jamaika', currency: 'JMD', continent: 'na', capital: 'Kingston', population: 2800000, language: 'Englisch', lat: 17.97, lng: -76.79 , emergency: 'Polizei 119 · Rettung 110'},
  JO: { name: 'Jordanien', currency: 'JOD', continent: 'as', capital: 'Amman', population: 11300000, language: 'Arabisch', lat: 31.95, lng: 35.93 , emergency: '911 (Handy: 112)'},
  JP: { name: 'Japan', currency: 'JPY', continent: 'as', capital: 'Tokio', population: 124000000, language: 'Japanisch', lat: 35.68, lng: 139.65 , emergency: 'Polizei 110 · Rettung/Feuerwehr 119'},
  KE: { name: 'Kenia', currency: 'KES', continent: 'af', capital: 'Nairobi', population: 55000000, language: 'Englisch, Swahili', lat: -1.29, lng: 36.82 , emergency: '112 / 999'},
  KG: { name: 'Kirgisistan', currency: 'KGS', continent: 'as', capital: 'Bischkek', population: 7000000, language: 'Kirgisisch, Russisch', lat: 42.87, lng: 74.59 , emergency: '112'},
  KH: { name: 'Kambodscha', currency: 'KHR', continent: 'as', capital: 'Phnom Penh', population: 17000000, language: 'Khmer', lat: 11.56, lng: 104.92 , emergency: 'Polizei 117 · Rettung 119 · Feuerwehr 118'},
  KI: { name: 'Kiribati', currency: 'AUD', continent: 'oc', capital: 'Tarawa', population: 130000, language: 'Englisch, Gilbertesisch', lat: 1.33, lng: 173.02 , emergency: 'Polizei 192 · Rettung 194/195 · Feuerwehr 193'},
  KM: { name: 'Komoren', currency: 'KMF', continent: 'af', capital: 'Moroni', population: 870000, language: 'Komorisch, Arabisch, Französisch', lat: -11.7, lng: 43.26 , emergency: 'Polizei 17 · Feuerwehr 18'},
  KN: { name: 'St. Kitts und Nevis', currency: 'XCD', continent: 'na', capital: 'Basseterre', population: 47000, language: 'Englisch', lat: 17.3, lng: -62.73 , emergency: '911'},
  KP: { name: 'Nordkorea', currency: 'KPW', continent: 'as', capital: 'Pjöngjang', population: 26000000, language: 'Koreanisch', lat: 39.02, lng: 125.75 , emergency: '110 (nur lokal)'},
  KR: { name: 'Südkorea', currency: 'KRW', continent: 'as', capital: 'Seoul', population: 51700000, language: 'Koreanisch', lat: 37.57, lng: 126.98 , emergency: 'Polizei 112 · Rettung/Feuerwehr 119'},
  KW: { name: 'Kuwait', currency: 'KWD', continent: 'as', capital: 'Kuwait-Stadt', population: 4300000, language: 'Arabisch', lat: 29.38, lng: 47.98 , emergency: '112'},
  KY: { name: 'Kaimaninseln', currency: 'KYD', continent: 'na', un: false , emergency: '911'},
  KZ: { name: 'Kasachstan', currency: 'KZT', continent: 'as', capital: 'Astana', population: 20000000, language: 'Kasachisch, Russisch', lat: 51.18, lng: 71.45 , emergency: 'Polizei 102 · Rettung 103 · Feuerwehr 101'},
  LA: { name: 'Laos', currency: 'LAK', continent: 'as', capital: 'Vientiane', population: 7600000, language: 'Laotisch', lat: 17.97, lng: 102.63 , emergency: 'Polizei 191 · Rettung 195 · Feuerwehr 190'},
  LB: { name: 'Libanon', currency: 'LBP', continent: 'as', capital: 'Beirut', population: 5400000, language: 'Arabisch', lat: 33.89, lng: 35.5 , emergency: 'Polizei 999/112 · Rettung 140 · Feuerwehr 175'},
  LC: { name: 'St. Lucia', currency: 'XCD', continent: 'na', capital: 'Castries', population: 180000, language: 'Englisch', lat: 14.01, lng: -60.99 , emergency: '911 / 999'},
  LI: { name: 'Liechtenstein', currency: 'CHF', continent: 'eu', capital: 'Vaduz', population: 40000, language: 'Deutsch', lat: 47.14, lng: 9.52 , emergency: 'Polizei 117 · Rettung 144 · Feuerwehr 118'},
  LK: { name: 'Sri Lanka', currency: 'LKR', continent: 'as', capital: 'Colombo', population: 22000000, language: 'Singhalesisch, Tamilisch', lat: 6.93, lng: 79.85 , emergency: 'Polizei 119 · Rettung 110'},
  LR: { name: 'Liberia', currency: 'LRD', continent: 'af', capital: 'Monrovia', population: 5400000, language: 'Englisch', lat: 6.3, lng: -10.8 , emergency: '911'},
  LS: { name: 'Lesotho', currency: 'LSL', continent: 'af', capital: 'Maseru', population: 2300000, language: 'Sesotho, Englisch', lat: -29.31, lng: 27.48 , emergency: 'Polizei 123 · Rettung 121 · Feuerwehr 122'},
  LT: { name: 'Litauen', currency: 'EUR', continent: 'eu', capital: 'Vilnius', population: 2860000, language: 'Litauisch', lat: 54.69, lng: 25.28 , emergency: '112'},
  LU: { name: 'Luxemburg', currency: 'EUR', continent: 'eu', capital: 'Luxemburg', population: 670000, language: 'Luxemburgisch, Französisch, Deutsch', lat: 49.61, lng: 6.13 , emergency: 'Polizei 113 · Rettung/Feuerwehr 112'},
  LV: { name: 'Lettland', currency: 'EUR', continent: 'eu', capital: 'Riga', population: 1880000, language: 'Lettisch', lat: 56.95, lng: 24.11 , emergency: 'Polizei 110 · Rettung 113 · Feuerwehr 112'},
  LY: { name: 'Libyen', currency: 'LYD', continent: 'af', capital: 'Tripolis', population: 7000000, language: 'Arabisch', lat: 32.89, lng: 13.19 , emergency: 'Polizei 1515 · Rettung 193'},
  MA: { name: 'Marokko', currency: 'MAD', continent: 'af', capital: 'Rabat', population: 37800000, language: 'Arabisch, Berbersprachen', lat: 34.02, lng: -6.84 , emergency: 'Polizei 19 · Rettung 15 (Handy: 112)', embassyDe: { name: 'Deutsche Botschaft Rabat', address: '7, Zankat Madnine, Rabat (Postanschrift: B.P. 235, 10001 Rabat)', phone: '+212 537 21 86 00', note: 'Rechts-/Konsularabteilung: Rue Sanhaja, Souissi, Rabat, Tel. +212 537 63 54 00' }},
  MC: { name: 'Monaco', currency: 'EUR', continent: 'eu', capital: 'Monaco', population: 39000, language: 'Französisch', lat: 43.74, lng: 7.42 , emergency: 'Polizei 17 · Rettung/Feuerwehr 112'},
  MD: { name: 'Moldau', currency: 'MDL', continent: 'eu', capital: 'Chișinău', population: 2500000, language: 'Rumänisch', lat: 47.01, lng: 28.86 , emergency: '112'},
  ME: { name: 'Montenegro', currency: 'EUR', continent: 'eu', capital: 'Podgorica', population: 620000, language: 'Montenegrinisch', lat: 42.44, lng: 19.26 , emergency: '112'},
  MF: { name: 'Saint-Martin', currency: 'EUR', continent: 'na', un: false , emergency: 'Polizei 17 · Rettung 15 · Feuerwehr 18'},
  MG: { name: 'Madagaskar', currency: 'MGA', continent: 'af', capital: 'Antananarivo', population: 30000000, language: 'Malagasy, Französisch', lat: -18.88, lng: 47.51 , emergency: 'Polizei 117 · Rettung 124 · Feuerwehr 118'},
  MH: { name: 'Marshallinseln', currency: 'USD', continent: 'oc', capital: 'Majuro', population: 42000, language: 'Marshallesisch, Englisch', lat: 7.09, lng: 171.38 , emergency: '911'},
  MK: { name: 'Nordmazedonien', currency: 'MKD', continent: 'eu', capital: 'Skopje', population: 1830000, language: 'Mazedonisch', lat: 42, lng: 21.43 , emergency: '112'},
  ML: { name: 'Mali', currency: 'XOF', continent: 'af', capital: 'Bamako', population: 23000000, language: 'Französisch', lat: 12.65, lng: -8 , emergency: 'Polizei 17 · Rettung/Feuerwehr 112'},
  MM: { name: 'Myanmar', currency: 'MMK', continent: 'as', capital: 'Naypyidaw', population: 54000000, language: 'Birmanisch', lat: 19.76, lng: 96.08 , emergency: 'Polizei 199 · Rettung 192 · Feuerwehr 191 (auch 999)'},
  MN: { name: 'Mongolei', currency: 'MNT', continent: 'as', capital: 'Ulaanbaatar', population: 3400000, language: 'Mongolisch', lat: 47.89, lng: 106.91 , emergency: 'Polizei 102 · Rettung 103 · Feuerwehr 101'},
  MP: { name: 'Nördliche Marianen', currency: 'USD', continent: 'oc', un: false , emergency: '911'},
  MR: { name: 'Mauretanien', currency: 'MRU', continent: 'af', capital: 'Nouakchott', population: 4900000, language: 'Arabisch', lat: 18.09, lng: -15.98 , emergency: 'Polizei 117 · Rettung 101 · Feuerwehr 118', embassyDe: { name: 'Deutsche Botschaft Nouakchott', address: 'Av. Mamadou Lemine Konaté, Tevragh Zeina, Nouakchott (Postanschrift: B.P. 372)', phone: '+222 45 25 17 29', note: 'Notfall-/Bereitschaftsdienst außerhalb der Öffnungszeiten: +222 46 48 00 81' }},
  MS: { name: 'Montserrat', currency: 'XCD', continent: 'na', un: false , emergency: '911 / 999'},
  MT: { name: 'Malta', currency: 'EUR', continent: 'eu', capital: 'Valletta', population: 540000, language: 'Maltesisch, Englisch', lat: 35.9, lng: 14.51 , emergency: '112'},
  MU: { name: 'Mauritius', currency: 'MUR', continent: 'af', capital: 'Port Louis', population: 1270000, language: 'Englisch', lat: -20.16, lng: 57.5 , emergency: 'Polizei 999 · Rettung 114 · Feuerwehr 995 (Handy: 112)'},
  MV: { name: 'Maledive', currency: 'MVR', continent: 'as', capital: 'Malé', population: 520000, language: 'Dhivehi', lat: 4.18, lng: 73.51 , emergency: 'Polizei 119 · Rettung 100 · Feuerwehr 118 (auch 911)'},
  MW: { name: 'Malawi', currency: 'MWK', continent: 'af', capital: 'Lilongwe', population: 20400000, language: 'Englisch, Chichewa', lat: -13.96, lng: 33.79 , emergency: 'Polizei 990 · Rettung 998 · Feuerwehr 999'},
  MX: { name: 'Mexiko', currency: 'MXN', continent: 'na', capital: 'Mexiko-Stadt', population: 128000000, language: 'Spanisch', lat: 19.43, lng: -99.13 , emergency: '911'},
  MY: { name: 'Malaysia', currency: 'MYR', continent: 'as', capital: 'Kuala Lumpur', population: 34000000, language: 'Malaiisch', lat: 3.14, lng: 101.69 , emergency: '999 (Handy: 112)'},
  MZ: { name: 'Mosambik', currency: 'MZN', continent: 'af', capital: 'Maputo', population: 33000000, language: 'Portugiesisch', lat: -25.97, lng: 32.57 , emergency: 'Polizei 119 · Rettung 117 · Feuerwehr 198'},
  NA: { name: 'Namibia', currency: 'NAD', continent: 'af', capital: 'Windhoek', population: 2600000, language: 'Englisch', lat: -22.56, lng: 17.08 , emergency: '10111'},
  NC: { name: 'Neukaledonien', currency: 'XPF', continent: 'oc', un: false , emergency: 'Polizei 17 · Rettung 15 · Feuerwehr 18'},
  NE: { name: 'Niger', currency: 'XOF', continent: 'af', capital: 'Niamey', population: 26000000, language: 'Französisch', lat: 13.51, lng: 2.11 , emergency: 'Polizei 17 · Rettung 15 · Feuerwehr 18'},
  NF: { name: 'Norfolkinsel', currency: 'AUD', continent: 'oc', un: false },
  NG: { name: 'Nigeria', currency: 'NGN', continent: 'af', capital: 'Abuja', population: 224000000, language: 'Englisch', lat: 9.08, lng: 7.4 , emergency: '112'},
  NI: { name: 'Nicaragua', currency: 'NIO', continent: 'na', capital: 'Managua', population: 6900000, language: 'Spanisch', lat: 12.11, lng: -86.24 , emergency: 'Polizei 118 · Rettung 128 · Feuerwehr 115'},
  NL: { name: 'Niederlande', currency: 'EUR', continent: 'eu', capital: 'Amsterdam', population: 17900000, language: 'Niederländisch', lat: 52.37, lng: 4.9 , emergency: '112'},
  NO: { name: 'Norwegen', currency: 'NOK', continent: 'eu', capital: 'Oslo', population: 5500000, language: 'Norwegisch', lat: 59.91, lng: 10.75 , emergency: 'Polizei 112 · Rettung 113 · Feuerwehr 110'},
  NP: { name: 'Nepal', currency: 'NPR', continent: 'as', capital: 'Kathmandu', population: 30000000, language: 'Nepalesisch', lat: 27.72, lng: 85.32 , emergency: 'Polizei 100 · Rettung 102 · Feuerwehr 101 (Handy: 112)'},
  NR: { name: 'Nauru', currency: 'AUD', continent: 'oc', capital: 'Yaren', population: 12000, language: 'Nauruisch, Englisch', lat: -0.55, lng: 166.92 },
  NU: { name: 'Niue', currency: 'NZD', continent: 'oc', un: false },
  NZ: { name: 'Neuseeland', currency: 'NZD', continent: 'oc', capital: 'Wellington', population: 5200000, language: 'Englisch, Māori', lat: -41.29, lng: 174.78 , emergency: '111'},
  OM: { name: 'Oman', currency: 'OMR', continent: 'as', capital: 'Maskat', population: 4600000, language: 'Arabisch', lat: 23.59, lng: 58.41 , emergency: '9999 (Handy: 112)'},
  PA: { name: 'Panama', currency: 'PAB', continent: 'na', capital: 'Panama-Stadt', population: 4400000, language: 'Spanisch', lat: 8.98, lng: -79.52 , emergency: 'Polizei 104 · Rettung/Feuerwehr 911'},
  PE: { name: 'Peru', currency: 'PEN', continent: 'sa', capital: 'Lima', population: 34000000, language: 'Spanisch', lat: -12.05, lng: -77.04 , emergency: 'Polizei 105 · Rettung 106 · Feuerwehr 116 (auch 911)'},
  PF: { name: 'Französisch-Polynesien', currency: 'XPF', continent: 'oc', un: false , emergency: 'Polizei 17 · Rettung 15 · Feuerwehr 18'},
  PG: { name: 'Papua-Neuguinea', currency: 'PGK', continent: 'oc', capital: 'Port Moresby', population: 10300000, language: 'Englisch, Tok Pisin', lat: -9.48, lng: 147.15 },
  PH: { name: 'Philippinen', currency: 'PHP', continent: 'as', capital: 'Manila', population: 114000000, language: 'Filipino, Englisch', lat: 14.6, lng: 120.98 , emergency: '911 (Handy: 112)'},
  PK: { name: 'Pakistan', currency: 'PKR', continent: 'as', capital: 'Islamabad', population: 240000000, language: 'Urdu', lat: 33.72, lng: 73.04 , emergency: 'Polizei 15 · Rettung 1122 · Feuerwehr 16 (Handy: 112)'},
  PL: { name: 'Polen', currency: 'PLN', continent: 'eu', capital: 'Warschau', population: 37600000, language: 'Polnisch', lat: 52.23, lng: 21.01 , emergency: '112'},
  PM: { name: 'Saint-Pierre und Miquelon', currency: 'EUR', continent: 'na', un: false , emergency: 'Polizei 17 · Rettung 15 · Feuerwehr 18'},
  PN: { name: 'Pitcairninseln', currency: 'NZD', continent: 'oc', un: false },
  PR: { name: 'Puerto Rico', currency: 'USD', continent: 'na', un: false , emergency: '911'},
  PT: { name: 'Portugal', currency: 'EUR', continent: 'eu', capital: 'Lissabon', population: 10500000, language: 'Portugiesisch', lat: 38.72, lng: -9.14 , emergency: '112'},
  PW: { name: 'Palau', currency: 'USD', continent: 'oc', capital: 'Ngerulmud', population: 18000, language: 'Palauisch, Englisch', lat: 7.5, lng: 134.62 , emergency: '911'},
  PY: { name: 'Paraguay', currency: 'PYG', continent: 'sa', capital: 'Asunción', population: 6900000, language: 'Spanisch, Guaraní', lat: -25.3, lng: -57.64 , emergency: 'Polizei 912 · Rettung 141 · Feuerwehr 132 (auch 911)'},
  QA: { name: 'Katar', currency: 'QAR', continent: 'as', capital: 'Doha', population: 2700000, language: 'Arabisch', lat: 25.29, lng: 51.53 , emergency: '999 (Handy: 112)'},
  RO: { name: 'Rumänien', currency: 'RON', continent: 'eu', capital: 'Bukarest', population: 19000000, language: 'Rumänisch', lat: 44.43, lng: 26.1 , emergency: '112'},
  RS: { name: 'Serbien', currency: 'RSD', continent: 'eu', capital: 'Belgrad', population: 6600000, language: 'Serbisch', lat: 44.79, lng: 20.45 , emergency: '112'},
  RU: { name: 'Russland', currency: 'RUB', continent: 'eu', capital: 'Moskau', population: 144000000, language: 'Russisch', lat: 55.76, lng: 37.62 , emergency: '112'},
  RW: { name: 'Ruanda', currency: 'RWF', continent: 'af', capital: 'Kigali', population: 13900000, language: 'Kinyarwanda, Französisch, Englisch', lat: -1.94, lng: 30.06 , emergency: 'Polizei 112 · Rettung 912'},
  SA: { name: 'Saudi-Arabien', currency: 'SAR', continent: 'as', capital: 'Riad', population: 36000000, language: 'Arabisch', lat: 24.71, lng: 46.68 , emergency: 'Polizei 999 · Rettung 997 · Feuerwehr 998 (auch 911)'},
  SB: { name: 'Salomonen', currency: 'SBD', continent: 'oc', capital: 'Honiara', population: 740000, language: 'Englisch', lat: -9.43, lng: 159.95 , emergency: 'Polizei 999 · Rettung 111 · Feuerwehr 988'},
  SC: { name: 'Seychellen', currency: 'SCR', continent: 'af', capital: 'Victoria', population: 100000, language: 'Seychellenkreol, Englisch, Französisch', lat: -4.62, lng: 55.45 , emergency: 'Polizei 133 · Rettung 151 (auch 112/999)'},
  SD: { name: 'Sudan', currency: 'SDG', continent: 'af', capital: 'Khartum', population: 48000000, language: 'Arabisch', lat: 15.5, lng: 32.56 , emergency: '999'},
  SE: { name: 'Schweden', currency: 'SEK', continent: 'eu', capital: 'Stockholm', population: 10600000, language: 'Schwedisch', lat: 59.33, lng: 18.07 , emergency: '112'},
  SG: { name: 'Singapur', currency: 'SGD', continent: 'as', capital: 'Singapur', population: 5900000, language: 'Englisch, Malaiisch, Mandarin, Tamil', lat: 1.35, lng: 103.82 , emergency: 'Polizei 999 · Rettung/Feuerwehr 995'},
  SH: { name: 'St. Helena', currency: 'SHP', continent: 'af', un: false , emergency: '999'},
  SI: { name: 'Slowenien', currency: 'EUR', continent: 'eu', capital: 'Ljubljana', population: 2100000, language: 'Slowenisch', lat: 46.06, lng: 14.51 , emergency: 'Polizei 113 · Rettung/Feuerwehr 112'},
  SK: { name: 'Slowakei', currency: 'EUR', continent: 'eu', capital: 'Bratislava', population: 5400000, language: 'Slowakisch', lat: 48.15, lng: 17.11 , emergency: '112'},
  SL: { name: 'Sierra Leone', currency: 'SLE', continent: 'af', capital: 'Freetown', population: 8600000, language: 'Englisch', lat: 8.48, lng: -13.23 , emergency: 'Polizei 019 · Rettung 999'},
  SM: { name: 'San Marino', currency: 'EUR', continent: 'eu', capital: 'San Marino', population: 34000, language: 'Italienisch', lat: 43.94, lng: 12.46 , emergency: 'Polizei 112/113 · Rettung 118 · Feuerwehr 115'},
  SN: { name: 'Senegal', currency: 'XOF', continent: 'af', capital: 'Dakar', population: 18000000, language: 'Französisch', lat: 14.69, lng: -17.44 , emergency: 'Polizei 17 · Rettung 18 · Feuerwehr 1515'},
  SO: { name: 'Somalia', currency: 'SOS', continent: 'af', capital: 'Mogadischu', population: 18100000, language: 'Somali, Arabisch', lat: 2.04, lng: 45.34 , emergency: 'Polizei 888 · Rettung 999 · Feuerwehr 555'},
  SR: { name: 'Suriname', currency: 'SRD', continent: 'sa', capital: 'Paramaribo', population: 620000, language: 'Niederländisch', lat: 5.87, lng: -55.17 , emergency: 'Polizei 115 · Rettung 113 · Feuerwehr 110'},
  SS: { name: 'Südsudan', currency: 'SSP', continent: 'af', capital: 'Juba', population: 11000000, language: 'Englisch', lat: 4.85, lng: 31.58 , emergency: '999'},
  ST: { name: 'São Tomé und Príncipe', currency: 'STN', continent: 'af', capital: 'São Tomé', population: 230000, language: 'Portugiesisch', lat: 0.33, lng: 6.73 , emergency: '112'},
  SV: { name: 'El Salvador', currency: 'USD', continent: 'na', capital: 'San Salvador', population: 6300000, language: 'Spanisch', lat: 13.69, lng: -89.22 , emergency: 'Polizei 911 · Rettung 132 · Feuerwehr 913'},
  SX: { name: 'Sint Maarten', currency: 'ANG', continent: 'na', un: false , emergency: 'Polizei 911 · Rettung 912 · Feuerwehr 919'},
  SY: { name: 'Syrien', currency: 'SYP', continent: 'as', capital: 'Damaskus', population: 23000000, language: 'Arabisch', lat: 33.51, lng: 36.28 , emergency: 'Polizei 112 · Rettung 110 · Feuerwehr 113'},
  SZ: { name: 'Eswatini', currency: 'SZL', continent: 'af', capital: 'Mbabane', population: 1200000, language: 'Siswati, Englisch', lat: -26.32, lng: 31.14 , emergency: 'Polizei 999 · Rettung 977 · Feuerwehr 933'},
  TC: { name: 'Turks- und Caicosinseln', currency: 'USD', continent: 'na', un: false , emergency: '911'},
  TD: { name: 'Tschad', currency: 'XAF', continent: 'af', capital: 'N\'Djamena', population: 18000000, language: 'Französisch, Arabisch', lat: 12.13, lng: 15.06 , emergency: 'Polizei 17 · Feuerwehr 18'},
  TF: { name: 'Französische Süd- und Antarktisgebiete', currency: 'EUR', continent: 'af', un: false },
  TG: { name: 'Togo', currency: 'XOF', continent: 'af', capital: 'Lomé', population: 9000000, language: 'Französisch', lat: 6.17, lng: 1.23 , emergency: 'Polizei 117 · Rettung 8200 · Feuerwehr 118'},
  TH: { name: 'Thailand', currency: 'THB', continent: 'as', capital: 'Bangkok', population: 71600000, language: 'Thai', lat: 13.75, lng: 100.5 , emergency: 'Polizei 191 · Rettung 1669 · Feuerwehr 199 (Handy: 112)'},
  TJ: { name: 'Tadschikistan', currency: 'TJS', continent: 'as', capital: 'Duschanbe', population: 10100000, language: 'Tadschikisch', lat: 38.56, lng: 68.79 , emergency: 'Polizei 102 · Rettung 103 · Feuerwehr 101'},
  TK: { name: 'Tokelau', currency: 'NZD', continent: 'oc', un: false },
  TL: { name: 'Timor-Leste', currency: 'USD', continent: 'as', capital: 'Dili', population: 1400000, language: 'Tetum, Portugiesisch', lat: -8.56, lng: 125.57 , emergency: '112'},
  TM: { name: 'Turkmenistan', currency: 'TMT', continent: 'as', capital: 'Aşgabat', population: 6400000, language: 'Turkmenisch', lat: 37.95, lng: 58.38 , emergency: 'Polizei 02 · Rettung 03 · Feuerwehr 01'},
  TN: { name: 'Tunesien', currency: 'TND', continent: 'af', capital: 'Tunis', population: 12300000, language: 'Arabisch', lat: 36.81, lng: 10.18 , emergency: 'Polizei 197 · Rettung 190 · Feuerwehr 198'},
  TO: { name: 'Tonga', currency: 'TOP', continent: 'oc', capital: 'Nukuʻalofa', population: 104000, language: 'Tongaisch, Englisch', lat: -21.14, lng: -175.2 , emergency: 'Polizei 922 · Rettung 933 · Feuerwehr 999'},
  TR: { name: 'Türkei', currency: 'TRY', continent: 'as', capital: 'Ankara', population: 85600000, language: 'Türkisch', lat: 39.93, lng: 32.86 , emergency: '112'},
  TT: { name: 'Trinidad und Tobago', currency: 'TTD', continent: 'na', capital: 'Port of Spain', population: 1500000, language: 'Englisch', lat: 10.65, lng: -61.52 , emergency: 'Polizei 999/911 · Rettung 811 · Feuerwehr 990'},
  TV: { name: 'Tuvalu', currency: 'AUD', continent: 'oc', capital: 'Funafuti', population: 11000, language: 'Tuvaluisch, Englisch', lat: -8.52, lng: 179.2 , emergency: 'Polizei 911 · Rettung 999 · Feuerwehr 000'},
  TZ: { name: 'Tansania', currency: 'TZS', continent: 'af', capital: 'Dodoma', population: 67000000, language: 'Swahili, Englisch', lat: -6.17, lng: 35.74 , emergency: 'Polizei 999 · Rettung 115 · Feuerwehr 114 (Handy: 112)'},
  UA: { name: 'Ukraine', currency: 'UAH', continent: 'eu', capital: 'Kiew', population: 37000000, language: 'Ukrainisch', lat: 50.45, lng: 30.52 , emergency: '112'},
  UG: { name: 'Uganda', currency: 'UGX', continent: 'af', capital: 'Kampala', population: 48000000, language: 'Englisch, Swahili', lat: 0.35, lng: 32.58 , emergency: 'Polizei 999 · Rettung 911 (Handy: 112)'},
  US: { name: 'Vereinigte Staaten', currency: 'USD', continent: 'na', capital: 'Washington, D.C.', population: 335000000, language: 'Englisch', lat: 38.9, lng: -77.04 , emergency: '911'},
  UY: { name: 'Uruguay', currency: 'UYU', continent: 'sa', capital: 'Montevideo', population: 3400000, language: 'Spanisch', lat: -34.9, lng: -56.16 , emergency: 'Polizei 109 · Rettung 105 · Feuerwehr 104 (auch 911)'},
  UZ: { name: 'Usbekistan', currency: 'UZS', continent: 'as', capital: 'Taschkent', population: 36000000, language: 'Usbekisch', lat: 41.3, lng: 69.24 , emergency: 'Polizei 102 · Rettung 103 · Feuerwehr 101'},
  VA: { name: 'Vatikanstadt', currency: 'EUR', continent: 'eu', capital: 'Vatikanstadt', population: 800, language: 'Latein, Italienisch', lat: 41.9, lng: 12.45 , emergency: '112'},
  VC: { name: 'St. Vincent und die Grenadinen', currency: 'XCD', continent: 'na', capital: 'Kingstown', population: 104000, language: 'Englisch', lat: 13.16, lng: -61.22 , emergency: '999 / 911 / 112'},
  VE: { name: 'Venezuela', currency: 'VES', continent: 'sa', capital: 'Caracas', population: 28000000, language: 'Spanisch', lat: 10.49, lng: -66.88 , emergency: '911'},
  VG: { name: 'Britische Jungferninseln', currency: 'USD', continent: 'na', un: false , emergency: 'Polizei 311 · Rettung/Feuerwehr 911/999'},
  VI: { name: 'Amerikanische Jungferninseln', currency: 'USD', continent: 'na', un: false , emergency: '911'},
  VN: { name: 'Vietnam', currency: 'VND', continent: 'as', capital: 'Hanoi', population: 100000000, language: 'Vietnamesisch', lat: 21.03, lng: 105.85 , emergency: 'Polizei 113 · Rettung 115 · Feuerwehr 114'},
  VU: { name: 'Vanuatu', currency: 'VUV', continent: 'oc', capital: 'Port Vila', population: 330000, language: 'Bislama, Englisch, Französisch', lat: -17.73, lng: 168.32 },
  WF: { name: 'Wallis und Futuna', currency: 'XPF', continent: 'oc', un: false , emergency: '15'},
  WS: { name: 'Samoa', currency: 'WST', continent: 'oc', capital: 'Apia', population: 220000, language: 'Samoanisch, Englisch', lat: -13.83, lng: -171.76 , emergency: 'Polizei 995 · Rettung 996 · Feuerwehr 994'},
  XK: { name: 'Kosovo', currency: 'EUR', continent: 'eu', un: false, capital: 'Pristina', population: 1600000, language: 'Albanisch, Serbisch', lat: 42.67, lng: 21.17 , emergency: 'Polizei 192 · Rettung 194 · Feuerwehr 193'},
  YE: { name: 'Jemen', currency: 'YER', continent: 'as', capital: 'Sanaa', population: 34000000, language: 'Arabisch', lat: 15.37, lng: 44.19 , emergency: 'Polizei 194 · Rettung 191'},
  ZA: { name: 'Südafrika', currency: 'ZAR', continent: 'af', capital: 'Pretoria', population: 63000000, language: 'Zulu, Xhosa, Englisch, Afrikaans u.a. (11 Amtssprachen)', lat: -25.75, lng: 28.19 , emergency: 'Polizei 10111 · Rettung 10177 (Handy: 112)'},
  ZM: { name: 'Sambia', currency: 'ZMW', continent: 'af', capital: 'Lusaka', population: 20500000, language: 'Englisch', lat: -15.39, lng: 28.32 , emergency: 'Polizei 911 · Rettung 992 · Feuerwehr 993 (Handy: 112)'},
  ZW: { name: 'Simbabwe', currency: 'ZWL', continent: 'af', capital: 'Harare', population: 16300000, language: 'Englisch, Shona, Ndebele', lat: -17.83, lng: 31.05 , emergency: 'Polizei 995 · Rettung 994 · Feuerwehr 993 (auch 999/112)'},
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
  emergency(code) {
    const c = COUNTRIES[code];
    return (c && c.emergency) || null;
  },
  embassyDe(code) {
    const c = COUNTRIES[code];
    return (c && c.embassyDe) || null;
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
