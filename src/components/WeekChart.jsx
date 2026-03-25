import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { formatDuration } from '../utils/time';

/* ── Data ─────────────────────────────────────────── */

function buildWeekData(sessions, projects) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    days.push(d);
  }

  return days.map((day) => {
    const start = day.getTime();
    const end = start + 86_400_000;
    const entry = {
      day: day.toLocaleDateString('en-US', { weekday: 'short' }),
      date: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
    projects.forEach((p) => {
      entry[p.id] = sessions
        .filter((s) => s.projectId === p.id && s.startTime >= start && s.startTime < end)
        .reduce((acc, s) => acc + s.duration, 0);
    });
    return entry;
  });
}

/* ── Custom bar shape ─────────────────────────────── */

// Returns a shape renderer for a single project's Bar.
// Draws a rounded top only when this project is the topmost
// non-zero segment for that day.
function makeShape(data, projectId, stackedIds) {
  const myIdx = stackedIds.indexOf(projectId);
  const idsAbove = stackedIds.slice(myIdx + 1);

  return function BarShape({ x, y, width, height, fill, index }) {
    if (!height || height < 1) return null;
    const dayData = data[index] ?? {};
    const isTop = idsAbove.every((pid) => !(dayData[pid] > 0));

    if (!isTop) {
      return <rect x={x} y={y} width={width} height={height} fill={fill} />;
    }

    const r = Math.min(4, height, width / 2);
    return (
      <path
        d={`M${x},${y + r} Q${x},${y} ${x + r},${y} L${x + width - r},${y} Q${x + width},${y} ${x + width},${y + r} L${x + width},${y + height} L${x},${y + height} Z`}
        fill={fill}
      />
    );
  };
}

/* ── Tooltip ──────────────────────────────────────── */

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const dayData = payload[0]?.payload ?? {};
  const total = payload.reduce((sum, p) => sum + (p.value || 0), 0);
  if (!total) return null;

  const rows = [...payload].reverse().filter((p) => p.value > 0);

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-date">{dayData.date}</div>
      {rows.map((p) => (
        <div key={p.dataKey} className="chart-tooltip-row">
          <span className="chart-tooltip-dot" style={{ background: p.fill }} />
          <span className="chart-tooltip-name">{p.name}</span>
          <span className="chart-tooltip-time">{formatDuration(p.value)}</span>
        </div>
      ))}
      {rows.length > 1 && (
        <div className="chart-tooltip-total">
          <span>Total</span>
          <span>{formatDuration(total)}</span>
        </div>
      )}
    </div>
  );
}

/* ── Chart ────────────────────────────────────────── */

export default function WeekChart({ sessions, projects }) {
  const activeProjects = useMemo(
    () => projects.filter((p) => sessions.some((s) => s.projectId === p.id)),
    [projects, sessions],
  );

  const stackedIds = useMemo(() => activeProjects.map((p) => p.id), [activeProjects]);

  const data = useMemo(
    () => buildWeekData(sessions, activeProjects),
    [sessions, activeProjects],
  );

  const shapes = useMemo(
    () => activeProjects.map((p) => makeShape(data, p.id, stackedIds)),
    [data, activeProjects, stackedIds],
  );

  const hasData = data.some((d) => activeProjects.some((p) => d[p.id] > 0));

  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Last 7 Days</h2>
      </div>

      {!hasData ? (
        <div className="empty-state">
          <div className="empty-state-icon">◎</div>
          <span className="empty-state-text">No sessions in the last 7 days</span>
        </div>
      ) : (
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart
              data={data}
              barCategoryGap="30%"
              margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
            >
              <YAxis domain={[0, 'dataMax']} hide />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                  fill: '#4a4a60',
                  fontWeight: 500,
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(255,255,255,0.04)', rx: 4 }}
              />
              {activeProjects.map((p, i) => (
                <Bar
                  key={p.id}
                  dataKey={p.id}
                  name={p.name}
                  stackId="a"
                  fill={p.color}
                  shape={shapes[i]}
                  isAnimationActive={false}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
