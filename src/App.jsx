import { useState } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import DataManager from './pages/DataManager';
import SearchList from './pages/SearchList';
import Settings from './pages/Settings';
import { useSupabaseAssets } from './hooks/useSupabaseAssets';
import { generateId } from './utils/helpers';
import { exportToJson } from './utils/export';
import { SAMPLE_DATA } from './data/sampleData';
import './styles/app.css';

export default function App() {
  const { items, loading, addItem, updateItem, deleteItem, resetData, insertMany } =
    useSupabaseAssets();
  const [currentPage, setCurrentPage] = useState('searchList');
  const [editingItem, setEditingItem] = useState(null);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    if (page !== 'dataManager') setEditingItem(null);
  };

  const handleAddItem = async (formData) => {
    const now = new Date().toISOString();
    const newItem = { id: generateId(), ...formData, createdAt: now, updatedAt: now };
    try {
      await addItem(newItem);
    } catch (e) {
      alert('등록 실패: ' + e.message);
    }
  };

  const handleUpdateItem = async (id, formData) => {
    try {
      await updateItem(id, formData);
      setEditingItem(null);
    } catch (e) {
      alert('수정 실패: ' + e.message);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await deleteItem(id);
      if (editingItem?.id === id) setEditingItem(null);
    } catch (e) {
      alert('삭제 실패: ' + e.message);
    }
  };

  const startEditItem = (item) => {
    setEditingItem(item);
    setCurrentPage('dataManager');
  };

  const cancelEdit = () => setEditingItem(null);

  const handleResetData = async () => {
    try {
      await resetData();
      setEditingItem(null);
    } catch (e) {
      alert('초기화 실패: ' + e.message);
    }
  };

  const handleLoadSampleData = async () => {
    const existingIds = new Set(items.map((i) => i.id));
    const newSamples = SAMPLE_DATA.filter((s) => !existingIds.has(s.id));
    if (newSamples.length === 0) {
      alert('샘플 데이터가 이미 모두 등록되어 있습니다.');
      return;
    }
    try {
      await insertMany(newSamples);
      alert(`샘플 데이터 ${newSamples.length}건이 추가되었습니다.`);
    } catch (e) {
      alert('샘플 불러오기 실패: ' + e.message);
    }
  };

  const exportData = () => {
    if (items.length === 0) {
      alert('내보낼 데이터가 없습니다.');
      return;
    }
    exportToJson(items, 'ansan_asset_backup');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard items={items} onNavigate={handleNavigate} />;
      case 'dataManager':
        return (
          <DataManager
            items={items}
            editingItem={editingItem}
            onAdd={handleAddItem}
            onUpdate={handleUpdateItem}
            onDelete={handleDeleteItem}
            onCancelEdit={cancelEdit}
            onStartEdit={startEditItem}
          />
        );
      case 'searchList':
        return (
          <SearchList items={items} onStartEdit={startEditItem} onDelete={handleDeleteItem} />
        );
      case 'settings':
        return (
          <Settings
            items={items}
            onLoadSample={handleLoadSampleData}
            onResetData={handleResetData}
            onExport={exportData}
          />
        );
      default:
        return <Dashboard items={items} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="app-container">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <div className="app-body">
        <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
        <div className="app-main">
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
              데이터를 불러오는 중...
            </div>
          ) : (
            renderPage()
          )}
        </div>
      </div>
    </div>
  );
}
