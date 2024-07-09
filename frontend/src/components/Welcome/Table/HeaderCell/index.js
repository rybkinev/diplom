import React, {useState} from "react";
import './index.css';


const HeaderCell = ({sortConfig, setSortConfig, name, searchInput, children}) => {
  // const [directionAsc, setDirectionAsc] = useState(sortConfig.direction === 'asc')

  // const handleSort = (key) => {
  //   // if (sortConfig.key === key && sortConfig.direction === 'asc') {
  //   // setDirectionAsc(!directionAsc);
  //   // const direction = !directionAsc ? 'asc' : 'desc';
  //
  //   setSortConfig({ key, direction });
  // }
  const handleSort = () => {
    let direction = 'asc';
    if (sortConfig.key === name && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: name, direction });
  }

  const handleDirection = (e) => {
    const direction = e.currentTarget.dataset.direction;

    if (sortConfig.key === name && sortConfig.direction === direction) {
      return;
    }
    setSortConfig({ key: name, direction });
  }

  const getActiveClassName = (directionElement) => {
    if (sortConfig.key !== name) {
      return '';
    }
    if ((directionElement === 'asc' && sortConfig.direction === 'asc') ||
      (directionElement === 'desc' && sortConfig.direction === 'desc')
    ) {
      return 'active';
    }
    return '';
  }

  return (
    <td className='table-head-cell'>
      <div className='head-cell'>
        <div className='head-cell-name'>
          <span
            onClick={handleSort}
          >
            {children}
          </span>
          <div className='direction-container'>
            <button
              className={`direction ${getActiveClassName('asc')}`}
              data-direction='asc'
              onClick={handleDirection}
            >
              {'<'}
            </button>
            <button
              className={`direction ${getActiveClassName('desc')}`}
              data-direction='desc'
              onClick={handleDirection}
            >
              {'>'}
            </button>
          </div>
        </div>
        <div className='head-cell-search'>
          {searchInput}
        </div>
      </div>
    </td>
  )
}

export default HeaderCell;