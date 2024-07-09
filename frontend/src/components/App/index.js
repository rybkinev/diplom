import React, {useEffect} from 'react';
import './index.css';
import Header from "../Header";
import {Navigate, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import Footer from "../Footer";
import Welcome from "../Welcome";
import Swagger from "../Swagger";
import Public from "../Welcome/Public";
import Private from "../Welcome/Private";
import Vehicles from "../Welcome/Private/Vehicles";
import Maintenance from "../Welcome/Private/Maintenance";
import Complaints from "../Welcome/Private/Complaints";
import VehicleDetail from "../Welcome/VehicleDetail";
import Auth from "../Auth";
import Modal from "../Modal";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();


  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  // const isAuthenticated = true;

  const state = location.state;
  const background = state && state.background;


  return (
    <>
      <Header/>

      <Routes location={background || location}>
        <Route path="/" element={<Welcome/>}>
          <Route index element={<Public />}/>
          <Route path="vehicles/:id" element={<VehicleDetail/>}/>
          <Route path='login' element={<Auth/>}/>

          {isAuthenticated &&
            <Route path="private" element={<Private/>}>
              <Route index element={<Navigate to="vehicles"/>}/>
              <Route path="vehicles">
                <Route index element={<Vehicles/>}/>
                <Route path=":id" element={<VehicleDetail/>}/>
              </Route>
              <Route path="maintenance" element={<Maintenance/>}/>
              <Route path="complaints" element={<Complaints/>}/>
            </Route>
          }
        </Route>

        <Route path="/swagger" element={<Swagger/>}/>
        <Route path="*" element={<Navigate to="/" />}/>
      </Routes>

      {background && (
        <Routes>
          <Route
            path="/vehicles/:id"
            element={
              <Modal onClose={() => navigate(-1)}>
                <VehicleDetail />
              </Modal>
            }
          />
          <Route
            path='login'
            element={
              <Modal onClose={() => navigate(-1)}>
                <Auth/>
              </Modal>
            }
          />
        </Routes>
      )}

      <Footer/>
    </>
  )
}


export default App;