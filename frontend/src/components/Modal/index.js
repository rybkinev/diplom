import React, {useEffect, useState} from "react";
import './index.css';
import {createPortal} from "react-dom";


const Modal = ({children, onClose}) => {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.classList.add('no-scroll');

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.classList.remove('no-scroll');
    };
  }, [onClose]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Длительность закрывающей анимации
  };



  return(
    createPortal (
      <div
        className={`modal-background ${closing ? 'fade-out' : ''}`}
        // onClick={handleClose}
      >
        <div
          className={`modal-container ${closing ? 'fade-out' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className='btn-close'
            onClick={handleClose}
          >
            {/*&times;*/}
            X
          </button>
          <div className='modal'>
            {children}
          </div>
        </div>
      </div>,
      document.body
    )
  )
}


export default Modal;
