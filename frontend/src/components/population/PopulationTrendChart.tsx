import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
} from 'recharts';
import { extractUnitSeries } from '../../api/bdlApi';
import { formatPopulation } from '../../constants/population';
import type { DataByVariable } from '../../types/bdl';

interface Props {
  data: DataByVariable | null;
  unitId: string;
  years: number[];
  title?: string;
}

export default function PopulationTrendChart({
  data,
  unitId,
  years,
  title = 'Populacja na przestrzeni lat',
}: Props) {
  if (!data) return <div className="chart-empty">Ładowanie wykresu...</div>;

  const series = extractUnitSeries(data, unitId, years);
  const chartData = years
    .filter((year) => series[year] != null)
    .map((year) => ({
      year: String(year),
      value: series[year] as number,
    }));

  if (chartData.length === 0) {
    return <div className="chart-empty">Brak danych dla wybranych lat</div>;
  }

  return (
    <div className="chart-card">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)} mln`}
          />
          <Tooltip formatter={(value: number) => formatPopulation(value)} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#7c6bf0"
            strokeWidth={2.5}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Brush dataKey="year" height={24} stroke="#7c6bf0" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
