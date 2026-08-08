import { POPULATION_METRICS } from '../../constants/population';

interface Props {
  selectedMetricId: string;
  onChange: (metricId: string) => void;
}

export default function MetricSelector({ selectedMetricId, onChange }: Props) {
  const groups = [
    { key: 'basic', label: 'Podstawowe' },
    { key: 'age', label: 'Wiek' },
    { key: 'economic', label: 'Grupy wiekowe ekonomiczne' },
  ] as const;

  return (
    <div className="metric-selector">
      <label htmlFor="metric-select">Wskaźnik na mapie</label>
      <select
        id="metric-select"
        value={selectedMetricId}
        onChange={(e) => onChange(e.target.value)}
      >
        {groups.map((group) => (
          <optgroup key={group.key} label={group.label}>
            {POPULATION_METRICS.filter((metric) => metric.group === group.key).map((metric) => (
              <option key={metric.id} value={metric.id}>
                {metric.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
