import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import PageLayout from '../components/layout/PageLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ImageModal from '../components/common/ImageModal';

const fromDB = (row) => ({
  id: row.id,
  assetNumber: row.asset_number,
  assetName: row.asset_name,
  acquiredDate: row.acquired_date || '',
  location: row.location || '',
  status: row.status,
  memo: row.memo || '',
  imageUrl: row.image_url || null,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export default function AssetDetail({ assetId, onNavigate, onStartEdit }) {
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!assetId) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const fetchAsset = async () => {
      setLoading(true);
      setNotFound(false);
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('id', assetId)
        .single();

      if (error || !data) {
        console.error('AssetDetail fetch error:', error?.message);
        setNotFound(true);
      } else {
        setAsset(fromDB(data));
      }
      setLoading(false);
    };

    fetchAsset();
  }, [assetId]);

  if (loading) {
    return (
      <PageLayout title="자산 상세">
        <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
          불러오는 중...
        </div>
      </PageLayout>
    );
  }

  if (notFound || !asset) {
    return (
      <PageLayout title="자산 상세">
        <Card>
          <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
            자산 정보를 찾을 수 없습니다.
          </div>
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Button variant="ghost" onClick={() => onNavigate('searchList')}>
              목록으로 돌아가기
            </Button>
          </div>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="자산 상세"
      actions={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('searchList')}>
            목록으로
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onStartEdit(asset)}>
            수정
          </Button>
        </div>
      }
    >
      {/* 사진 영역 */}
      <Card title="사진">
        {asset.imageUrl ? (
          <div>
            <div
              className="detail-photo"
              style={{ cursor: 'zoom-in' }}
              onClick={() => setModalOpen(true)}
            >
              <img src={asset.imageUrl} alt={asset.assetName} />
            </div>
            <div style={{ marginTop: '10px' }}>
              <Button variant="secondary" size="sm" onClick={() => setModalOpen(true)}>
                크게 보기 / 다운로드
              </Button>
            </div>
          </div>
        ) : (
          <div className="detail-photo-placeholder">
            등록된 사진이 없습니다.
          </div>
        )}
      </Card>

      {/* 이미지 확대 모달 */}
      {modalOpen && (
        <ImageModal
          src={asset.imageUrl}
          alt={asset.assetName}
          onClose={() => setModalOpen(false)}
        />
      )}

      {/* 기본 정보 */}
      <Card title="기본 정보" className="mt-24">
        <dl className="detail-grid">
          <dt>관리번호</dt>
          <dd>{asset.assetNumber || '-'}</dd>

          <dt>품명</dt>
          <dd>{asset.assetName || '-'}</dd>

          <dt>상태</dt>
          <dd>
            <span className={`badge badge-${asset.status}`}>{asset.status}</span>
          </dd>

          <dt>위치</dt>
          <dd>{asset.location || '-'}</dd>

          <dt>취득일자</dt>
          <dd>{asset.acquiredDate || '-'}</dd>

          <dt>메모</dt>
          <dd>{asset.memo || '-'}</dd>

          <dt>등록일</dt>
          <dd>{asset.createdAt ? asset.createdAt.slice(0, 10) : '-'}</dd>
        </dl>
      </Card>
    </PageLayout>
  );
}
