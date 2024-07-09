import React, {useEffect, useState} from "react";
import './index.css';
import {NavLink, useParams} from "react-router-dom";
import api from "../../../api";
import {useSelector} from "react-redux";
import Maintenance from "../Private/Maintenance";
import Complaints from "../Private/Complaints";


const VehicleDetail = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const params = useParams();
  const prodId = params.id;
  const [vehicleInfo, setVehicleInfo] = useState({});
  const [activePage, setActivePage] = useState('maintenance');

  const fetchVehicleDetail = async () => {

    await api.get(
      `api/v1/vehicles/${prodId}`,
    ).then((response) => {
      const data = response.data
      // console.debug('get vehicle detail', data)
      setVehicleInfo(data);
    }).catch((error) => {
      console.debug('VehicleDetail fetchVehicleDetail api.get', error)
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchVehicleDetail();
    };

    fetchData();

  }, [prodId]);

  return (
    <div className='vehicle-detail'>
      {/*Кнопка на Главную*/}
      <h1>Подробные сведения о модели {vehicleInfo.vehicleModel?.name}</h1>
      <div className='detail-container'>
        {/*<div>*/}
        {/*  <div className=''>*/}
        {/*    <span>Модель: </span>*/}
        {/*    <span>{vehicleInfo.vehicleModel?.name}</span>*/}
        {/*    <span>Серийный номер: </span>*/}
        {/*    <span>{vehicleInfo.serialNumber}</span>*/}
        {/*  </div>*/}
        {/*  <div className='description'>*/}
        {/*    <span>{vehicleInfo.vehicleModel?.description}</span>*/}
        {/*  </div>*/}
        {/*</div>*/}
        <ReferenceDisplay model={vehicleInfo.vehicleModel} sn={vehicleInfo.serialNumber}/>
        <ReferenceDisplay model={vehicleInfo.engineModel} sn={vehicleInfo.snEngine}/>
        <ReferenceDisplay model={vehicleInfo.transmissionModel} sn={vehicleInfo.snTransmission}/>
        <ReferenceDisplay model={vehicleInfo.driveAxleModel} sn={vehicleInfo.snDriveAxle}/>
        <ReferenceDisplay model={vehicleInfo.steeringAxleModel} sn={vehicleInfo.snSteeringAxle}/>
      </div>
      {isAuthenticated &&
        <>
          <div className='vehicle-detail-navigate'>
            <a
              className={activePage === 'maintenance' ? 'active' : ''}
              onClick={() => setActivePage('maintenance')}
            >
              ТО
            </a>
            <a
              className={activePage === 'complaints' ? 'active' : ''}
              onClick={() => setActivePage('complaints')}
            >
              Рекламации
            </a>
          </div>
          {activePage === 'maintenance' &&
            <Maintenance/>
          }
          {activePage === 'complaints' &&
            <Complaints/>
          }
        </>
      }
    </div>
  )
}

const ReferenceDisplay = ({model, sn}) => {
  return (
    <div className='model-container'>
      <div className='model-info'>
        <div className='model-name'>
          <span>{model?.label}: </span>
          <span>{model?.name}</span>
        </div>
        {sn
          ?
          <div className='model-sn'>
            <span>Серийный номер: </span>
            <span>{sn}</span>
          </div>
          : <></>
        }
      </div>
      <div className='description'>
        <span>{model?.description}</span>
      </div>
    </div>
  )
}

export default VehicleDetail;
