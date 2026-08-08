import AppLogo from '../components/AppLogo';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { extractUnitValue } from '../api/bdlApi';
import AgeGroupChart from '../components/population/AgeGroupChart';
import EconomicAgeChart from '../components/population/EconomicAgeChart';
import GenderChart from '../components/population/GenderChart';
import MetricSelector from '../components/population/MetricSelector';
import PolandMap, { POLAND_BDL_ID } from '../components/population/PolandMap';
import PopulationTrendChart from '../components/population/PopulationTrendChart';
import YearFilter from '../components/population/YearFilter';
import {
  formatPopulation,
  POPULATION_METRICS,
  POPULATION_YEARS,
  VOIVODESHIPS,
} from '../constants/population';
import { usePopulationData } from '../hooks/usePopulationData';
import '../styles/population.css';

export default function PopulationDashboard() {
  const { t, i18n } = useTranslation();
  const { data, loading, error } = usePopulationData();
  const [selectedYears, setSelectedYears] = useState<number[]>([...POPULATION_YEARS]);
  const [selectedMetricId, setSelectedMetricId] = useState('total');
  const [selectedVoivodeshipId, setSelectedVoivodeshipId] = useState<string | null>(null);

  const activeUnitId = selectedVoivodeshipId ?? POLAND_BDL_ID;
  const displayYear = selectedYears[selectedYears.length - 1] ?? 2018;

  const selectedMetric = POPULATION_METRICS.find((m) => m.id === selectedMetricId)!;
  const mapMetricData = data?.metrics[selectedMetric.variableId] ?? null;
  const totalData = data?.metrics[60641] ?? null;
  const malesData = data?.metrics[60614] ?? null;
  const femalesData = data?.metrics[60606] ?? null;

  const kpiValue = useMemo(() => {
    if (!totalData) return null;
    return extractUnitValue(totalData, activeUnitId, displayYear);
  }, [totalData, activeUnitId, displayYear]);

  const regionLabel = useMemo(() => {
    if (!selectedVoivodeshipId) return t('common.poland');
    const voivodeship = VOIVODESHIPS.find((v) => v.bdlId === selectedVoivodeshipId);
    if (!voivodeship) return t('common.region');
    return t(`voivodeships.${voivodeship.nameKey}`, { defaultValue: voivodeship.name });
  }, [selectedVoivodeshipId, t]);

  if (loading) {
    return (
      <div className="population-dashboard">
        <div className="dashboard-loading">{t('population.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="population-dashboard">
        <div className="dashboard-error">
          <p>{error}</p>
          <p className="dashboard-error-hint">{t('population.backendHint')}</p>
          <Link to="/" className="btn-back">
            {t('common.back')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="population-dashboard">
      <header className="dashboard-header">
        <Link to="/" className="btn-back" aria-label={t('common.back')}>
          ←
        </Link>
        <AppLogo to="/" size={32} showName={false} className="dashboard-logo" />
        <h1>{t('population.title')}</h1>
        <MetricSelector selectedMetricId={selectedMetricId} onChange={setSelectedMetricId} />
        <LanguageSwitcher />
      </header>

      <div className="dashboard-body">
        <div className="dashboard-main">
          <section className="dashboard-top">
            <div className="dashboard-map-section">
              <PolandMap
                mapMetricData={mapMetricData}
                selectedYear={displayYear}
                selectedVoivodeshipId={selectedVoivodeshipId}
                onSelectVoivodeship={setSelectedVoivodeshipId}
              />
            </div>

            <div className="dashboard-side">
              <div className="kpi-card">
                <span className="kpi-label">{t('population.kpiLabel')}</span>
                <span className="kpi-value">
                  {formatPopulation(kpiValue, i18n.language)}
                </span>
                <span className="kpi-region">
                  {regionLabel} · {displayYear}
                </span>
              </div>
              <GenderChart
                malesData={malesData}
                femalesData={femalesData}
                unitId={activeUnitId}
                year={displayYear}
              />
            </div>
          </section>

          <section className="dashboard-charts">
            <PopulationTrendChart
              data={totalData}
              unitId={activeUnitId}
              years={selectedYears}
            />
            <AgeGroupChart
              ageData={data?.age0to4 ?? {}}
              unitId={activeUnitId}
              years={selectedYears}
            />
            <EconomicAgeChart
              preWorking={data?.metrics[149] ?? null}
              working={data?.metrics[152] ?? null}
              postWorking={data?.metrics[155] ?? null}
              unitId={activeUnitId}
              years={selectedYears}
            />
          </section>
        </div>

        <YearFilter selectedYears={selectedYears} onChange={setSelectedYears} />
      </div>
    </div>
  );
}
