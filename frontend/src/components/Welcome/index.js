import React from "react";
import './index.css'
import {useSelector} from "react-redux";
import {NavLink, Outlet} from "react-router-dom";


const Welcome = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  // const isAuthenticated = true;

  return (
    <main>
      {isAuthenticated &&
        <nav>
          <NavLink to="/">Главная</NavLink>
          <NavLink to="private">Личный кабинет</NavLink>
        </nav>
      }

      <Outlet/>

    </main>
  )
}

export default Welcome;
