import { useState, useMemo, useEffect } from 'react';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import PageLayout from '../components/layout/PageLayout';
import ImageModal from '../components/common/ImageModal';
import { STATUS_OPTIONS } from '../utils/constants';

const SORT_OPTIONS = [
  { value: 'acquiredDate_desc', label: '취득일자 최신순' },
  { value: 'acquiredDate_asc',  label: '취득일자 오래된순' },
  { value: 'assetNumber_asc',   label: '관리번호 오름차순' },
  { value: 'assetName_asc',     label: '품명 오름차순' },
];

const ALL_OPTION = { value: '', label: '전체' };

export default function SearchList({ items, onStartEdit, onDelete, initialStatus = '', onViewDetail }) {
  const [keyword, setKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState(initialStatus);
  const [sortKey, setSortKey] = useState('acquiredDate_desc');
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    setFilterStatus(initialStatus);
    setKeyword('');
  }, [initialStatus]);

  const filtered = useMemo(() => {
    let result = [...items];

    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      result = result.filter(
        (item) =>
          item.assetNumber.toLowerCase().includes(kw) ||
          item.assetName.toLowerCase().includes(kw)
      );
    }

    if (filterStatus) {
      result = result.filter((item) => item.status === filterStatus);
    }

    const [field, dir] = sortKey.split('_');
    result.sort((a, b) => {
      let av = a[field] || '';
      let bv = b[field] || '';
      av = av.toString().toLowerCase();
      bv = bv.toString().toLowerCase();
      if (av < bv) return dir === 'asc' ? -1 : 1;
      if (av > bv) return dir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [items, keyword, filterStatus, sortKey]);

  const handleReset = () => {
    setKeyword('');
    setFilterStatus('');
    setSortKey('acquiredDate_desc');
  };

  const columns = [
    {
      key: 'imageUrl',
      label: '사진',
      width: '56px',
      render: (val) =>
        val ? (
          <img
            src={val}
            alt="사진"
            className="asset-thumbnail"
            style={{ cursor: 'zoom-in' }}
            onClick={(e) => {
              e.stopPropagation();
              setModalImage(val);
            }}
          />
        ) : (
          <div className="asset-thumbnail-placeholder">📦</div>
        ),
    },
    { key: 'assetNumber', label: '관리번호' },
    { key: 'assetName',   label: '품명' },
    { key: 'acquiredDate', label: '취득일자', width: '100px', render: (val) => val || '-' },
    { key: 'location',    label: '위치', width: '70px' },
    {
      key: 'status',
      label: '상태',
      width: '80px',
      render: (val) => (
        <span className={`badge badge-${val}`}>{val}</span>
      ),
    },
  ];

  return (
    <PageLayout title="검색 / 목록">
      <Card title="검색 및 필터">
        <div className="search-grid">
          <Input
            label="검색어"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="관리번호 또는 품명 검색"
          />
          <Select
            label="상태"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[ALL_OPTION, ...STATUS_OPTIONS]}
            placeholder={null}
          />
          <Select
            label="정렬"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            options={SORT_OPTIONS}
            placeholder={null}
          />
        </div>
        <div className="search-footer">
          <span className="result-count">
            검색 결과: <strong>{filtered.length}</strong>건 / 전체 {items.length}건
          </span>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            필터 초기화
          </Button>
        </div>
      </Card>

      <Card className="mt-24" noPadding>
        <Table
          columns={columns}
          data={filtered}
          onEdit={onStartEdit}
          onDelete={(row) => onDelete(row.id)}
          onRowClick={onViewDetail ? (row) => onViewDetail(row.id) : undefined}
          emptyText="검색 결과가 없습니다."
        />
      </Card>

      {/* 이미지 확대 모달 */}
      {modalImage && (
        <ImageModal
          src={modalImage}
          alt="자산 사진"
          onClose={() => setModalImage(null)}
        />
      )}
    </PageLayout>
  );
}
