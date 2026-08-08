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
import { useTranslation } from 'react-i18next';
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
  const { t, i18n } = useTranslation();

  const chartData = years
    .map((year) => ({
      year: String(year),
      pre: preWorking ? extractUnitValue(preWorking, unitId, year) ?? 0 : 0,
      working: working ? extractUnitValue(working, unitId, year) ?? 0 : 0,
      post: postWorking ? extractUnitValue(postWorking, unitId, year) ?? 0 : 0,
    }))
    .filter((item) => item.pre + item.working + item.post > 0);

  if (chartData.length === 0) {
    return <div className="chart-empty">{t('population.noEconomicData')}</div>;
  }

  return (
    <div className="chart-card chart-card-wide">
      <h3>{t('population.economicTitle')}</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            type="number"
            tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)} mln`}
          />
          <YAxis type="category" dataKey="year" width={50} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value: number) => formatPopulation(value, i18n.language)} />
          <Legend />
          <Bar dataKey="pre" name={t('population.preWorking')} stackId="a" fill={COLORS.pre} />
          <Bar
            dataKey="working"
            name={t('population.working')}
            stackId="a"
            fill={COLORS.working}
          />
          <Bar dataKey="post" name={t('population.postWorking')} stackId="a" fill={COLORS.post} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
