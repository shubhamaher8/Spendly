export default function SummaryCard({ title, amount, dotColor }) {
  return (
    <div className="card summary-card">
      <div className="summary-label">
        <span className={`dot dot-${dotColor}`} />
        {title}
      </div>
      <div className="summary-amount">
        Rs. {Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
      </div>
    </div>
  );
}
