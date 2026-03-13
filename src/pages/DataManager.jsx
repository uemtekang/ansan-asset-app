import { useState, useEffect } from 'react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import PageLayout from '../components/layout/PageLayout';
import { STATUS_OPTIONS } from '../utils/constants';
import { supabase } from '../lib/supabase';

const EMPTY_FORM = {
  assetNumber: '',
  assetName: '',
  acquiredDate: '',
  location: '창고',
  status: '보관중',
  memo: '',
  imageUrl: '',
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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const isEditing = !!editingItem;

  useEffect(() => {
    if (editingItem) {
      setForm({
        assetNumber:  editingItem.assetNumber  || '',
        assetName:    editingItem.assetName    || '',
        acquiredDate: editingItem.acquiredDate || '',
        location:     editingItem.location     || '창고',
        status:       editingItem.status       || '보관중',
        memo:         editingItem.memo         || '',
        imageUrl:     editingItem.imageUrl     || '',
      });
      setImageFile(null);
      setImagePreview('');
      setErrors({});
    } else {
      setForm(EMPTY_FORM);
      setImageFile(null);
      setImagePreview('');
      setErrors({});
    }
  }, [editingItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview('');
    setForm((prev) => ({ ...prev, imageUrl: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.assetNumber.trim()) newErrors.assetNumber = '관리번호를 입력하세요.';
    if (!form.assetName.trim())   newErrors.assetName   = '품명을 입력하세요.';
    if (!form.status)             newErrors.status      = '상태를 선택하세요.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    let imageUrl = form.imageUrl || '';

    if (imageFile) {
      setUploading(true);
      const safeName = imageFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const fileName = `${Date.now()}_${safeName}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('asset-images')
        .upload(fileName, imageFile, { upsert: true });

      if (uploadError) {
        alert('사진 업로드 실패: ' + uploadError.message);
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('asset-images')
        .getPublicUrl(uploadData.path);
      imageUrl = urlData.publicUrl;
      setUploading(false);
    }

    const submitForm = { ...form, imageUrl };

    if (isEditing) {
      onUpdate(editingItem.id, submitForm);
    } else {
      onAdd(submitForm);
    }
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview('');
    setErrors({});
  };

  const handleReset = () => {
    if (isEditing) {
      setForm({
        assetNumber:  editingItem.assetNumber  || '',
        assetName:    editingItem.assetName    || '',
        acquiredDate: editingItem.acquiredDate || '',
        location:     editingItem.location     || '창고',
        status:       editingItem.status       || '보관중',
        memo:         editingItem.memo         || '',
        imageUrl:     editingItem.imageUrl     || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setImageFile(null);
    setImagePreview('');
    setErrors({});
  };

  const handleCancelEdit = () => {
    onCancelEdit();
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview('');
    setErrors({});
  };

  const tableColumns = [
    { key: 'assetNumber', label: '관리번호' },
    { key: 'assetName',   label: '품명' },
    { key: 'acquiredDate', label: '취득일자', width: '100px', render: (val) => val || '-' },
    { key: 'location',    label: '위치', width: '80px' },
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
    <PageLayout title={isEditing ? '자산 수정' : '자산 등록'}>
      <Card title={isEditing ? `수정 중: ${editingItem.assetName}` : '새 자산 등록'}>
        {isEditing && (
          <div className="edit-notice">
            수정 모드입니다. 변경 후 저장하거나 취소하세요.
          </div>
        )}
        <form onSubmit={handleSubmit} className="data-form">
          <div className="form-row form-row-2col">
            <Input
              label="관리번호"
              name="assetNumber"
              value={form.assetNumber}
              onChange={handleChange}
              placeholder="예: 2023-001234"
              required
              error={errors.assetNumber}
            />
            <Input
              label="품명"
              name="assetName"
              value={form.assetName}
              onChange={handleChange}
              placeholder="예: 노트북"
              required
              error={errors.assetName}
            />
          </div>
          <div className="form-row form-row-2col">
            <Input
              label="취득일자"
              name="acquiredDate"
              type="date"
              value={form.acquiredDate}
              onChange={handleChange}
            />
            <Input
              label="위치"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="창고"
            />
          </div>
          <div className="form-row">
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
            <label className="form-label">비고</label>
            <textarea
              name="memo"
              value={form.memo}
              onChange={handleChange}
              placeholder="비고 사항 (선택)"
              className="form-textarea"
              rows={3}
            />
          </div>
          <div className="form-row">
            <label className="form-label">사진</label>
            <label className="photo-upload-label">
              사진 선택
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            </label>
            {(imagePreview || form.imageUrl) && (
              <div className="photo-upload-preview">
                <img
                  src={imagePreview || form.imageUrl}
                  alt="미리보기"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleImageRemove}
                  style={{ marginTop: '6px' }}
                >
                  사진 삭제
                </Button>
              </div>
            )}
          </div>
          <div className="form-actions">
            <Button type="submit" variant="primary" disabled={uploading}>
              {uploading ? '업로드 중...' : (isEditing ? '수정 저장' : '등록')}
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

      <Card title={`등록 목록 (${items.length}건)`} className="mt-24">
        <Table
          columns={tableColumns}
          data={items}
          onEdit={onStartEdit}
          onDelete={(row) => onDelete(row.id)}
          emptyText="등록된 자산이 없습니다. 위 폼에서 등록하세요."
        />
      </Card>
    </PageLayout>
  );
}
