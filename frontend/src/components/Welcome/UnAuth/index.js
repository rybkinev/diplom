import React, {useEffect, useState} from "react";
import './index.css';
import api from "../../../api";


const UnAuth = () => {
  const [serialNumber, setSerialNumber] = useState('');
  const [vehicles, setVehicles] = useState([])

  useEffect(() => {
    api.get(
      'api/v1/vehicles/public/'
    ).then((response) => {
      setVehicles(response.data);
    }).catch((error) => {
      console.debug('UnAuth api.get', error)
    })
  }, []);

  const handleSearch = () => {

  }

  return (
    <main className='un-auth'>
      <span>Проверьте комплектацию и технические характеристики техники Силант</span>

      <div className='main-search-inp'>
        <input
          type='text'
          placeholder='Заводской номер'
          value={serialNumber}
          required={true}
          autoComplete='on'
          onChange={(e) => {setSerialNumber(e.target.value)}}
        />
        <button
          disabled={!serialNumber}
        >
          Поиск
        </button>
      </div>

      <span>Результат поиска:</span>
      <span>Информация о комплектации и технических характеристиках Вашей техники</span>
      <table>
        <thead>
          <tr>
            <td>Заводской номер</td>
            <td>Модель</td>
            <td>Модель двигателя</td>
            <td>Модель трансмиссии</td>
            <td>Модель ведущего моста</td>
            <td>Модель управляемого моста</td>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((i, index) => (
            <tr key={index}>
              <td>{i.serialNumber}</td>
              <td>{i.vehicleModel}</td>
              <td>{i.engineModel}</td>
              <td>{i.transmissionModel}</td>
              <td>{i.driveAxleModel}</td>
              <td>{i.steeringAxleModel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}

export default UnAuth;