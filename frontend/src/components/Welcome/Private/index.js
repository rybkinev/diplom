import React from "react";
import './index.css';
import {Link, Outlet} from "react-router-dom";


const Private = () => {

  return (
    <div className='main-private-container'>
      <h1>PRIVATE</h1>

      <Link to="vehicles">Машины</Link>
      <Link to="maintenance">ТО</Link>
      <Link to="complaints">Рекламации</Link>

      <Outlet/>
    </div>
  )
}

export default Private;
