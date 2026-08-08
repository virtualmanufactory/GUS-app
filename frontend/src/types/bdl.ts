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

export interface DataValue {
  year: string;
  val: number | null;
  attrId: number;
}

export interface DataResult {
  id: string;
  name: string;
  values: DataValue[];
}

export interface DataByVariable {
  totalRecords: number;
  variableId: number;
  measureUnitId: number;
  results: DataResult[];
}

export interface DictionaryItem {
  id: number | string;
  name: string;
  description?: string;
}

export interface PopulationMetric {
  id: string;
  label: string;
  variableId: number;
  group?: 'basic' | 'age' | 'economic';
}
