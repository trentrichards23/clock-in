import { formatDuration } from '../utils/time';

export default function Dashboard({ projects, sessions }) {
  const totalAll = sessions.reduce((acc, s) => acc + s.duration, 0);

  const projectTotals = projects
    .map((p) => ({
      ...p,
      total: sessions.filter((s) => s.projectId === p.id).reduce((acc, s) => acc + s.duration, 0),
      sessionCount: sessions.filter((s) => s.projectId === p.id).length,
    }))
    .filter((p) => p.total > 0)
    .sort((a, b) => b.total - a.total);

  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Overview</h2>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-label">Time Logged</span>
          <span className="stat-value">{formatDuration(totalAll)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Sessions</span>
          <span className="stat-value">{sessions.length}</span>
        </div>
      </div>

      {projectTotals.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">▦</div>
          <span className="empty-state-text">Clock in to a project to see stats</span>
        </div>
      )}

      {projectTotals.length > 0 && (
        <ul className="dashboard-list">
          {projectTotals.map((p) => {
            const pct = totalAll > 0 ? (p.total / totalAll) * 100 : 0;
            return (
              <li key={p.id} className="dashboard-item">
                <div className="dashboard-item-header">
                  <span className="dashboard-project-name" style={{ color: p.color }}>
                    {p.name}
                  </span>
                  <span className="dashboard-project-time">{formatDuration(p.total)}</span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${pct}%`, background: p.color }}
                  />
                </div>
                <div className="dashboard-meta">
                  <span className="dashboard-session-count">
                    {p.sessionCount} session{p.sessionCount !== 1 ? 's' : ''}
                  </span>
                  <span className="dashboard-pct">{Math.round(pct)}%</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
