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
import { useTranslation } from 'react-i18next';
import { extractUnitValue } from '../../api/bdlApi';
import { AGE_0_4_VARIABLES, formatPopulation } from '../../constants/population';
import type { DataByVariable } from '../../types/bdl';

interface Props {
  ageData: Record<number, DataByVariable>;
  unitId: string;
  years: number[];
}

export default function AgeGroupChart({ ageData, unitId, years }: Props) {
  const { t, i18n } = useTranslation();

  const chartData = years
    .map((year) => {
      const total = AGE_0_4_VARIABLES.reduce((sum, variableId) => {
        const value = extractUnitValue(ageData[variableId], unitId, year);
        return sum + (value ?? 0);
      }, 0);
      return { year: String(year), value: total };
    })
    .filter((item) => item.value > 0);

  if (chartData.length === 0) {
    return <div className="chart-empty">{t('population.noAgeData')}</div>;
  }

  const thousandsLabel = i18n.language === 'en' ? 'k' : 'tys.';

  return (
    <div className="chart-card">
      <h3>{t('population.age0to4Title')}</h3>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)} ${thousandsLabel}`}
          />
          <Tooltip formatter={(value: number) => formatPopulation(value, i18n.language)} />
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
