import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import type { IndustryEmployment } from '../../hooks/useEmploymentData';

interface Props {
  industries: IndustryEmployment[];
  maxItems?: number;
}

export default function IndustryBarChart({ industries, maxItems = 8 }: Props) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'en' ? 'en-US' : 'pl-PL';

  const chartData = industries.slice(0, maxItems).map((item) => ({
    name: `${item.section} – ${t(`employment.industries.${item.nameKey}`)}`,
    shortName: item.section,
    employed: item.employed ?? 0,
    share: item.share ?? 0,
  }));

  if (chartData.length === 0) {
    return <p className="employment-empty">{t('employment.noIndustryData')}</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis
          type="number"
          tickFormatter={(value) => value.toLocaleString(locale)}
        />
        <YAxis type="category" dataKey="shortName" width={36} />
        <Tooltip
          formatter={(value: number, _name, props) => [
            `${value.toLocaleString(locale)} (${(props.payload as { share: number }).share.toFixed(1)}%)`,
            t('employment.employed'),
          ]}
          labelFormatter={(_label, payload) =>
            payload?.[0] ? (payload[0].payload as { name: string }).name : ''
          }
        />
        <Bar dataKey="employed" fill="#5b21b6" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
