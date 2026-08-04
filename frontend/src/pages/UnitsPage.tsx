import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bdlApi } from '../api/bdlApi';
import type { Unit } from '../types/bdl';

export default function UnitsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const parentId = searchParams.get('parentId') ?? undefined;
  const page = Number(searchParams.get('page') ?? '0');
  const [search, setSearch] = useState(searchParams.get('search') ?? '');

  const [units, setUnits] = useState<Unit[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [parentName, setParentName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUnits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bdlApi.getUnits(parentId, search || undefined, page);
      setUnits(response.results);
      setTotalRecords(response.totalRecords);

      if (parentId) {
        const parent = await bdlApi.getUnit(parentId);
        setParentName(parent.name);
      } else {
        setParentName(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Nieznany błąd');
    } finally {
      setLoading(false);
    }
  }, [parentId, search, page]);

  useEffect(() => {
    loadUnits();
  }, [loadUnits]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (parentId) params.set('parentId', parentId);
    if (search) params.set('search', search);
    setSearchParams(params);
  };

  const navigateTo = (newParentId?: string, newPage = 0) => {
    const params = new URLSearchParams();
    if (newParentId) params.set('parentId', newParentId);
    if (search) params.set('search', search);
    if (newPage > 0) params.set('page', String(newPage));
    setSearchParams(params);
  };

  const totalPages = Math.ceil(totalRecords / 20);

  return (
    <div>
      {parentName && (
        <div className="breadcrumb">
          <button className="btn" onClick={() => navigateTo(undefined)}>
            Jednostki
          </button>
          <span>/</span>
          <span>{parentName}</span>
        </div>
      )}

      <div className="card">
        <h2>{parentName ? `Podjednostki: ${parentName}` : 'Jednostki terytorialne'}</h2>

        <form onSubmit={handleSearch}>
          <input
            className="search-input"
            type="text"
            placeholder="Szukaj jednostki po nazwie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        {error && <div className="error">{error}</div>}
        {loading && <div className="loading">Ładowanie...</div>}

        {!loading && !error && (
          <>
            <ul className="list">
              {units.map((unit) => (
                <li
                  key={unit.id}
                  className="list-item"
                  onClick={() => {
                    if (unit.children?.length) {
                      navigateTo(unit.id);
                    }
                  }}
                >
                  <span>{unit.name}</span>
                  <span className="badge">poziom {unit.level}</span>
                </li>
              ))}
            </ul>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn"
                  disabled={page === 0}
                  onClick={() => navigateTo(parentId, page - 1)}
                >
                  Poprzednia
                </button>
                <span>
                  Strona {page + 1} z {totalPages}
                </span>
                <button
                  className="btn"
                  disabled={page >= totalPages - 1}
                  onClick={() => navigateTo(parentId, page + 1)}
                >
                  Następna
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
