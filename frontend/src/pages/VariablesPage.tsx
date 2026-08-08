import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { bdlApi } from '../api/bdlApi';
import type { Variable } from '../types/bdl';

export default function VariablesPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const subjectId = searchParams.get('subjectId') ?? undefined;
  const page = Number(searchParams.get('page') ?? '0');
  const [search, setSearch] = useState(searchParams.get('search') ?? '');

  const [variables, setVariables] = useState<Variable[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVariables = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bdlApi.getVariables(subjectId, search || undefined, page);
      setVariables(response.results);
      setTotalRecords(response.totalRecords);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('common.unknownError'));
    } finally {
      setLoading(false);
    }
  }, [subjectId, search, page, t]);

  useEffect(() => {
    loadVariables();
  }, [loadVariables]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (subjectId) params.set('subjectId', subjectId);
    if (search) params.set('search', search);
    setSearchParams(params);
  };

  const totalPages = Math.ceil(totalRecords / 20);

  return (
    <div>
      <div className="card">
        <h2>{t('variables.title')}</h2>

        <form onSubmit={handleSearch}>
          <input
            className="search-input"
            type="text"
            placeholder={t('variables.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        {error && <div className="error">{error}</div>}
        {loading && <div className="loading">{t('common.loading')}</div>}

        {!loading && !error && (
          <>
            <ul className="list">
              {variables.map((variable) => (
                <li key={variable.id}>
                  <Link
                    to={`/data/variable/${variable.id}`}
                    className="list-item"
                    style={{ display: 'flex' }}
                  >
                    <span>{variable.name}</span>
                    <span className="badge">ID: {variable.id}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {variables.length === 0 && (
              <p style={{ textAlign: 'center', color: '#64748b' }}>{t('common.noResults')}</p>
            )}

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn"
                  disabled={page === 0}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set('page', String(page - 1));
                    setSearchParams(params);
                  }}
                >
                  {t('common.previous')}
                </button>
                <span>{t('common.page', { current: page + 1, total: totalPages })}</span>
                <button
                  className="btn"
                  disabled={page >= totalPages - 1}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set('page', String(page + 1));
                    setSearchParams(params);
                  }}
                >
                  {t('common.next')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
