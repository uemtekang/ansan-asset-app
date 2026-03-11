import { MENU_CONFIG } from '../../data/menuConfig';

export default function Sidebar({ currentPage, onNavigate }) {
  return (
    <>
      {/* 데스크탑: 왼쪽 사이드바 */}
      <aside className="sidebar">
        <nav className="sidebar-nav">
          {MENU_CONFIG.map((menu) => (
            <button
              key={menu.key}
              className={`sidebar-item ${currentPage === menu.key ? 'active' : ''}`}
              onClick={() => onNavigate(menu.key)}
            >
              <span className="sidebar-icon">{menu.icon}</span>
              <span className="sidebar-label">{menu.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* 모바일: 하단 고정 탭바 */}
      <nav className="mobile-tabbar">
        {MENU_CONFIG.map((menu) => (
          <button
            key={menu.key}
            className={`mobile-tab ${currentPage === menu.key ? 'active' : ''}`}
            onClick={() => onNavigate(menu.key)}
          >
            <span className="mobile-tab-icon">{menu.icon}</span>
            <span className="mobile-tab-label">{menu.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
