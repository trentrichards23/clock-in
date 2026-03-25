import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './hooks/useStore';
import Nav from './components/Nav';
import Home from './pages/Home';
import Stats from './pages/Stats';
import './App.css';

export default function App() {
  const {
    projects,
    sessions,
    activeSession,
    addProject,
    clockIn,
    clockOut,
    deleteSession,
  } = useStore();

  return (
    <BrowserRouter>
      <div className="app">
        <Nav />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                projects={projects}
                activeSession={activeSession}
                onClockIn={clockIn}
                onClockOut={clockOut}
                onAddProject={addProject}
              />
            }
          />
          <Route
            path="/stats"
            element={
              activeSession
                ? <Navigate to="/" replace />
                : <Stats projects={projects} sessions={sessions} onDeleteSession={deleteSession} />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
