import { MENU_CONFIG } from '../../data/menuConfig';

export default function Sidebar({ currentPage, onNavigate }) {
  return (
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
  );
}
