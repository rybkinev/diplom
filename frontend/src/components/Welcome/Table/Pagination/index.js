import React from "react";
import './index.css';


const Pagination = ({totalPages, setCurrentPage, currentPage}) => {

  return(
    totalPages > 1 &&
      <div className="pagination-container">
        {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={page === currentPage ? 'active' : ''}
          >
            {page}
          </button>
        ))}
      </div>
  )
}

export default Pagination;
