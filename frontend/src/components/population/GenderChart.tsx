import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';
import { extractUnitValue } from '../../api/bdlApi';
import { formatPopulation } from '../../constants/population';
import type { DataByVariable } from '../../types/bdl';

interface Props {
  malesData: DataByVariable | null;
  femalesData: DataByVariable | null;
  unitId: string;
  year: number;
}

const COLORS = ['#7c6bf0', '#4a4a4a'];

export default function GenderChart({ malesData, femalesData, unitId, year }: Props) {
  const { t, i18n } = useTranslation();

  const males = malesData ? extractUnitValue(malesData, unitId, year) : null;
  const females = femalesData ? extractUnitValue(femalesData, unitId, year) : null;

  if (males == null || females == null) {
    return <div className="chart-empty">{t('population.noGenderData')}</div>;
  }

  const chartData = [
    { name: t('population.females'), value: females },
    { name: t('population.males'), value: males },
  ];

  return (
    <div className="chart-card">
      <h3>{t('population.genderTitle')}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={2}
          >
            {chartData.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => formatPopulation(value, i18n.language)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
