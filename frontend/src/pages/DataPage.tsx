import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { bdlApi } from '../api/bdlApi';
import type { DataByVariable, Variable } from '../types/bdl';

export default function DataPage() {
  const { variableId } = useParams<{ variableId: string }>();
  const id = Number(variableId);

  const [variable, setVariable] = useState<Variable | null>(null);
  const [data, setData] = useState<DataByVariable | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [varInfo, varData] = await Promise.all([
          bdlApi.getVariable(id),
          bdlApi.getDataByVariable(id),
        ]);
        setVariable(varInfo);
        setData(varData);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Nieznany błąd');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) return <div className="loading">Ładowanie danych...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!variable || !data) return null;

  const unitIds = Object.keys(data.values);
  const years = data.years ?? [];

  return (
    <div>
      <div className="breadcrumb">
        <Link to="/variables">Zmienne</Link>
        <span>/</span>
        <span>{variable.name}</span>
      </div>

      <div className="card">
        <h2>{variable.name}</h2>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
          ID: {variable.id}
          {data.measureUnitName && ` · Jednostka miary: ${data.measureUnitName}`}
        </p>

        {unitIds.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Jednostka (ID)</th>
                  {years.map((year) => (
                    <th key={year}>{year}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {unitIds.slice(0, 50).map((unitId) => (
                  <tr key={unitId}>
                    <td>{unitId}</td>
                    {years.map((year) => {
                      const yearData = data.values[unitId]?.find(
                        (entry) => entry[2] === year,
                      );
                      return (
                        <td key={year}>
                          {yearData ? (yearData[0] ?? '—') : '—'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            {unitIds.length > 50 && (
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Wyświetlono 50 z {unitIds.length} jednostek
              </p>
            )}
          </div>
        ) : (
          <p style={{ color: '#64748b' }}>Brak danych dla tej zmiennej</p>
        )}
      </div>
    </div>
  );
}
