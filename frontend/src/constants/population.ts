export interface Voivodeship {
  bdlId: string;
  nameKey: string;
  name: string;
  geoName: string;
  color: string;
}

export const POLAND_BDL_ID = '000000000000';

export const VOIVODESHIPS: Voivodeship[] = [
  { bdlId: '030200000000', nameKey: 'dolnoslaskie', name: 'DOLNOŚLĄSKIE', geoName: 'Dolnoslaskie', color: '#7c6bf0' },
  { bdlId: '040400000000', nameKey: 'kujawskoPomorskie', name: 'KUJAWSKO-POMORSKIE', geoName: 'Kujawsko-Pomorskie', color: '#4a90d9' },
  { bdlId: '060600000000', nameKey: 'lubelskie', name: 'LUBELSKIE', geoName: 'Lubelskie', color: '#f5a623' },
  { bdlId: '020800000000', nameKey: 'lubuskie', name: 'LUBUSKIE', geoName: 'Lubuskie', color: '#50e3c2' },
  { bdlId: '051000000000', nameKey: 'lodzkie', name: 'ŁÓDZKIE', geoName: 'Lódzkie', color: '#b8e986' },
  { bdlId: '071400000000', nameKey: 'mazowieckie', name: 'MAZOWIECKIE', geoName: 'Mazowieckie', color: '#bd10e0' },
  { bdlId: '011200000000', nameKey: 'malopolskie', name: 'MAŁOPOLSKIE', geoName: 'Malopolskie', color: '#417505' },
  { bdlId: '031600000000', nameKey: 'opolskie', name: 'OPOLSKIE', geoName: 'Opolskie', color: '#d0021b' },
  { bdlId: '061800000000', nameKey: 'podkarpackie', name: 'PODKARPACKIE', geoName: 'Podkarpackie', color: '#f8e71c' },
  { bdlId: '062000000000', nameKey: 'podlaskie', name: 'PODLASKIE', geoName: 'Podlaskie', color: '#8b572a' },
  { bdlId: '042200000000', nameKey: 'pomorskie', name: 'POMORSKIE', geoName: 'Pomorskie', color: '#9013fe' },
  { bdlId: '012400000000', nameKey: 'slaskie', name: 'ŚLĄSKIE', geoName: 'Slaskie', color: '#4a4a4a' },
  { bdlId: '052600000000', nameKey: 'swietokrzyskie', name: 'ŚWIĘTOKRZYSKIE', geoName: 'Swietokrzyskie', color: '#00d775' },
  { bdlId: '042800000000', nameKey: 'warminskoMazurskie', name: 'WARMIŃSKO-MAZURSKIE', geoName: 'Warminsko-Mazurskie', color: '#ff6b6b' },
  { bdlId: '023000000000', nameKey: 'wielkopolskie', name: 'WIELKOPOLSKIE', geoName: 'Wielkopolskie', color: '#6a5acd' },
  { bdlId: '023200000000', nameKey: 'zachodniopomorskie', name: 'ZACHODNIOPOMORSKIE', geoName: 'Zachodniopomorskie', color: '#20b2aa' },
];

export const POPULATION_YEARS = Array.from({ length: 17 }, (_, i) => 2002 + i);

export const POPULATION_METRICS = [
  { id: 'total', variableId: 60641, group: 'basic' as const },
  { id: 'males', variableId: 60614, group: 'basic' as const },
  { id: 'females', variableId: 60606, group: 'basic' as const },
  { id: 'age0', variableId: 71, group: 'age' as const },
  { id: 'age1', variableId: 72, group: 'age' as const },
  { id: 'age2', variableId: 73, group: 'age' as const },
  { id: 'age3', variableId: 74, group: 'age' as const },
  { id: 'age4', variableId: 75, group: 'age' as const },
  { id: 'preWorking', variableId: 149, group: 'economic' as const },
  { id: 'working', variableId: 152, group: 'economic' as const },
  { id: 'postWorking', variableId: 155, group: 'economic' as const },
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

export function formatPopulation(value: number | null | undefined, locale = 'pl'): string {
  if (value == null) return '—';
  if (value >= 1_000_000) {
    const num = (value / 1_000_000).toFixed(2);
    const formatted = locale === 'en' ? num : num.replace('.', ',');
    return `${formatted} mln`;
  }
  if (value >= 1_000) {
    const thousands = locale === 'en' ? 'k' : 'tys.';
    return `${(value / 1_000).toFixed(0)} ${thousands}`;
  }
  return value.toLocaleString(locale === 'en' ? 'en-US' : 'pl-PL');
}
