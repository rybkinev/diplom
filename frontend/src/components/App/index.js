import React, {useEffect} from 'react';
import './index.css';
import Header from "../Header";
import {Navigate, Route, Routes} from "react-router-dom";
import {useSelector} from "react-redux";
import Footer from "../Footer";
import Welcome from "../Welcome";
import Swagger from "../Swagger";
import Public from "../Welcome/Public";
import Private from "../Welcome/Private";
import Vehicles from "../Welcome/Private/Vehicles";
import Maintenance from "../Welcome/Private/Maintenance";
import Complaints from "../Welcome/Private/Complaints";

const App = () => {
  // const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const isAuthenticated = true;

  return (
    <>
      <Header/>

      <Routes>
        <Route path="/" element={<Welcome/>}>
          <Route path="/" element={<Public/>} />
          {isAuthenticated &&
            <Route path="private" element={<Private/>}>
              <Route path="" element={<Navigate to="vehicles" />} />
              <Route path="vehicles" element={<Vehicles/>} />
              <Route path="maintenance" element={<Maintenance/>} />
              <Route path="complaints" element={<Complaints/>} />
            </Route>
          }
        </Route>

        <Route path="/swagger" element={<Swagger/>}/>
        <Route path="*" element={<Navigate to="/" />}/>
      </Routes>

      <Footer/>
    </>
  )
}


export default App;