import { useEffect, useState } from 'react';
import { formatDurationShort } from '../utils/time';

export default function ActiveTimer({ activeSession, projects, onClockOut }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!activeSession) {
      setElapsed(0);
      return;
    }
    setElapsed(Date.now() - activeSession.startTime);
    const id = setInterval(() => {
      setElapsed(Date.now() - activeSession.startTime);
    }, 1000);
    return () => clearInterval(id);
  }, [activeSession]);

  if (!activeSession) return null;

  const project = projects.find((p) => p.id === activeSession.projectId);

  return (
    <div className="active-timer">
      <div className="active-timer-left">
        <div className="pulse-ring">
          <span className="pulse-dot" />
        </div>
        <div className="active-timer-info">
          <div className="active-project-name" style={{ color: project?.color }}>
            {project?.name ?? 'Unknown Project'}
          </div>
          <div className="active-timer-clock">{formatDurationShort(elapsed)}</div>
        </div>
      </div>
      <button className="btn btn-danger-outline btn-sm" onClick={onClockOut}>
        Clock Out
      </button>
    </div>
  );
}
