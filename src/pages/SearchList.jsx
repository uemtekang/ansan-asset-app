import { useState, useMemo } from 'react';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import PageLayout from '../components/layout/PageLayout';
import { CATEGORY_OPTIONS, STATUS_OPTIONS } from '../utils/constants';
import { formatDate } from '../utils/helpers';

const SORT_OPTIONS = [
  { value: 'createdAt_desc', label: '최신 등록순' },
  { value: 'createdAt_asc', label: '오래된 등록순' },
  { value: 'updatedAt_desc', label: '최근 수정순' },
  { value: 'title_asc', label: '제목 오름차순' },
  { value: 'title_desc', label: '제목 내림차순' },
];

const ALL_OPTION = { value: '', label: '전체' };

export default function SearchList({ items, onStartEdit, onDelete }) {
  const [keyword, setKeyword] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortKey, setSortKey] = useState('createdAt_desc');

  const filtered = useMemo(() => {
    let result = [...items];

    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(kw) ||
          (item.memo && item.memo.toLowerCase().includes(kw))
      );
    }

    if (filterCategory) {
      result = result.filter((item) => item.category === filterCategory);
    }

    if (filterStatus) {
      result = result.filter((item) => item.status === filterStatus);
    }

    const [field, dir] = sortKey.split('_');
    result.sort((a, b) => {
      let av = a[field] || '';
      let bv = b[field] || '';
      if (field === 'createdAt' || field === 'updatedAt') {
        av = new Date(av);
        bv = new Date(bv);
      } else {
        av = av.toString().toLowerCase();
        bv = bv.toString().toLowerCase();
      }
      if (av < bv) return dir === 'asc' ? -1 : 1;
      if (av > bv) return dir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [items, keyword, filterCategory, filterStatus, sortKey]);

  const handleReset = () => {
    setKeyword('');
    setFilterCategory('');
    setFilterStatus('');
    setSortKey('createdAt_desc');
  };

  const columns = [
    { key: 'title', label: '제목' },
    {
      key: 'category',
      label: '카테고리',
      width: '110px',
      render: (val) =>
        CATEGORY_OPTIONS.find((c) => c.value === val)?.label || val,
    },
    {
      key: 'status',
      label: '상태',
      width: '90px',
      render: (val) => (
        <span className={`badge badge-${val}`}>
          {STATUS_OPTIONS.find((s) => s.value === val)?.label || val}
        </span>
      ),
    },
    { key: 'memo', label: '메모', render: (val) => val || '-' },
    {
      key: 'createdAt',
      label: '등록일',
      width: '150px',
      render: (val) => formatDate(val),
    },
    {
      key: 'updatedAt',
      label: '수정일',
      width: '150px',
      render: (val) => formatDate(val),
    },
  ];

  return (
    <PageLayout title="검색 / 목록">
      {/* 필터 영역 */}
      <Card title="검색 및 필터">
        <div className="search-grid">
          <Input
            label="검색어"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="제목 또는 메모로 검색"
          />
          <Select
            label="카테고리"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            options={[ALL_OPTION, ...CATEGORY_OPTIONS]}
            placeholder={null}
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

      {/* 목록 테이블 */}
      <Card className="mt-24" noPadding>
        <Table
          columns={columns}
          data={filtered}
          onEdit={onStartEdit}
          onDelete={(row) => onDelete(row.id)}
          emptyText="검색 결과가 없습니다."
        />
      </Card>
    </PageLayout>
  );
}
