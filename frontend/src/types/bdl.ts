export interface PageResponse<T> {
  totalRecords: number;
  page: number;
  pageSize: number;
  links?: Record<string, string>;
  results: T[];
}

export interface Subject {
  id: string;
  name: string;
  hasVariables: boolean;
  children?: string[];
  levels?: number[];
  parentId?: string;
}

export interface Variable {
  id: number;
  name: string;
  subjectId: string;
  level: number;
  measureUnitId?: string;
  years?: number[];
}

export interface Unit {
  id: string;
  name: string;
  parentId?: string;
  level: number;
  children?: string[];
}

export interface DataByVariable {
  id: number;
  measureUnitId?: string;
  measureUnitName?: string;
  years?: number[];
  values: Record<string, [number | null, number, number][]>;
}

export interface DictionaryItem {
  id: number | string;
  name: string;
  description?: string;
}
