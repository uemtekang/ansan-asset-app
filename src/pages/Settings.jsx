import Card from '../components/common/Card';
import Button from '../components/common/Button';
import PageLayout from '../components/layout/PageLayout';

export default function Settings({
  items,
  onLoadSample,
  onResetData,
  onExport,
}) {
  return (
    <PageLayout title="설정">
      {/* 데이터 현황 */}
      <Card title="데이터 현황">
        <div className="settings-info">
          <div className="settings-info-row">
            <span className="settings-info-label">현재 저장된 데이터 수</span>
            <span className="settings-info-value">
              <strong>{items.length}</strong>건
            </span>
          </div>
        </div>
      </Card>

      {/* 데이터 관리 */}
      <Card title="데이터 관리" className="mt-24">
        <div className="settings-actions">
          <div className="settings-action-item">
            <div className="settings-action-info">
              <strong>샘플 데이터 불러오기</strong>
              <p>미리 준비된 샘플 데이터를 현재 데이터에 추가합니다.</p>
            </div>
            <Button variant="secondary" onClick={onLoadSample}>
              샘플 불러오기
            </Button>
          </div>

          <div className="settings-action-item">
            <div className="settings-action-info">
              <strong>JSON 백업 내보내기</strong>
              <p>현재 저장된 모든 데이터를 JSON 파일로 다운로드합니다.</p>
            </div>
            <Button
              variant="primary"
              onClick={onExport}
              disabled={items.length === 0}
            >
              JSON 내보내기
            </Button>
          </div>

          <div className="settings-action-item settings-action-danger">
            <div className="settings-action-info">
              <strong>전체 데이터 초기화</strong>
              <p>저장된 모든 데이터를 삭제합니다. 이 작업은 되돌릴 수 없습니다.</p>
            </div>
            <Button
              variant="danger"
              onClick={() => {
                if (
                  window.confirm(
                    '정말로 모든 데이터를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.'
                  )
                ) {
                  onResetData();
                }
              }}
              disabled={items.length === 0}
            >
              전체 초기화
            </Button>
          </div>
        </div>
      </Card>

      {/* 앱 정보 */}
      <Card title="앱 정보" className="mt-24">
        <div className="settings-info">
          <div className="settings-info-row">
            <span className="settings-info-label">버전</span>
            <span className="settings-info-value">1.0.0</span>
          </div>
          <div className="settings-info-row">
            <span className="settings-info-label">저장 방식</span>
            <span className="settings-info-value">Supabase (공용 DB)</span>
          </div>
          <div className="settings-info-row">
            <span className="settings-info-label">기술 스택</span>
            <span className="settings-info-value">React + Vite</span>
          </div>
        </div>
      </Card>
    </PageLayout>
  );
}
