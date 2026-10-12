import AnalyticsEmptyState from './AnalyticsEmptyState.jsx';

export default function AnalyticsCard({ title, description, loading, error, empty, emptyMessage, loadingMessage, onRetry, children, summary }) {
  return (
    <section className="card analytics-card" aria-label={title}>
      <header>
        <h2>{title}</h2>
        <p>{description}</p>
      </header>
      {loading ? <AnalyticsEmptyState message={loadingMessage || 'Loading analytics...'} /> :
        error ? <AnalyticsEmptyState message="Unable to load analytics." actionLabel="Retry" onAction={onRetry} /> :
          empty ? <AnalyticsEmptyState message={emptyMessage} /> : children}
      {summary && !loading && !error && !empty && <p className="chart-summary">{summary}</p>}
    </section>
  );
}
