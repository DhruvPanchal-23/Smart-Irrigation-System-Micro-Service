export default function AnalyticsEmptyState({ message, actionLabel, onAction }) {
  return (
    <div className="analytics-state" role="status">
      <p>{message}</p>
      {onAction && <button type="button" className="analytics-retry" onClick={onAction}>{actionLabel || 'Retry'}</button>}
    </div>
  );
}
