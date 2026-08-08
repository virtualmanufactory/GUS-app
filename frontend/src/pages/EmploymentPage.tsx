import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import IndustryBarChart from '../components/employment/IndustryBarChart';
import { DEFAULT_EMPLOYMENT_YEAR, EMPLOYMENT_YEARS } from '../constants/employment';
import { VOIVODESHIPS } from '../constants/population';
import { useEmploymentData } from '../hooks/useEmploymentData';
import '../styles/employment.css';

export default function EmploymentPage() {
  const { t, i18n } = useTranslation();
  const [selectedVoivodeshipId, setSelectedVoivodeshipId] = useState(VOIVODESHIPS[6].bdlId);
  const [selectedYear, setSelectedYear] = useState(DEFAULT_EMPLOYMENT_YEAR);

  const { data, loading, error } = useEmploymentData(selectedVoivodeshipId, selectedYear);

  const regionLabel = useMemo(() => {
    const voivodeship = VOIVODESHIPS.find((v) => v.bdlId === selectedVoivodeshipId);
    if (!voivodeship) return t('common.region');
    return t(`voivodeships.${voivodeship.nameKey}`, { defaultValue: voivodeship.name });
  }, [selectedVoivodeshipId, t]);

  const locale = i18n.language === 'en' ? 'en-US' : 'pl-PL';

  return (
    <div className="employment-page">
      <div className="employment-header">
        <div>
          <h2>{t('employment.title')}</h2>
          <p className="employment-subtitle">{t('employment.subtitle')}</p>
        </div>
      </div>

      <div className="employment-filters card">
        <label className="employment-filter">
          <span>{t('employment.voivodeship')}</span>
          <select
            value={selectedVoivodeshipId}
            onChange={(e) => setSelectedVoivodeshipId(e.target.value)}
          >
            {VOIVODESHIPS.map((voivodeship) => (
              <option key={voivodeship.bdlId} value={voivodeship.bdlId}>
                {t(`voivodeships.${voivodeship.nameKey}`, { defaultValue: voivodeship.name })}
              </option>
            ))}
          </select>
        </label>

        <label className="employment-filter">
          <span>{t('employment.year')}</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {[...EMPLOYMENT_YEARS].reverse().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading && <div className="loading">{t('employment.loading')}</div>}

      {error && (
        <div className="dashboard-error">
          <p>{error}</p>
          <p className="dashboard-error-hint">{t('employment.backendHint')}</p>
          <Link to="/" className="btn-back">
            {t('common.back')}
          </Link>
        </div>
      )}

      {!loading && !error && data && (
        <>
          <div className="employment-kpi-row">
            <div className="employment-kpi card">
              <span className="employment-kpi-label">{t('employment.totalEmployed')}</span>
              <span className="employment-kpi-value">
                {data.totalEmployed.toLocaleString(locale)}
              </span>
              <span className="employment-kpi-meta">
                {regionLabel} · {selectedYear}
              </span>
            </div>
            <div className="employment-kpi card">
              <span className="employment-kpi-label">{t('employment.topIndustry')}</span>
              <span className="employment-kpi-value employment-kpi-industry">
                {data.industries[0]
                  ? `${data.industries[0].section} – ${t(`employment.industries.${data.industries[0].nameKey}`)}`
                  : '—'}
              </span>
              <span className="employment-kpi-meta">
                {data.industries[0]?.share != null
                  ? `${data.industries[0].share.toFixed(1)}% ${t('employment.ofTotal')}`
                  : '—'}
              </span>
            </div>
          </div>

          <div className="employment-grid">
            <div className="card employment-chart-card">
              <h3>{t('employment.chartTitle')}</h3>
              <IndustryBarChart industries={data.industries} />
            </div>

            <div className="card employment-table-card">
              <h3>{t('employment.rankingTitle')}</h3>
              <div className="employment-table-wrap">
                <table className="data-table employment-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>{t('employment.section')}</th>
                      <th>{t('employment.industry')}</th>
                      <th>{t('employment.employed')}</th>
                      <th>{t('employment.share')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.industries.map((item, index) => (
                      <tr key={item.variableId}>
                        <td>{index + 1}</td>
                        <td>{item.section}</td>
                        <td>{t(`employment.industries.${item.nameKey}`)}</td>
                        <td>{item.employed?.toLocaleString(locale) ?? '—'}</td>
                        <td>{item.share != null ? `${item.share.toFixed(1)}%` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <p className="employment-source">{t('employment.source')}</p>
        </>
      )}
    </div>
  );
}
