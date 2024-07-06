import React, {useEffect, useRef, useState} from "react";
import './index.css';
import api from "../../../../api";
import CustomInput from "../../../InputTimeout";


const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'shippingDate', direction: 'asc' });
  const [filters, setFilters] = useState({
    shippingDate: '',
    serialNumber: '',
    vehicleModel: '',
    engineModel: '',
    transmissionModel: '',
    driveAxleModel: '',
    steeringAxleModel: '',
  });
  const [filterInput, setFilterInput] = useState(filters);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const fetchVehicles = () => {
    const activeFilters = Object.keys(filters).reduce((acc, key) => {
      if (filters[key]) {
        acc[key] = filters[key];
      }
      return acc;
    }, {});

    const params = {
      page: currentPage,
      ...(sortConfig.key && { sort: `${sortConfig.direction === 'asc' ? '' : '-'}${sortConfig.key}` }),
      ...activeFilters,
    };

    api.get(
      'api/v1/vehicles/',
      { params }
    ).then((response) => {
      setVehicles(response.data.results);
      setTotalPages(Math.ceil(response.data.count / response.data.page_size));
    }).catch((error) => {
      console.debug('Public api.get', error);
    });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    fetchVehicles();
  }, [currentPage, sortConfig, filters]);

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '🔼' : '🔽';
    }
    return '';
  };

  return (
    <div className='vehicles-container'>
      <span>Информация о комплектации и технических характеристиках Вашей техники</span>
      <table>
        <thead>
          <tr>
            <td>
              <span onClick={() => handleSort('shippingDate')}>
                Дата выпуска {getSortIndicator('shippingDate')}
              </span>
              <CustomInput
                placeholder="Фильтр по дате выпуска"
                name="shippingDate"
                value={filterInput.shippingDate}
                filterInput={filterInput}
                setFilterInput={setFilterInput}
                setFilters={setFilters}
              />
            </td>
            <td>
              <span onClick={() => handleSort('serialNumber')}>
                Заводской номер {getSortIndicator('serialNumber')}
              </span>
              <CustomInput
                placeholder="Фильтр по заводскому номеру"
                name="serialNumber"
                value={filterInput.serialNumber}
                filterInput={filterInput}
                setFilterInput={setFilterInput}
                setFilters={setFilters}
              />
            </td>
            <td>
              <span onClick={() => handleSort('vehicleModel')}>
                Модель {getSortIndicator('vehicleModel')}
              </span>
              <CustomInput
                placeholder="Фильтр по модели"
                name="vehicleModel"
                value={filterInput.vehicleModel}
                filterInput={filterInput}
                setFilterInput={setFilterInput}
                setFilters={setFilters}
              />
            </td>
            <td>
              <span onClick={() => handleSort('engineModel')}>
                Модель двигателя {getSortIndicator('engineModel')}
              </span>
              <CustomInput
                placeholder="Фильтр по модели двигателя"
                name="engineModel"
                value={filterInput.engineModel}
                filterInput={filterInput}
                setFilterInput={setFilterInput}
                setFilters={setFilters}
              />
            </td>
            <td>
              <span onClick={() => handleSort('transmissionModel')}>
                Модель трансмиссии {getSortIndicator('transmissionModel')}
              </span>
              <CustomInput
                placeholder="Фильтр по модели трансмиссии"
                name="transmissionModel"
                value={filterInput.transmissionModel}
                filterInput={filterInput}
                setFilterInput={setFilterInput}
                setFilters={setFilters}
              />
            </td>
            <td>
              <span onClick={() => handleSort('driveAxleModel')}>
                Модель ведущего моста {getSortIndicator('driveAxleModel')}
              </span>
              <CustomInput
                placeholder="Фильтр по модели ведущего моста"
                name="driveAxleModel"
                value={filterInput.driveAxleModel}
                filterInput={filterInput}
                setFilterInput={setFilterInput}
                setFilters={setFilters}
              />
            </td>
            <td>
              <span onClick={() => handleSort('steeringAxleModel')}>
                Модель управляемого моста {getSortIndicator('steeringAxleModel')}
              </span>
              <CustomInput
                placeholder="Фильтр по модели управляемого моста"
                name="steeringAxleModel"
                value={filterInput.steeringAxleModel}
                filterInput={filterInput}
                setFilterInput={setFilterInput}
                setFilters={setFilters}
              />
            </td>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((i, index) => (
            <tr key={index}>
              <td>{i.shippingDate}</td>
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
      {totalPages > 1 &&
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={page === currentPage ? 'active' : ''}
            >
              {page}
            </button>
          ))}
        </div>
      }
    </div>
  );
};

export default Vehicles;