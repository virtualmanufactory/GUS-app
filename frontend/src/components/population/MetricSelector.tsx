import { useTranslation } from 'react-i18next';
import { POPULATION_METRICS } from '../../constants/population';

interface Props {
  selectedMetricId: string;
  onChange: (metricId: string) => void;
}

export default function MetricSelector({ selectedMetricId, onChange }: Props) {
  const { t } = useTranslation();

  const groups = [
    { key: 'basic', labelKey: 'population.metricGroups.basic' },
    { key: 'age', labelKey: 'population.metricGroups.age' },
    { key: 'economic', labelKey: 'population.metricGroups.economic' },
  ] as const;

  return (
    <div className="metric-selector">
      <label htmlFor="metric-select">{t('population.mapMetricLabel')}</label>
      <select
        id="metric-select"
        value={selectedMetricId}
        onChange={(e) => onChange(e.target.value)}
      >
        {groups.map((group) => (
          <optgroup key={group.key} label={t(group.labelKey)}>
            {POPULATION_METRICS.filter((metric) => metric.group === group.key).map((metric) => (
              <option key={metric.id} value={metric.id}>
                {t(`population.metrics.${metric.id}`)}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
