import { useState } from 'react';
import FocusMode from '../components/FocusMode';
import ProjectPicker from '../components/ProjectPicker';

export default function Home({ projects, activeSession, onClockIn, onClockOut, onAddProject }) {
  const [showPicker, setShowPicker] = useState(false);

  if (activeSession) {
    return (
      <FocusMode
        activeSession={activeSession}
        projects={projects}
        onClockOut={onClockOut}
      />
    );
  }

  function handleSelect(projectId) {
    onClockIn(projectId);
    setShowPicker(false);
  }

  function handleCreateAndSelect(name) {
    const project = onAddProject(name);
    onClockIn(project.id);
    setShowPicker(false);
  }

  return (
    <div className="home">
      <button className="btn-clock-in" onClick={() => setShowPicker(true)}>
        Clock In
      </button>
      {showPicker && (
        <ProjectPicker
          projects={projects}
          onSelect={handleSelect}
          onCreateAndSelect={handleCreateAndSelect}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}
