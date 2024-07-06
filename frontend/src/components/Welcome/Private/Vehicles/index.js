import React, {useEffect, useState} from "react";
import './index.css';
import api from "../../../../api";


const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'shippingDate', direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  }

  const fetchVehicles = () => {
    const params = {
      page: currentPage,
      ...(sortConfig.key && { sort: `${sortConfig.direction === 'asc' ? '' : '-'}${sortConfig.key}` })
    };

    api.get(
      'api/v1/vehicles/',
      { params }
    ).then((response) => {
      console.debug('get vehicles', response.data)
      setVehicles(response.data.results);
      setTotalPages(Math.ceil(response.data.count / response.data.page_size));
    }).catch((error) => {
      console.debug('Public api.get', error)
    });
  }

  useEffect(() => {
    fetchVehicles();
  }, [currentPage, sortConfig]);

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '🔼' : '🔽';
    }
    return '';
  }

  return(
    <div className='vehicles-container'>
      <span>Информация о комплектации и технических характеристиках Вашей техники</span>
      <table>
        <thead>
        <tr>
          <td onClick={() => handleSort('shippingDate')}>
            Дата выпуска {getSortIndicator('shippingDate')}
          </td>
          <td onClick={() => handleSort('serialNumber')}>
            Заводской номер {getSortIndicator('serialNumber')}
          </td>
          <td onClick={() => handleSort('vehicleModel')}>
            Модель {getSortIndicator('vehicleModel')}
          </td>
          <td onClick={() => handleSort('engineModel')}>
            Модель двигателя {getSortIndicator('engineModel')}
          </td>
          <td onClick={() => handleSort('transmissionModel')}>
            Модель трансмиссии {getSortIndicator('transmissionModel')}
          </td>
          <td onClick={() => handleSort('driveAxleModel')}>
            Модель ведущего моста {getSortIndicator('driveAxleModel')}
          </td>
          <td onClick={() => handleSort('steeringAxleModel')}>
            Модель управляемого моста {getSortIndicator('steeringAxleModel')}
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
          {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
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
  )
}

export default Vehicles;
