import React from "react";
import './index.css'
import Public from "./Public";
import {useSelector} from "react-redux";


const Welcome = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  return (
    <Public/>
  )
}

export default Welcome;
