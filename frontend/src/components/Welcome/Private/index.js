import React from "react";
import './index.css';
import {NavLink, Outlet} from "react-router-dom";
import {useSelector} from "react-redux";


const Private = () => {
  const userName = useSelector((state) => state.user.user);
  const userType = useSelector((state) => state.user.userType);


  return (
    <div className='main-private-container'>
      <div className='client-info'>
        <span>Вы авторизованы как: </span>
        <h3>{userType}{userName ? `: ${userName}` : '' }</h3>
      </div>

      <div className='private-navigate'>
        <NavLink to="vehicles">Машины</NavLink>
        <NavLink to="maintenance">ТО</NavLink>
        <NavLink to="complaints">Рекламации</NavLink>
      </div>

      <Outlet/>
    </div>
  )
}

export default Private;
