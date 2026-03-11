/**
 * Input
 * props:
 *   label, value, onChange, placeholder, type, name, id, disabled, required, error
 */
export default function Input({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  name,
  id,
  disabled = false,
  required = false,
  error = '',
  className = '',
}) {
  const inputId = id || name;
  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`form-input ${error ? 'input-error' : ''}`}
      />
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
