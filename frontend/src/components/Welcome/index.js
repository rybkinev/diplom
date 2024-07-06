import React from "react";
import './index.css'
import {useSelector} from "react-redux";
import {Link, Outlet} from "react-router-dom";


const Welcome = () => {
  // const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const isAuthenticated = true;

  return (
    <main>
      {/*Вкладки для приватной и публичной таблиц*/}
      {isAuthenticated &&
        <>
          <Link to="/">Home</Link>
          <Link to="private">Private</Link>
        </>
      }

      <Outlet/>

    </main>
  )
}

export default Welcome;
