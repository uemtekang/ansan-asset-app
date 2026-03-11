import Card from '../components/common/Card';
import Table from '../components/common/Table';
import PageLayout from '../components/layout/PageLayout';
import { CATEGORY_OPTIONS, STATUS_OPTIONS } from '../utils/constants';
import { formatDate } from '../utils/helpers';

export default function Dashboard({ items, onNavigate }) {
  const total = items.length;
  const activeCount = items.filter((i) => i.status === 'active').length;
  const inactiveCount = items.filter((i) => i.status === 'inactive').length;
  const doneCount = items.filter((i) => i.status === 'done').length;
  const pendingCount = items.filter((i) => i.status === 'pending').length;

  const recentItems = [...items]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const categoryCounts = CATEGORY_OPTIONS.map((cat) => ({
    label: cat.label,
    value: cat.value,
    count: items.filter((i) => i.category === cat.value).length,
  }));

  const statusCounts = STATUS_OPTIONS.map((s) => ({
    label: s.label,
    value: s.value,
    count: items.filter((i) => i.status === s.value).length,
  }));

  const recentColumns = [
    { key: 'title', label: '제목' },
    {
      key: 'category',
      label: '카테고리',
      render: (val) =>
        CATEGORY_OPTIONS.find((c) => c.value === val)?.label || val,
    },
    {
      key: 'status',
      label: '상태',
      render: (val) => (
        <span className={`badge badge-${val}`}>
          {STATUS_OPTIONS.find((s) => s.value === val)?.label || val}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: '등록일',
      render: (val) => formatDate(val),
    },
  ];

  return (
    <PageLayout
      title="대시보드"
      actions={
        <button
          className="btn btn-primary btn-sm"
          onClick={() => onNavigate('dataManager')}
        >
          + 새 항목 등록
        </button>
      }
    >
      {/* 통계 카드 */}
      <div className="stat-grid">
        <Card className="stat-card">
          <div className="stat-value">{total}</div>
          <div className="stat-label">전체</div>
        </Card>
        <Card className="stat-card stat-active">
          <div className="stat-value">{activeCount}</div>
          <div className="stat-label">활성</div>
        </Card>
        <Card className="stat-card stat-inactive">
          <div className="stat-value">{inactiveCount}</div>
          <div className="stat-label">비활성</div>
        </Card>
        <Card className="stat-card stat-done">
          <div className="stat-value">{doneCount}</div>
          <div className="stat-label">완료</div>
        </Card>
        <Card className="stat-card stat-pending">
          <div className="stat-value">{pendingCount}</div>
          <div className="stat-label">대기</div>
        </Card>
      </div>

      <div className="dashboard-grid">
        {/* 최근 등록 */}
        <Card title="최근 등록 항목 (5건)" className="dashboard-recent">
          <Table
            columns={recentColumns}
            data={recentItems}
            emptyText="등록된 데이터가 없습니다."
          />
        </Card>

        {/* 카테고리별 */}
        <div className="dashboard-side">
          <Card title="카테고리별 현황">
            <ul className="summary-list">
              {categoryCounts.map((c) => (
                <li key={c.value} className="summary-item">
                  <span className="summary-label">{c.label}</span>
                  <span className="summary-bar-wrap">
                    <span
                      className="summary-bar"
                      style={{
                        width: total > 0 ? `${(c.count / total) * 100}%` : '0%',
                      }}
                    />
                  </span>
                  <span className="summary-count">{c.count}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="상태별 현황" className="mt-16">
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
        </div>
      </div>
    </PageLayout>
  );
}
