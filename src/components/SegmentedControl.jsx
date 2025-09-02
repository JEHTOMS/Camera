import React from 'react';
import PropTypes from 'prop-types';
import './SegmentedControl.css';

const SegmentedControl = ({ 
  options, 
  value, 
  onChange, 
  name = 'segmented-control',
  className = '',
  disabled = false 
}) => {
  return (
    <div
      className={`segmented-controls ${className} ${options?.length === 3 ? 'three-options' : ''}`}
      data-active={value}
      style={{ '--options-count': options?.length || 2 }}
    >
      {options.map((option) => (
        <React.Fragment key={option.value}>
          <input
            id={`${name}-${option.value}`}
            name={name}
            type="radio"
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            disabled={disabled}
          />
          <label htmlFor={`${name}-${option.value}`}>
            {option.label}
          </label>
        </React.Fragment>
      ))}
    </div>
  );
};

SegmentedControl.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default SegmentedControl;