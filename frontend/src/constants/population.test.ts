import { describe, expect, it } from 'vitest';
import {
  findVoivodeshipByGeoName,
  formatPopulation,
  normalizeName,
  POLAND_BDL_ID,
  POPULATION_UNIT_IDS,
  VOIVODESHIPS,
} from '../constants/population';

describe('normalizeName', () => {
  it('removes diacritics and lowercases', () => {
    expect(normalizeName('Mazowieckie')).toBe('mazowieckie');
    expect(normalizeName('MAZOWIECKIE')).toBe('mazowieckie');
  });
});

describe('findVoivodeshipByGeoName', () => {
  it('finds voivodeship by geo name', () => {
    const result = findVoivodeshipByGeoName('Mazowieckie');
    expect(result?.bdlId).toBe('071400000000');
  });

  it('finds voivodeship by official name', () => {
    const result = findVoivodeshipByGeoName('MAZOWIECKIE');
    expect(result?.name).toBe('MAZOWIECKIE');
  });

  it('returns undefined for unknown name', () => {
    expect(findVoivodeshipByGeoName('Unknown')).toBeUndefined();
  });
});

describe('formatPopulation', () => {
  it('formats millions in Polish locale style', () => {
    expect(formatPopulation(5_130_000)).toBe('5,13 mln');
  });

  it('formats thousands in English', () => {
    expect(formatPopulation(250_000, 'en')).toBe('250 k');
  });

  it('formats thousands in Polish', () => {
    expect(formatPopulation(250_000, 'pl')).toBe('250 tys.');
  });

  it('returns dash for null', () => {
    expect(formatPopulation(null)).toBe('—');
  });
});

describe('VOIVODESHIPS', () => {
  it('contains 16 Polish voivodeships', () => {
    expect(VOIVODESHIPS).toHaveLength(16);
  });

  it('has unique BDL ids', () => {
    const ids = VOIVODESHIPS.map((v) => v.bdlId);
    expect(new Set(ids).size).toBe(16);
  });
});

describe('POPULATION_UNIT_IDS', () => {
  it('includes Poland and all voivodeships', () => {
    expect(POPULATION_UNIT_IDS).toHaveLength(17);
    expect(POPULATION_UNIT_IDS[0]).toBe(POLAND_BDL_ID);
  });
});
