import { useCallback, useEffect, useState } from "react";
import type { AdminUser, Page } from "../types";
import { listUsers } from "../api";
import { UserList } from "./UserList";

const PAGE_SIZE = 20;

export function UsersTab() {
  const [pageIndex, setPageIndex] = useState(0);
  const [page, setPage] = useState<Page<AdminUser> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (index: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await listUsers(index, PAGE_SIZE);
      setPage(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(pageIndex);
  }, [load, pageIndex]);

  const users = page?.content ?? [];
  const totalPages = page?.totalPages ?? 0;
  const canPrev = pageIndex > 0 && !loading;
  const canNext = page != null && pageIndex < totalPages - 1 && !loading;

  return (
    <>
      <header className="admin-header">
        <div>
          <h1 className="admin-title">Users</h1>
          <p className="admin-subtitle">
            {page ? `${page.totalElements} registered` : "\u00A0"}
          </p>
        </div>
        <button
          className="admin-refresh"
          onClick={() => load(pageIndex)}
          disabled={loading}
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </header>

      {error && <div className="admin-error">{error}</div>}

      {loading && !page && <div className="admin-status">Loading users…</div>}

      {page && users.length === 0 && (
        <div className="admin-status">No users have registered yet.</div>
      )}

      {users.length > 0 && <UserList users={users} />}

      {page && totalPages > 0 && (
        <nav className="admin-pager" aria-label="Users pagination">
          <button
            className="admin-page-btn"
            onClick={() => setPageIndex((i) => Math.max(0, i - 1))}
            disabled={!canPrev}
          >
            ‹ Prev
          </button>
          <span className="admin-page-info">
            Page {pageIndex + 1} of {totalPages}
          </span>
          <button
            className="admin-page-btn"
            onClick={() => setPageIndex((i) => i + 1)}
            disabled={!canNext}
          >
            Next ›
          </button>
        </nav>
      )}
    </>
  );
}
