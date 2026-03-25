import { useState, useEffect, useRef } from 'react';

export default function ProjectPicker({ projects, onSelect, onCreateAndSelect, onClose }) {
  const [newName, setNewName] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (projects.length === 0) inputRef.current?.focus();
  }, [projects.length]);

  function handleCreate(e) {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;
    onCreateAndSelect(trimmed);
  }

  function handleOverlayKey(e) {
    if (e.key === 'Escape') onClose();
  }

  return (
    <div className="picker-overlay" onClick={onClose} onKeyDown={handleOverlayKey}>
      <div className="picker" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="picker-header">
          <span className="picker-title">Which project?</span>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {projects.length > 0 && (
          <ul className="picker-list">
            {projects.map((p) => (
              <li key={p.id} className="picker-item" onClick={() => onSelect(p.id)}>
                <span className="picker-dot" style={{ background: p.color }} />
                <span className="picker-name">{p.name}</span>
              </li>
            ))}
          </ul>
        )}

        {projects.length > 0 && (
          <div className="picker-separator">
            <span>or create new</span>
          </div>
        )}

        <form className="picker-new" onSubmit={handleCreate}>
          <input
            ref={inputRef}
            className="input"
            placeholder="New project name…"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            maxLength={60}
          />
          <button className="btn btn-primary" type="submit" disabled={!newName.trim()}>
            Start
          </button>
        </form>
      </div>
    </div>
  );
}
