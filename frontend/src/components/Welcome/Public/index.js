import React, {useEffect, useState} from "react";
import './index.css';
import api from "../../../api";
import HeaderCell from "../Table/HeaderCell";
import Pagination from "../Table/Pagination";
import {Link, useLocation} from "react-router-dom";

const Public = () => {
  const location = useLocation()

  const [serialNumber, setSerialNumber] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [sortConfig, setSortConfig] = useState({ key: 'serialNumber', direction: 'asc' });

  const fetchVehicles = () => {
    const params = {
      page: currentPage,
      ...(serialNumber && { serialNumber: serialNumber }),
      ...(sortConfig.key && { sort: `${sortConfig.direction === 'asc' ? '' : '-'}${sortConfig.key}` })
    };

    api.get(
      'api/v1/vehicles/public/',
      { params }
    ).then((response) => {
      // console.debug('get vehicles', response.data)
      setVehicles(response.data.results);
      setTotalPages(Math.ceil(response.data.count / response.data.page_size));
    }).catch((error) => {
      console.debug('Public api.get', error)
    });
  }

  useEffect(() => {
    fetchVehicles();
  }, [currentPage, sortConfig]);

  useEffect(() => {
    if (!serialNumber) {
      fetchVehicles();
    }
  }, [serialNumber]);

  const handleSearch = () => {
    fetchVehicles();
  }

  const handleClear = () => {
    setSerialNumber('');
  }

  return (
    <div className='main-public-container'>
      <span className='text'>Проверьте комплектацию и технические характеристики техники Силант</span>

      <div className='main-search-inp'>
        <div className="clearable-input">
          <input
            type='text'
            placeholder='Заводской номер'
            value={serialNumber}
            required={true}
            autoComplete='on'
            onChange={(e) => {
              setSerialNumber(e.target.value)
            }}
          />
          {serialNumber && (
            <button onClick={handleClear} className="clear-button">
              x
            </button>
          )}
        </div>
        <button
          disabled={!serialNumber}
          onClick={handleSearch}
        >
          Поиск
        </button>
      </div>

      <span className='text-result'>Результат поиска:</span>
      {/*<span>Информация о комплектации и технических характеристиках Вашей техники</span>*/}
      <table>
        <thead>
        <tr>
          <HeaderCell
            sortAvailable={false}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            name={'serialNumber'}
          >
            Заводской номер
          </HeaderCell>
          <HeaderCell
            sortAvailable={false}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            name={'vehicleModel'}
          >
            Модель
          </HeaderCell>
          <HeaderCell
            sortAvailable={false}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            name={'engineModel'}
          >
            Модель двигателя
          </HeaderCell>
          <HeaderCell
            sortAvailable={false}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            name={'transmissionModel'}
          >
            Модель трансмиссии
          </HeaderCell>
          <HeaderCell
            sortAvailable={false}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            name={'driveAxleModel'}
          >
            Модель ведущего моста
          </HeaderCell>
          <HeaderCell
            sortAvailable={false}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            name={'steeringAxleModel'}
          >
            Модель управляемого моста
          </HeaderCell>
        </tr>
        </thead>
        <tbody>
        {vehicles.map((i, index) => (
          <tr key={index}>
            {/*<td>{i.serialNumber}</td>*/}
            <td>
              <Link
                to={`vehicles/${i.id}`}
                state={{background: location}}
              >
                {i.serialNumber}
              </Link>
            </td>
            <td>
              <Link
                to={`/vehicles/vehicle-model/${i.vehicleModel?.id}`}
                state={{background: location}}
              >
                {i.vehicleModel?.name}
              </Link>
            </td>
            <td>
              <Link
                to={`/vehicles/engine-model/${i.engineModel?.id}`}
                state={{background: location}}
              >
                {i.engineModel?.name}
              </Link>
            </td>
            <td>
              <Link
                to={`/vehicles/transmission-model/${i.transmissionModel?.id}`}
                state={{background: location}}
              >
                {i.transmissionModel?.name}
              </Link>
            </td>
            <td>
              <Link
                to={`/vehicles/drive-axle-model/${i.driveAxleModel?.id}`}
                state={{background: location}}
              >
                {i.driveAxleModel?.name}
              </Link>
            </td>
            <td>
              <Link
                to={`/vehicles/steering-axle-model/${i.driveAxleModel?.id}`}
                state={{background: location}}
              >
                {i.steeringAxleModel?.name}
              </Link>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      {!vehicles.length &&
        <div className='not-results'>
          <span>
            Нет данных для отображения
          </span>
        </div>
      }
      <Pagination
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  );
}

export default Public;