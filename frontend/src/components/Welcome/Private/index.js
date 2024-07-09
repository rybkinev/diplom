import React from "react";
import './index.css';
import {NavLink, Outlet} from "react-router-dom";


const Private = () => {

  return (
    <div className='main-private-container'>
      <div className='client-info'>
        {/*Покупатель: ООО "ФПК21"*/}
        <h3>Сервисная компания: ООО Силант</h3>
        {/*Менеджер: Самый главный*/}
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
