import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  bdlApi,
  extractUnitSeries,
  extractUnitValue,
} from '../api/bdlApi';
import type { DataByVariable } from '../types/bdl';

const sampleData: DataByVariable = {
  totalRecords: 2,
  variableId: 60641,
  measureUnitId: 26,
  results: [
    {
      id: '000000000000',
      name: 'POLAND',
      values: [
        { year: '2017', val: 38000000, attrId: 1 },
        { year: '2018', val: 38411148, attrId: 1 },
      ],
    },
    {
      id: '071400000000',
      name: 'MAZOWIECKIE',
      values: [{ year: '2018', val: 5425000, attrId: 1 }],
    },
  ],
};

describe('extractUnitValue', () => {
  it('returns value for existing unit and year', () => {
    expect(extractUnitValue(sampleData, '071400000000', 2018)).toBe(5425000);
  });

  it('returns null for missing unit', () => {
    expect(extractUnitValue(sampleData, '999999999999', 2018)).toBeNull();
  });

  it('returns null for missing year', () => {
    expect(extractUnitValue(sampleData, '071400000000', 2010)).toBeNull();
  });
});

describe('extractUnitSeries', () => {
  it('builds series for selected years', () => {
    expect(extractUnitSeries(sampleData, '000000000000', [2017, 2018, 2019])).toEqual({
      2017: 38000000,
      2018: 38411148,
      2019: null,
    });
  });
});

describe('bdlApi', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('getSubjects calls API with page param', async () => {
    const mockResponse = {
      totalRecords: 1,
      page: 0,
      pageSize: 20,
      results: [{ id: 'K3', name: 'POPULATION', hasVariables: false }],
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await bdlApi.getSubjects(undefined, 0);

    expect(fetch).toHaveBeenCalledWith('/api/subjects?page=0');
    expect(result.results[0].id).toBe('K3');
  });

  it('getDataByVariable appends year and unitId params', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => sampleData,
    } as Response);

    await bdlApi.getDataByVariable(60641, [2017, 2018], ['071400000000', '011200000000']);

    expect(fetch).toHaveBeenCalledWith(
      '/api/data/by-variable/60641?year=2017&year=2018&unitId=071400000000&unitId=011200000000',
    );
  });

  it('getDataByUnit appends varId and year params', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        totalRecords: 1,
        unitId: '071400000000',
        unitName: 'MAZOWIECKIE',
        results: [],
      }),
    } as Response);

    await bdlApi.getDataByUnit('071400000000', [155530, 155654], [2022]);

    expect(fetch).toHaveBeenCalledWith(
      '/api/data/by-unit/071400000000?varId=155530&varId=155654&year=2022',
    );
  });

  it('throws error when response is not ok', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      statusText: 'Bad Gateway',
      json: async () => ({ title: 'Błąd API BDL', detail: 'Serwer niedostępny' }),
    } as Response);

    await expect(bdlApi.getSubjects()).rejects.toThrow('Serwer niedostępny');
  });
});
