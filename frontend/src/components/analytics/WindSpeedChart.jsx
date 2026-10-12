import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import AnalyticsCard from './AnalyticsCard.jsx';

export default function WindSpeedChart({ data = [], periodLabel, loading, error, onRetry }) {
  const speeds = data.map((item) => item.windSpeed);
  const summary = speeds.length ? `Current ${speeds.at(-1)} km/h · Minimum ${Math.min(...speeds)} km/h · Maximum ${Math.max(...speeds)} km/h.` : '';
  return (
    <AnalyticsCard title={`${periodLabel} Wind Speed Trend`} description="Wind speed across saved weather readings" loading={loading} error={error} onRetry={onRetry} empty={!data.length} emptyMessage="No wind-speed history is available." loadingMessage="Loading wind trends..." summary={summary}>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 20, left: -8, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tickLine={false} axisLine={false} />
            <YAxis unit=" km/h" tickLine={false} axisLine={false} />
            <Tooltip formatter={(value) => [`${value} km/h`, 'Wind speed']} />
            <Line type="monotone" dataKey="windSpeed" name="Wind speed" stroke="#7c3aed" strokeWidth={3} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsCard>
  );
}
