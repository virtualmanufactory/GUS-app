import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { bdlApi } from '../api/bdlApi';
import {
  EMPLOYMENT_SECTIONS,
  EMPLOYMENT_VARIABLE_IDS,
} from '../constants/employment';

export interface IndustryEmployment {
  section: string;
  nameKey: string;
  variableId: number;
  employed: number | null;
  share: number | null;
}

export interface EmploymentSummary {
  unitId: string;
  unitName: string;
  year: number;
  totalEmployed: number;
  industries: IndustryEmployment[];
}

export function useEmploymentData(unitId: string, year: number) {
  const { t } = useTranslation();
  const [data, setData] = useState<EmploymentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bdlApi.getDataByUnit(unitId, EMPLOYMENT_VARIABLE_IDS, [year]);

      const byVariableId = new Map(
        response.results.map((result) => [result.id, result.values[0]?.val ?? null]),
      );

      const industries: IndustryEmployment[] = EMPLOYMENT_SECTIONS.map((section) => ({
        section: section.section,
        nameKey: section.nameKey,
        variableId: section.variableId,
        employed: byVariableId.get(section.variableId) ?? null,
        share: null,
      })).filter((item) => item.employed != null && item.employed > 0);

      const totalEmployed = industries.reduce((sum, item) => sum + (item.employed ?? 0), 0);

      industries.forEach((item) => {
        item.share = totalEmployed > 0 ? ((item.employed ?? 0) / totalEmployed) * 100 : null;
      });

      industries.sort((a, b) => (b.employed ?? 0) - (a.employed ?? 0));

      setData({
        unitId: response.unitId,
        unitName: response.unitName,
        year,
        totalEmployed,
        industries,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : t('employment.loadError'));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [unitId, year, t]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}
