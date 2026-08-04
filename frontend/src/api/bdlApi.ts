import type {
  DataByVariable,
  DictionaryItem,
  PageResponse,
  Subject,
  Unit,
  Variable,
} from '../types/bdl';

const API_BASE = '/api';

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || error.title || 'Błąd pobierania danych');
  }
  return response.json();
}

export const bdlApi = {
  getSubjects(parentId?: string, page = 0): Promise<PageResponse<Subject>> {
    const params = new URLSearchParams({ page: String(page) });
    if (parentId) params.set('parentId', parentId);
    return fetchJson(`${API_BASE}/subjects?${params}`);
  },

  getSubject(id: string): Promise<Subject> {
    return fetchJson(`${API_BASE}/subjects/${id}`);
  },

  getVariables(subjectId?: string, search?: string, page = 0): Promise<PageResponse<Variable>> {
    const params = new URLSearchParams({ page: String(page) });
    if (subjectId) params.set('subjectId', subjectId);
    if (search) params.set('search', search);
    return fetchJson(`${API_BASE}/variables?${params}`);
  },

  getVariable(id: number): Promise<Variable> {
    return fetchJson(`${API_BASE}/variables/${id}`);
  },

  getUnits(parentId?: string, search?: string, page = 0): Promise<PageResponse<Unit>> {
    const params = new URLSearchParams({ page: String(page) });
    if (parentId) params.set('parentId', parentId);
    if (search) params.set('search', search);
    return fetchJson(`${API_BASE}/units?${params}`);
  },

  getUnit(id: string): Promise<Unit> {
    return fetchJson(`${API_BASE}/units/${id}`);
  },

  getDataByVariable(
    variableId: number,
    years?: number[],
    unitIds?: string[],
  ): Promise<DataByVariable> {
    const params = new URLSearchParams();
    years?.forEach((y) => params.append('year', String(y)));
    unitIds?.forEach((id) => params.append('unitId', id));
    const query = params.toString();
    return fetchJson(`${API_BASE}/data/by-variable/${variableId}${query ? `?${query}` : ''}`);
  },

  getAggregates(): Promise<DictionaryItem[]> {
    return fetchJson(`${API_BASE}/dictionaries/aggregates`);
  },

  getYears(): Promise<DictionaryItem[]> {
    return fetchJson(`${API_BASE}/dictionaries/years`);
  },

  getLevels(): Promise<DictionaryItem[]> {
    return fetchJson(`${API_BASE}/dictionaries/levels`);
  },
};
