import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { bdlApi } from '../api/bdlApi';
import {
  AGE_0_4_VARIABLES,
  POPULATION_METRICS,
  POPULATION_UNIT_IDS,
  POPULATION_YEARS,
} from '../constants/population';
import type { DataByVariable } from '../types/bdl';

export interface PopulationDataCache {
  metrics: Record<number, DataByVariable>;
  age0to4: Record<number, DataByVariable>;
}

export function usePopulationData() {
  const { t } = useTranslation();
  const [data, setData] = useState<PopulationDataCache | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const metricRequests = POPULATION_METRICS.map((metric) =>
        bdlApi.getDataByVariable(metric.variableId, POPULATION_YEARS, POPULATION_UNIT_IDS),
      );
      const ageRequests = AGE_0_4_VARIABLES.map((variableId) =>
        bdlApi.getDataByVariable(variableId, POPULATION_YEARS, POPULATION_UNIT_IDS),
      );

      const [metricResults, ageResults] = await Promise.all([
        Promise.all(metricRequests),
        Promise.all(ageRequests),
      ]);

      const metrics: Record<number, DataByVariable> = {};
      POPULATION_METRICS.forEach((metric, index) => {
        metrics[metric.variableId] = metricResults[index];
      });

      const age0to4: Record<number, DataByVariable> = {};
      AGE_0_4_VARIABLES.forEach((variableId, index) => {
        age0to4[variableId] = ageResults[index];
      });

      setData({ metrics, age0to4 });
    } catch (e) {
      setError(e instanceof Error ? e.message : t('population.loadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}
