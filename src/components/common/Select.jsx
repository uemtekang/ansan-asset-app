/**
 * Select
 * props:
 *   label, value, onChange, options ([{value, label}]), name, id, disabled, required, placeholder, error
 */
export default function Select({
  label,
  value,
  onChange,
  options = [],
  name,
  id,
  disabled = false,
  required = false,
  placeholder = '선택하세요',
  error = '',
  className = '',
}) {
  const selectId = id || name;
  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label htmlFor={selectId} className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`form-select ${error ? 'input-error' : ''}`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
