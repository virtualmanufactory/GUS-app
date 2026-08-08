import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { extractUnitValue } from '../../api/bdlApi';
import { formatPopulation } from '../../constants/population';
import type { DataByVariable } from '../../types/bdl';

interface Props {
  preWorking: DataByVariable | null;
  working: DataByVariable | null;
  postWorking: DataByVariable | null;
  unitId: string;
  years: number[];
}

const COLORS = {
  pre: '#7c6bf0',
  working: '#4a4a4a',
  post: '#c4b5fd',
};

export default function EconomicAgeChart({
  preWorking,
  working,
  postWorking,
  unitId,
  years,
}: Props) {
  const chartData = years.map((year) => ({
    year: String(year),
    pre: preWorking ? extractUnitValue(preWorking, unitId, year) ?? 0 : 0,
    working: working ? extractUnitValue(working, unitId, year) ?? 0 : 0,
    post: postWorking ? extractUnitValue(postWorking, unitId, year) ?? 0 : 0,
  })).filter((item) => item.pre + item.working + item.post > 0);

  if (chartData.length === 0) {
    return <div className="chart-empty">Brak danych o grupach wiekowych</div>;
  }

  return (
    <div className="chart-card chart-card-wide">
      <h3>Wykres społeczeństwa podzielonego na ekonomiczne grupy wiekowe</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            type="number"
            tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)} mln`}
          />
          <YAxis type="category" dataKey="year" width={50} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value: number) => formatPopulation(value)} />
          <Legend />
          <Bar dataKey="pre" name="Wiek przedprodukcyjny" stackId="a" fill={COLORS.pre} />
          <Bar dataKey="working" name="Wiek produkcyjny" stackId="a" fill={COLORS.working} />
          <Bar dataKey="post" name="Wiek poprodukcyjny" stackId="a" fill={COLORS.post} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
