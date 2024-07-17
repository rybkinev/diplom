import React from "react";
import './index.css';


const Filter = ({children, handleCloseFilters}) => {
  return (
    <div className='filters'>
      <div className='head'>
        <h3>Доступные фильтры</h3>
        <a
          className='head-button-close'
          onClick={handleCloseFilters}
        >
          X
        </a>
      </div>
      <div className='filter-container'>
        {children}
      </div>
    </div>
  )
}

export default Filter;
