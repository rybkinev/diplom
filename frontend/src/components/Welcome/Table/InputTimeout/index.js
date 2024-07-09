import React, {useRef} from "react";
import './index.css';


const CustomInput = (
  {placeholder,
    name,
    value,
    filterInput,
    setFilterInput,
    setFilters,
    timeout,
  }) => {

  if (!timeout) timeout = 700;
  const delayTimer = useRef(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilterInput({ ...filterInput, [name]: value });

    if (delayTimer.current) {
      clearTimeout(delayTimer.current);
    }

    delayTimer.current = setTimeout(() => {
      setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    }, timeout);
  };

  const handleClear = () => {
    setFilterInput({ ...filterInput, [name]: '' });

    if (delayTimer.current) {
      clearTimeout(delayTimer.current);
    }

    setFilters(prevFilters => ({ ...prevFilters, [name]: '' }));
  };


  return (
    <div className="clearable-input">
      <input
        type="text"
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={handleFilterChange}
        className='custom-input'
      />
      {value && (
        <button onClick={handleClear} className="clear-button">
          x
        </button>
      )}

    </div>
  )
}

export default CustomInput;
