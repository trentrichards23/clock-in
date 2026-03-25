import { useState, useEffect } from 'react';

function formatFocusTime(ms) {
  if (!ms || ms < 0) return '00:00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map(n => String(n).padStart(2, '0')).join(':');
}

export default function FocusMode({ activeSession, projects, onClockOut }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const project = projects.find(p => p.id === activeSession?.projectId);
  const elapsed = activeSession ? now - activeSession.startTime : 0;

  return (
    <div className="focus-mode">
      <div className="focus-content">
        <div className="focus-timer">{formatFocusTime(elapsed)}</div>
        {project && (
          <div className="focus-project-name" style={{ color: project.color }}>
            {project.name}
          </div>
        )}
      </div>
      <button className="focus-clock-out btn" onClick={onClockOut}>
        Clock Out
      </button>
    </div>
  );
}
