import React from "react";
import './index.css';
import {Link, Outlet} from "react-router-dom";


const Private = () => {
  return (
    <div className='main-private-container'>
      <h1>PRIVATE</h1>

      <Link to="vehicles">Vehicles</Link>
      <Link to="maintenance">Maintenance</Link>
      <Link to="complaints">Complaints</Link>

      <Outlet/>
    </div>
  )
}

export default Private;