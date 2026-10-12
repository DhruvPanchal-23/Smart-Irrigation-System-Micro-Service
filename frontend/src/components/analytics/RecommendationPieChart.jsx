import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import AnalyticsCard from './AnalyticsCard.jsx';

const COLORS = ['#287271', '#23a36f', '#c58b3a', '#795548', '#786b60'];

export default function RecommendationPieChart({ data = [], periodLabel, loading, error, onRetry }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return (
    <AnalyticsCard title={`${periodLabel} Irrigation Recommendation Summary`} description="Frequency of backend-generated advice" loading={loading} error={error} onRetry={onRetry} empty={!data.length} emptyMessage="No recommendation history is available." loadingMessage="Loading recommendation summary..." summary={total ? `${total} recommendations were generated in this period.` : ''}>
      <div className="chart-container pie-chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={3}>
              {data.map((item, index) => <Cell key={item.name} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={(value) => [value, 'Recommendations']} />
            <Legend />
            <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className="pie-total">{total}</text>
            <text x="50%" y="53%" textAnchor="middle" dominantBaseline="middle" className="pie-label">total</text>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsCard>
  );
}
