import { formatDate, formatTime, formatDuration } from '../utils/time';

export default function LogHistory({ sessions, projects, onDelete }) {
  function getProject(projectId) {
    return projects.find((p) => p.id === projectId);
  }

  return (
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
                        onClick={() => onDelete(session.id)}
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
  );
}
