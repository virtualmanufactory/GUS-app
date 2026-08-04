import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { bdlApi } from '../api/bdlApi';
import type { Subject } from '../types/bdl';

export default function SubjectsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const parentId = searchParams.get('parentId') ?? undefined;
  const page = Number(searchParams.get('page') ?? '0');

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [parentName, setParentName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSubjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bdlApi.getSubjects(parentId, page);
      setSubjects(response.results);
      setTotalRecords(response.totalRecords);

      if (parentId) {
        const parent = await bdlApi.getSubject(parentId);
        setParentName(parent.name);
      } else {
        setParentName(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Nieznany błąd');
    } finally {
      setLoading(false);
    }
  }, [parentId, page]);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const navigateTo = (newParentId?: string, newPage = 0) => {
    const params = new URLSearchParams();
    if (newParentId) params.set('parentId', newParentId);
    if (newPage > 0) params.set('page', String(newPage));
    setSearchParams(params);
  };

  const totalPages = Math.ceil(totalRecords / 20);

  return (
    <div>
      {parentName && (
        <div className="breadcrumb">
          <Link to="/subjects">Tematy</Link>
          <span>/</span>
          <span>{parentName}</span>
        </div>
      )}

      <div className="card">
        <h2>{parentName ? `Podtematy: ${parentName}` : 'Tematy główne'}</h2>

        {error && <div className="error">{error}</div>}
        {loading && <div className="loading">Ładowanie...</div>}

        {!loading && !error && (
          <>
            <ul className="list">
              {subjects.map((subject) => (
                <li
                  key={subject.id}
                  className="list-item"
                  onClick={() => {
                    if (subject.hasVariables) {
                      navigate(`/variables?subjectId=${subject.id}`);
                    } else if (subject.children?.length) {
                      navigateTo(subject.id);
                    }
                  }}
                >
                  <span>{subject.name}</span>
                  {subject.hasVariables ? (
                    <span className="badge">zmienne</span>
                  ) : subject.children?.length ? (
                    <span className="badge">{subject.children.length} podtematów</span>
                  ) : null}
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
