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

  const voivodeshipResults = data.results.filter((r) => r.id.endsWith('0000000000') && r.id.length === 12);

  return (
    <div>
      <div className="breadcrumb">
        <Link to="/variables">Zmienne</Link>
        <span>/</span>
        <span>{variable.name}</span>
      </div>

      <div className="card">
        <h2>{variable.name}</h2>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>ID: {variable.id}</p>

        {voivodeshipResults.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Jednostka</th>
                  {voivodeshipResults[0]?.values.map((v) => (
                    <th key={v.year}>{v.year}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {voivodeshipResults.slice(0, 50).map((unit) => (
                  <tr key={unit.id}>
                    <td>{unit.name}</td>
                    {unit.values.map((v) => (
                      <td key={v.year}>{v.val ?? '—'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: '#64748b' }}>Brak danych dla tej zmiennej</p>
        )}
      </div>
    </div>
  );
}
