export default function PageLayout({ title, children, actions }) {
  return (
    <main className="page-layout">
      <div className="page-header">
        <h2 className="page-title">{title}</h2>
        {actions && <div className="page-actions">{actions}</div>}
      </div>
      <div className="page-content">{children}</div>
    </main>
  );
}
