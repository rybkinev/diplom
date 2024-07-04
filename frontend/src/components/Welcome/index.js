import React from "react";
import './index.css'
import UnAuth from "./UnAuth";
import {useSelector} from "react-redux";


const Welcome = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  return (
    <UnAuth/>
  )
}

export default Welcome;
