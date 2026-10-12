import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import AnalyticsCard from './AnalyticsCard.jsx';

export default function RainProbabilityChart({ data = [], periodLabel, loading, error, onRetry }) {
  const maximum = data.length ? Math.max(...data.map((item) => item.rainProbability)) : 0;
  return (
    <AnalyticsCard title={`${periodLabel} Rainfall Probability`} description="Rain probability for the selected farm" loading={loading} error={error} onRetry={onRetry} empty={!data.length} emptyMessage="No rainfall history is available." loadingMessage="Loading rainfall analytics..." summary={data.length ? `Highest saved rain probability: ${maximum}%.` : ''}>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 12, right: 20, left: -12, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tickLine={false} axisLine={false} />
            <YAxis domain={[0, 100]} unit="%" tickLine={false} axisLine={false} />
            <Tooltip formatter={(value) => [`${value}%`, 'Rain probability']} />
            <Bar dataKey="rainProbability" name="Rain probability" fill="#287271" radius={[8, 8, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsCard>
  );
}
