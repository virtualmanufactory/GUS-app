export interface Voivodeship {
  bdlId: string;
  name: string;
  geoName: string;
  color: string;
}

export const POLAND_BDL_ID = '000000000000';

export const VOIVODESHIPS: Voivodeship[] = [
  { bdlId: '030200000000', name: 'DOLNOŚLĄSKIE', geoName: 'Dolnoslaskie', color: '#7c6bf0' },
  { bdlId: '040400000000', name: 'KUJAWSKO-POMORSKIE', geoName: 'Kujawsko-Pomorskie', color: '#4a90d9' },
  { bdlId: '060600000000', name: 'LUBELSKIE', geoName: 'Lubelskie', color: '#f5a623' },
  { bdlId: '020800000000', name: 'LUBUSKIE', geoName: 'Lubuskie', color: '#50e3c2' },
  { bdlId: '051000000000', name: 'ŁÓDZKIE', geoName: 'Lódzkie', color: '#b8e986' },
  { bdlId: '071400000000', name: 'MAZOWIECKIE', geoName: 'Mazowieckie', color: '#bd10e0' },
  { bdlId: '011200000000', name: 'MAŁOPOLSKIE', geoName: 'Malopolskie', color: '#417505' },
  { bdlId: '031600000000', name: 'OPOLSKIE', geoName: 'Opolskie', color: '#d0021b' },
  { bdlId: '061800000000', name: 'PODKARPACKIE', geoName: 'Podkarpackie', color: '#f8e71c' },
  { bdlId: '062000000000', name: 'PODLASKIE', geoName: 'Podlaskie', color: '#8b572a' },
  { bdlId: '042200000000', name: 'POMORSKIE', geoName: 'Pomorskie', color: '#9013fe' },
  { bdlId: '012400000000', name: 'ŚLĄSKIE', geoName: 'Slaskie', color: '#4a4a4a' },
  { bdlId: '052600000000', name: 'ŚWIĘTOKRZYSKIE', geoName: 'Swietokrzyskie', color: '#00d775' },
  { bdlId: '042800000000', name: 'WARMIŃSKO-MAZURSKIE', geoName: 'Warminsko-Mazurskie', color: '#ff6b6b' },
  { bdlId: '023000000000', name: 'WIELKOPOLSKIE', geoName: 'Wielkopolskie', color: '#6a5acd' },
  { bdlId: '023200000000', name: 'ZACHODNIOPOMORSKIE', geoName: 'Zachodniopomorskie', color: '#20b2aa' },
];

export const POPULATION_YEARS = Array.from({ length: 17 }, (_, i) => 2002 + i);

export const POPULATION_METRICS = [
  { id: 'total', label: 'Populacja ogółem', variableId: 60641, group: 'basic' as const },
  { id: 'males', label: 'Mężczyźni', variableId: 60614, group: 'basic' as const },
  { id: 'females', label: 'Kobiety', variableId: 60606, group: 'basic' as const },
  { id: 'age0', label: 'Wiek 0 lat', variableId: 71, group: 'age' as const },
  { id: 'age1', label: 'Wiek 1 rok', variableId: 72, group: 'age' as const },
  { id: 'age2', label: 'Wiek 2 lata', variableId: 73, group: 'age' as const },
  { id: 'age3', label: 'Wiek 3 lata', variableId: 74, group: 'age' as const },
  { id: 'age4', label: 'Wiek 4 lata', variableId: 75, group: 'age' as const },
  { id: 'preWorking', label: 'Wiek przedprodukcyjny', variableId: 149, group: 'economic' as const },
  { id: 'working', label: 'Wiek produkcyjny', variableId: 152, group: 'economic' as const },
  { id: 'postWorking', label: 'Wiek poprodukcyjny', variableId: 155, group: 'economic' as const },
];

export const AGE_0_4_VARIABLES = [71, 72, 73, 74, 75];

export function normalizeName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

export function findVoivodeshipByGeoName(geoName: string): Voivodeship | undefined {
  const normalized = normalizeName(geoName);
  return VOIVODESHIPS.find((v) => normalizeName(v.geoName) === normalized || normalizeName(v.name) === normalized);
}

export function formatPopulation(value: number | null | undefined): string {
  if (value == null) return '—';
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2).replace('.', ',')} mln`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)} tys.`;
  return String(value);
}
