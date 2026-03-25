import { formatDuration, formatDate, formatTime } from '../utils/time';
import WeekChart from '../components/WeekChart';

export default function Stats({ projects, sessions, onDeleteSession }) {
  const totalAll = sessions.reduce((acc, s) => acc + s.duration, 0);

  const projectTotals = projects
    .map((p) => ({
      ...p,
      total: sessions.filter((s) => s.projectId === p.id).reduce((acc, s) => acc + s.duration, 0),
      sessionCount: sessions.filter((s) => s.projectId === p.id).length,
    }))
    .filter((p) => p.total > 0)
    .sort((a, b) => b.total - a.total);

  const mostUsed = projectTotals[0] ?? null;

  function getProject(projectId) {
    return projects.find((p) => p.id === projectId);
  }

  return (
    <div className="stats-page">
      <WeekChart sessions={sessions} projects={projects} />

      <div className="stats-cards">
        <div className="stat-card">
          <span className="stat-label">Total Time</span>
          <span className="stat-value">{totalAll > 0 ? formatDuration(totalAll) : '—'}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Sessions</span>
          <span className="stat-value">{sessions.length || '—'}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Top Project</span>
          <span
            className="stat-value stat-value--sm"
            style={{ color: mostUsed?.color ?? 'var(--text-1)' }}
          >
            {mostUsed?.name ?? '—'}
          </span>
        </div>
      </div>

      {projectTotals.length > 0 && (
        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">By Project</h2>
          </div>
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
                    <div className="progress-fill" style={{ width: `${pct}%`, background: p.color }} />
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
        </section>
      )}

      <section className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Log History</h2>
          {sessions.length > 0 && (
            <span className="panel-badge">{sessions.length}</span>
          )}
        </div>

        {sessions.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">⊟</div>
            <span className="empty-state-text">No sessions logged yet</span>
          </div>
        )}

        {sessions.length > 0 && (
          <div className="log-table-wrapper">
            <table className="log-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Project</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Duration</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => {
                  const project = getProject(session.projectId);
                  return (
                    <tr key={session.id}>
                      <td className="log-date">{formatDate(session.startTime)}</td>
                      <td>
                        <span
                          className="log-project-badge"
                          style={{ borderColor: project?.color, color: project?.color }}
                        >
                          <span className="log-project-badge-dot" />
                          {project?.name ?? 'Deleted'}
                        </span>
                      </td>
                      <td className="log-time">{formatTime(session.startTime)}</td>
                      <td className="log-time">{formatTime(session.endTime)}</td>
                      <td className="log-duration">{formatDuration(session.duration)}</td>
                      <td>
                        <button
                          className="btn btn-ghost btn-sm btn-icon btn-delete"
                          onClick={() => onDeleteSession(session.id)}
                          title="Delete session"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
