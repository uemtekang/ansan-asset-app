import { useState } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import DataManager from './pages/DataManager';
import SearchList from './pages/SearchList';
import Analysis from './pages/Analysis';
import Settings from './pages/Settings';
import { useLocalStorage } from './hooks/useLocalStorage';
import { STORAGE_KEY } from './utils/constants';
import { generateId } from './utils/helpers';
import { exportToJson } from './utils/export';
import { SAMPLE_DATA } from './data/sampleData';
import './styles/app.css';

export default function App() {
  const [items, setItems, removeItems] = useLocalStorage(STORAGE_KEY, []);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [editingItem, setEditingItem] = useState(null);

  // 페이지 이동
  const handleNavigate = (page) => {
    setCurrentPage(page);
    // 다른 페이지로 이동 시 수정 상태 유지 (dataManager로 가는 경우 제외)
    if (page !== 'dataManager') {
      setEditingItem(null);
    }
  };

  // 항목 추가
  const addItem = (formData) => {
    const now = new Date().toISOString();
    const newItem = {
      id: generateId(),
      ...formData,
      createdAt: now,
      updatedAt: now,
    };
    setItems((prev) => [newItem, ...prev]);
  };

  // 항목 수정
  const updateItem = (id, formData) => {
    const now = new Date().toISOString();
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...formData, updatedAt: now } : item
      )
    );
    setEditingItem(null);
  };

  // 항목 삭제
  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (editingItem?.id === id) {
      setEditingItem(null);
    }
  };

  // 수정 시작 - SearchList / DataManager의 수정 버튼에서 호출
  const startEditItem = (item) => {
    setEditingItem(item);
    setCurrentPage('dataManager');
  };

  // 수정 취소
  const cancelEdit = () => {
    setEditingItem(null);
  };

  // 전체 초기화
  const resetData = () => {
    removeItems();
    setEditingItem(null);
  };

  // 샘플 데이터 로드
  const loadSampleData = () => {
    const existingIds = new Set(items.map((i) => i.id));
    const newSamples = SAMPLE_DATA.filter((s) => !existingIds.has(s.id));
    if (newSamples.length === 0) {
      alert('샘플 데이터가 이미 모두 등록되어 있습니다.');
      return;
    }
    setItems((prev) => [...newSamples, ...prev]);
    alert(`샘플 데이터 ${newSamples.length}건이 추가되었습니다.`);
  };

  // JSON 내보내기
  const exportData = () => {
    if (items.length === 0) {
      alert('내보낼 데이터가 없습니다.');
      return;
    }
    exportToJson(items, 'biz_template_backup');
  };

  // 페이지 렌더링
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            items={items}
            onNavigate={handleNavigate}
          />
        );
      case 'dataManager':
        return (
          <DataManager
            items={items}
            editingItem={editingItem}
            onAdd={addItem}
            onUpdate={updateItem}
            onDelete={deleteItem}
            onCancelEdit={cancelEdit}
            onStartEdit={startEditItem}
          />
        );
      case 'searchList':
        return (
          <SearchList
            items={items}
            onStartEdit={startEditItem}
            onDelete={deleteItem}
          />
        );
      case 'analysis':
        return <Analysis items={items} />;
      case 'settings':
        return (
          <Settings
            items={items}
            onLoadSample={loadSampleData}
            onResetData={resetData}
            onExport={exportData}
          />
        );
      default:
        return (
          <Dashboard
            items={items}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return (
    <div className="app-container">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <div className="app-body">
        <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
        <div className="app-main">{renderPage()}</div>
      </div>
    </div>
  );
}
