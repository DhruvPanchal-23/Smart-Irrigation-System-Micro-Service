import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import AnalyticsCard from './AnalyticsCard.jsx';

const COLORS = ['#287f78', '#786b60', '#23a36f', '#c58b3a', '#4f7f95'];

export default function WeatherConditionPieChart({ data = [], periodLabel, loading, error, onRetry }) {
  return (
    <AnalyticsCard title={`${periodLabel} Weather Condition Distribution`} description="Share of recorded conditions in this period" loading={loading} error={error} onRetry={onRetry} empty={!data.length} emptyMessage="No weather-condition history is available." loadingMessage="Loading weather conditions..." summary={data.length ? `Most frequent condition: ${[...data].sort((a, b) => b.value - a.value)[0].name}.` : ''}>
      <div className="chart-container pie-chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={45} outerRadius={90} paddingAngle={2}>
              {data.map((item, index) => <Cell key={item.name} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={(value) => [value, 'Readings']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsCard>
  );
}
