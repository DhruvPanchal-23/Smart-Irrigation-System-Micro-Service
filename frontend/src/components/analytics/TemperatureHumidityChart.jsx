import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import AnalyticsCard from './AnalyticsCard.jsx';

export default function TemperatureHumidityChart({ data = [], periodLabel, loading, error, onRetry }) {
  const latest = data.at(-1);
  return (
    <AnalyticsCard title={`${periodLabel} Temperature and Humidity Trend`} description="Saved readings for the selected farm" loading={loading} error={error} onRetry={onRetry} empty={!data.length} emptyMessage="No temperature or humidity history is available." loadingMessage="Loading weather trends..." summary={latest ? `Latest saved values: ${latest.temperature}°C and ${latest.humidity}% humidity.` : ''}>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 12, left: -12, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tickLine={false} axisLine={false} />
            <YAxis yAxisId="temperature" unit="°" tickLine={false} axisLine={false} />
            <YAxis yAxisId="humidity" orientation="right" domain={[0, 100]} unit="%" tickLine={false} axisLine={false} />
            <Tooltip formatter={(value, name) => [`${value}${name === 'Temperature' ? '°C' : '%'}`, name]} />
            <Legend />
            <Line yAxisId="temperature" type="monotone" dataKey="temperature" name="Temperature" stroke="#f59e0b" strokeWidth={3} dot={{ r: 3 }} />
            <Line yAxisId="humidity" type="monotone" dataKey="humidity" name="Humidity" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsCard>
  );
}
