import React from 'react';
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
import ModelDetail from "../Welcome/ModelDetail";
import ComplaintDetail from "../Welcome/Private/Complaints/ComplaintDetail";
import MaintenanceDetail from "../Welcome/Private/Maintenance/MaintenanceDetail";


const App = () => {
  const location = useLocation();
  const navigate = useNavigate();


  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  // const isAuthenticated = true;

  const state = location.state;
  const background = state && state.background;

  const modelsRoutes = [
    {url: '/vehicles/vehicle-model/', title: 'модели машины', editPermission: 'change_vehiclemodel'},
    {url: '/vehicles/engine-model/', title: 'модели двигателя', editPermission: 'change_enginemodel'},
    {url: '/vehicles/transmission-model/', title: 'модели трансмиссии', editPermission: 'change_transmissionmodel'},
    {url: '/vehicles/drive-axle-model/', title: 'модели ведущего моста', editPermission: 'change_driveaxlemodel'},
    {url: '/vehicles/steering-axle-model/', title: 'модели управляемого моста', editPermission: 'change_steeringaxlemodel'},
    {url: '/maintenance/maintenance-type/', title: 'вида ТО', editPermission: 'change_maintenancetype'},
    {url: '/maintenance/organizations/', title: 'организации', editPermission: 'change_organizations'},
    {url: '/complaint/failure-node/', title: 'неисправного узла', editPermission: 'change_failurenode'},
    {url: '/complaint/recovery-method/', title: 'метода восстановления', editPermission: 'change_recoverymethod'},
  ]

  const handleCloseModal = () => {
    navigate(-1);
  };

  return (
    <>
      <Header/>

      <Routes location={background || location}>
        <Route path="/" element={<Welcome/>}>
          <Route index element={<Public />}/>
          <Route path="vehicles/:id" element={<VehicleDetail/>}/>
          {/*<Route*/}
          {/*  path='/vehicles/vehicle-model/:id'*/}
          {/*  element={<ModelDetail title='модели машины' url={'/vehicles/vehicle-model/'}/>}*/}
          {/*/>*/}
          {modelsRoutes.map((row, index) =>
            <Route
              path={`${row.url}:id`}
              element={<ModelDetail
                title={row.title}
                url={row.url}
                editPermission={row.editPermission}
              />}
              key={index}
            />
          )}

          {isAuthenticated
            ? <Route path="private" element={<Private/>}>
                <Route index element={<Navigate to="vehicles"/>}/>
                <Route path="vehicles" element={<Vehicles/>}/>
                <Route index element={<Vehicles/>}/>

                <Route path="maintenance" element={<Maintenance/>}/>
                <Route path="maintenance/:id" element={<MaintenanceDetail/>}/>
                <Route path="maintenance/new" element={<MaintenanceDetail/>}/>

                <Route path="complaints" element={<Complaints/>}/>
                <Route path="complaints/:id" element={<ComplaintDetail/>}/>
                <Route path="complaints/new" element={<ComplaintDetail/>}/>
              </Route>

            : <Route path='login' element={<Auth/>}/>
          }
        </Route>

        <Route path="/swagger" element={<Swagger/>}/>
        <Route path="*" element={<Navigate to="/" />}/>
      </Routes>

      {background && (
        <Routes>
          <Route
            path='login'
            element={
              <Modal onClose={handleCloseModal}>
                <Auth/>
              </Modal>
            }
          />
          <Route
            path="/vehicles/:id"
            element={
              <Modal onClose={handleCloseModal}>
                <VehicleDetail />
              </Modal>
            }
          />
          <Route path="private" element={<Private/>}>
            <Route path="maintenance/:id" element={
              <Modal onClose={handleCloseModal}>
                <MaintenanceDetail/>
              </Modal>
            }/>
            {/*<Route path="complaints/new" element={<EditComplaint/>}/>*/}
          </Route>
          <Route path="private" element={<Private/>}>
            <Route path="complaints/:id" element={
              <Modal onClose={handleCloseModal}>
                <ComplaintDetail/>
              </Modal>
            }/>
            {/*<Route path="complaints/new" element={<ComplaintDetail/>}/>*/}
          </Route>


          {modelsRoutes.map((row, index) =>
            <Route
              key={index}
              path={`${row.url}:id`}
              element={
                <Modal onClose={handleCloseModal}>
                  <ModelDetail
                    title={row.title}
                    url={row.url}
                    editPermission={row.editPermission}
                  />
                </Modal>
              }
            />
          )}
        </Routes>
      )}

      <Footer/>
    </>
  )
}


export default App;
