import Card from '../components/common/Card';
import PageLayout from '../components/layout/PageLayout';
import { STATUS_OPTIONS } from '../utils/constants';

export default function Dashboard({ items, onNavigate }) {
  const total = items.length;

  const statusCounts = STATUS_OPTIONS.map((s) => ({
    label: s.label,
    value: s.value,
    count: items.filter((i) => i.status === s.value).length,
  }));

  return (
    <PageLayout
      title="대시보드"
      actions={
        <button
          className="btn btn-primary btn-sm"
          onClick={() => onNavigate('dataManager')}
        >
          + 자산 등록
        </button>
      }
    >
      {/* 통계 카드 */}
      <div className="stat-grid">
        <div className="stat-card-clickable" onClick={() => onNavigate('searchList', '')}>
          <Card className="stat-card">
            <div className="stat-value">{total}</div>
            <div className="stat-label">전체</div>
          </Card>
        </div>
        {statusCounts.map((s) => (
          <div key={s.value} className="stat-card-clickable" onClick={() => onNavigate('searchList', s.value)}>
            <Card className={`stat-card stat-${s.value}`}>
              <div className="stat-value">{s.count}</div>
              <div className="stat-label">{s.label}</div>
            </Card>
          </div>
        ))}
      </div>

      {/* 상태별 현황 */}
      <Card title="상태별 현황">
        <ul className="summary-list">
          {statusCounts.map((s) => (
            <li key={s.value} className="summary-item">
              <span className="summary-label">{s.label}</span>
              <span className="summary-bar-wrap">
                <span
                  className={`summary-bar bar-${s.value}`}
                  style={{
                    width: total > 0 ? `${(s.count / total) * 100}%` : '0%',
                  }}
                />
              </span>
              <span className="summary-count">{s.count}</span>
            </li>
          ))}
        </ul>
      </Card>
    </PageLayout>
  );
}
