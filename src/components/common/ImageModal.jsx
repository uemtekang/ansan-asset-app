import { useEffect } from 'react';

export default function ImageModal({ src, alt, onClose }) {
  // ESC 키로 닫기
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = alt || 'image';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // CORS 등 fetch 실패 시 새 탭에서 열기
      window.open(src, '_blank');
    }
  };

  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="image-modal-close" onClick={onClose} aria-label="닫기">
          ✕
        </button>
        <img src={src} alt={alt || '사진'} />
        <div className="image-modal-actions">
          <button className="btn btn-secondary btn-sm" onClick={handleDownload}>
            다운로드
          </button>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
