import Card from '../components/common/Card';
import PageLayout from '../components/layout/PageLayout';
import { CATEGORY_OPTIONS, STATUS_OPTIONS } from '../utils/constants';
import { getLast7Days } from '../utils/helpers';

function BarChart({ items, maxCount }) {
  return (
    <div className="bar-list">
      {items.map((item) => (
        <div key={item.label} className="bar-item">
          <span className="bar-name">{item.label}</span>
          <div className="bar-track">
            <div
              className={`bar-fill ${item.colorClass || ''}`}
              style={{
                width: maxCount > 0 ? `${(item.count / maxCount) * 100}%` : '0%',
              }}
            />
          </div>
          <span className="bar-count">{item.count}</span>
        </div>
      ))}
    </div>
  );
}

export default function Analysis({ items }) {
  const total = items.length;

  // 최근 7일 등록 수
  const last7Days = getLast7Days();
  const recentCounts = last7Days.map((dateStr) => ({
    label: dateStr.slice(5), // MM-DD
    count: items.filter((item) => item.createdAt?.slice(0, 10) === dateStr).length,
  }));
  const recentTotal = recentCounts.reduce((s, d) => s + d.count, 0);
  const maxRecentCount = Math.max(...recentCounts.map((d) => d.count), 1);

  // 상태별
  const statusData = STATUS_OPTIONS.map((s) => ({
    label: s.label,
    count: items.filter((i) => i.status === s.value).length,
    colorClass: `bar-${s.value}`,
  }));
  const maxStatusCount = Math.max(...statusData.map((d) => d.count), 1);

  // 카테고리별
  const categoryData = CATEGORY_OPTIONS.map((c) => ({
    label: c.label,
    count: items.filter((i) => i.category === c.value).length,
    colorClass: 'bar-category',
  }));
  const maxCategoryCount = Math.max(...categoryData.map((d) => d.count), 1);

  return (
    <PageLayout title="분석">
      {/* 요약 통계 */}
      <div className="stat-grid">
        <Card className="stat-card">
          <div className="stat-value">{total}</div>
          <div className="stat-label">전체 건수</div>
        </Card>
        <Card className="stat-card stat-active">
          <div className="stat-value">{recentTotal}</div>
          <div className="stat-label">최근 7일 등록</div>
        </Card>
        <Card className="stat-card stat-done">
          <div className="stat-value">
            {total > 0 ? Math.round((statusData.find(s => s.label === '완료')?.count / total) * 100) : 0}%
          </div>
          <div className="stat-label">완료율</div>
        </Card>
        <Card className="stat-card stat-pending">
          <div className="stat-value">
            {statusData.find(s => s.label === '활성')?.count || 0}
          </div>
          <div className="stat-label">활성 항목</div>
        </Card>
      </div>

      <div className="analysis-grid">
        {/* 최근 7일 등록 추이 */}
        <Card title="최근 7일 등록 추이">
          <BarChart items={recentCounts} maxCount={maxRecentCount} />
        </Card>

        {/* 상태별 분포 */}
        <Card title="상태별 분포">
          <BarChart items={statusData} maxCount={maxStatusCount} />
          <div className="chart-total">
            총 {total}건
          </div>
        </Card>

        {/* 카테고리별 분포 */}
        <Card title="카테고리별 분포">
          <BarChart items={categoryData} maxCount={maxCategoryCount} />
          <div className="chart-total">
            총 {total}건
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
