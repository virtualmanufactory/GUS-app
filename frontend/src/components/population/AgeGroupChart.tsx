import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
} from 'recharts';
import { extractUnitValue } from '../../api/bdlApi';
import { AGE_0_4_VARIABLES } from '../../constants/population';
import { formatPopulation } from '../../constants/population';
import type { DataByVariable } from '../../types/bdl';

interface Props {
  ageData: Record<number, DataByVariable>;
  unitId: string;
  years: number[];
}

export default function AgeGroupChart({ ageData, unitId, years }: Props) {
  const chartData = years.map((year) => {
    const total = AGE_0_4_VARIABLES.reduce((sum, variableId) => {
      const value = extractUnitValue(ageData[variableId], unitId, year);
      return sum + (value ?? 0);
    }, 0);
    return { year: String(year), value: total };
  }).filter((item) => item.value > 0);

  if (chartData.length === 0) {
    return <div className="chart-empty">Brak danych dla wieku 0–4</div>;
  }

  return (
    <div className="chart-card">
      <h3>Osoby w wieku 0–4</h3>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)} tys.`}
          />
          <Tooltip formatter={(value: number) => formatPopulation(value)} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#7c6bf0"
            fill="#c4b5fd"
            fillOpacity={0.5}
          />
          <Brush dataKey="year" height={24} stroke="#7c6bf0" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
