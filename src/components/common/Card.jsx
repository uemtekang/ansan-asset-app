/**
 * Card
 * props:
 *   title, children, footer, className, noPadding
 */
export default function Card({
  title,
  children,
  footer,
  className = '',
  noPadding = false,
}) {
  return (
    <div className={`card ${className}`}>
      {title && (
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
        </div>
      )}
      <div className={`card-body ${noPadding ? 'no-padding' : ''}`}>
        {children}
      </div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}
