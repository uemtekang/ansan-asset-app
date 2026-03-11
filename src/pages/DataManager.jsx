import { useState, useEffect } from 'react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import PageLayout from '../components/layout/PageLayout';
import { CATEGORY_OPTIONS, STATUS_OPTIONS } from '../utils/constants';
import { formatDate } from '../utils/helpers';

const EMPTY_FORM = {
  title: '',
  category: 'general',
  status: 'active',
  memo: '',
};

export default function DataManager({
  items,
  editingItem,
  onAdd,
  onUpdate,
  onDelete,
  onCancelEdit,
  onStartEdit,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const isEditing = !!editingItem;

  // editingItem 변경 시 폼 자동 채우기
  useEffect(() => {
    if (editingItem) {
      setForm({
        title: editingItem.title || '',
        category: editingItem.category || 'general',
        status: editingItem.status || 'active',
        memo: editingItem.memo || '',
      });
      setErrors({});
    } else {
      setForm(EMPTY_FORM);
      setErrors({});
    }
  }, [editingItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = '제목을 입력하세요.';
    if (!form.category) newErrors.category = '카테고리를 선택하세요.';
    if (!form.status) newErrors.status = '상태를 선택하세요.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    if (isEditing) {
      onUpdate(editingItem.id, form);
    } else {
      onAdd(form);
    }
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const handleReset = () => {
    if (isEditing) {
      setForm({
        title: editingItem.title || '',
        category: editingItem.category || 'general',
        status: editingItem.status || 'active',
        memo: editingItem.memo || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  };

  const handleCancelEdit = () => {
    onCancelEdit();
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const tableColumns = [
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
    {
      key: 'updatedAt',
      label: '수정일',
      width: '150px',
      render: (val) => formatDate(val),
    },
  ];

  return (
    <PageLayout title={isEditing ? '데이터 수정' : '데이터 등록'}>
      {/* 입력 폼 */}
      <Card title={isEditing ? `수정 중: ${editingItem.title}` : '새 항목 등록'}>
        {isEditing && (
          <div className="edit-notice">
            ✏️ 수정 모드입니다. 변경 후 저장하거나 취소하세요.
          </div>
        )}
        <form onSubmit={handleSubmit} className="data-form">
          <div className="form-row">
            <Input
              label="제목"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="제목을 입력하세요"
              required
              error={errors.title}
            />
          </div>
          <div className="form-row form-row-2col">
            <Select
              label="카테고리"
              name="category"
              value={form.category}
              onChange={handleChange}
              options={CATEGORY_OPTIONS}
              placeholder=""
              required
              error={errors.category}
            />
            <Select
              label="상태"
              name="status"
              value={form.status}
              onChange={handleChange}
              options={STATUS_OPTIONS}
              placeholder=""
              required
              error={errors.status}
            />
          </div>
          <div className="form-row">
            <label className="form-label">메모</label>
            <textarea
              name="memo"
              value={form.memo}
              onChange={handleChange}
              placeholder="메모를 입력하세요 (선택)"
              className="form-textarea"
              rows={3}
            />
          </div>
          <div className="form-actions">
            <Button type="submit" variant="primary">
              {isEditing ? '수정 저장' : '등록'}
            </Button>
            <Button type="button" variant="secondary" onClick={handleReset}>
              초기화
            </Button>
            {isEditing && (
              <Button type="button" variant="danger" onClick={handleCancelEdit}>
                수정 취소
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* 등록 목록 */}
      <Card title={`등록 목록 (${items.length}건)`} className="mt-24">
        <Table
          columns={tableColumns}
          data={items}
          onEdit={onStartEdit}
          onDelete={(row) => onDelete(row.id)}
          emptyText="등록된 데이터가 없습니다. 위 폼에서 등록하세요."
        />
      </Card>
    </PageLayout>
  );
}
