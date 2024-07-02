import React from "react";
import './index.css';


const Footer = () => {
  const phoneNumber = '+7-8352-20-12-09';

  return (
    <footer>
      <address>
        <p>
          <a href={'tel:' + phoneNumber}>{phoneNumber}</a> , telegram
        </p>
      </address>
      <p className='copyright'>
        Мой Силант. 2022
      </p>
    </footer>
  )
}

export default Footer;
