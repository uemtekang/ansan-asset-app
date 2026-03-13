/**
 * Table
 * props:
 *   columns: [{ key, label, width, render }]
 *   data: array of row objects
 *   onEdit: (row) => void  (optional)
 *   onDelete: (row) => void  (optional)
 *   emptyText: string
 */
export default function Table({
  columns = [],
  data = [],
  onEdit,
  onDelete,
  onRowClick,
  emptyText = '데이터가 없습니다.',
}) {
  const hasActions = onEdit || onDelete;

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={col.width ? { width: col.width } : {}}>
                {col.label}
              </th>
            ))}
            {hasActions && <th style={{ width: '120px' }}>작업</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (hasActions ? 1 : 0)}
                className="table-empty"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={row.id || rowIdx}
                className={onRowClick ? 'tr-clickable' : ''}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {hasActions && (
                  <td className="table-actions" onClick={(e) => e.stopPropagation()}>
                    {onEdit && (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => onEdit(row)}
                      >
                        수정
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          if (window.confirm('삭제하시겠습니까?')) {
                            onDelete(row);
                          }
                        }}
                      >
                        삭제
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
