import { useState } from 'react';
import { formatDuration } from '../utils/time';

export default function ProjectList({ projects, sessions, activeSession, onClockIn, onClockOut, onAdd, onDelete }) {
  const [newName, setNewName] = useState('');

  function handleAdd(e) {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setNewName('');
  }

  function getTotalTime(projectId) {
    return sessions
      .filter((s) => s.projectId === projectId)
      .reduce((acc, s) => acc + s.duration, 0);
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Projects</h2>
        {projects.length > 0 && (
          <span className="panel-badge">{projects.length}</span>
        )}
      </div>

      <form className="add-project-form" onSubmit={handleAdd}>
        <input
          className="input"
          type="text"
          placeholder="New project name…"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          maxLength={60}
        />
        <button className="btn btn-primary" type="submit" disabled={!newName.trim()}>
          Add
        </button>
      </form>

      {projects.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">◎</div>
          <span className="empty-state-text">No projects yet</span>
        </div>
      )}

      {projects.length > 0 && (
        <ul className="project-list">
          {projects.map((project) => {
            const isActive = activeSession?.projectId === project.id;
            const total = getTotalTime(project.id);
            return (
              <li key={project.id} className={`project-item${isActive ? ' project-item--active' : ''}`}>
                <span className="project-dot" style={{ background: project.color }} />
                <div className="project-meta">
                  <span className="project-name">{project.name}</span>
                  <span className="project-total">
                    {total > 0 ? formatDuration(total) : 'No time logged'}
                  </span>
                </div>
                <div className="project-actions">
                  {isActive ? (
                    <button className="btn btn-danger btn-sm" onClick={onClockOut}>
                      Clock Out
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onClockIn(project.id)}
                      disabled={!!activeSession}
                    >
                      Clock In
                    </button>
                  )}
                  <button
                    className="btn btn-ghost btn-sm btn-icon btn-delete"
                    onClick={() => onDelete(project.id)}
                    title="Delete project"
                  >
                    ✕
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
