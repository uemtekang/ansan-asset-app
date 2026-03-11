import { APP_TITLE } from '../../utils/constants';

export default function Header({ currentPage, onNavigate }) {
  return (
    <header className="header">
      <div className="header-left">
        <span className="header-logo">⚡</span>
        <span className="header-title">{APP_TITLE}</span>
      </div>
      <div className="header-right">
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => onNavigate('settings')}
          title="설정"
        >
          ⚙️ 설정
        </button>
      </div>
    </header>
  );
}
