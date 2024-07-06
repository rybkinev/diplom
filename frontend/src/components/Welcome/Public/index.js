import React, {useEffect, useState} from "react";
import './index.css';
import api from "../../../api";

const Public = () => {
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
      console.debug('get vehicles', response.data)
      setVehicles(response.data.results);
      setTotalPages(Math.ceil(response.data.count / response.data.page_size));
    }).catch((error) => {
      console.debug('UnAuth api.get', error)
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

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  }

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '🔼' : '🔽';
    }
    return '';
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
          onChange={(e) => {
            setSerialNumber(e.target.value)
          }}
        />
        <button
          disabled={!serialNumber}
          onClick={handleSearch}
        >
          Поиск
        </button>
      </div>

      <span>Результат поиска:</span>
      <span>Информация о комплектации и технических характеристиках Вашей техники</span>
      <table>
        <thead>
        <tr>
          <td onClick={() => handleSort('serialNumber')}>Заводской номер {getSortIndicator('serialNumber')}</td>
          <td onClick={() => handleSort('vehicleModel')}>Модель {getSortIndicator('vehicleModel')}</td>
          <td onClick={() => handleSort('engineModel')}>Модель двигателя {getSortIndicator('engineModel')}</td>
          <td onClick={() => handleSort('transmissionModel')}>Модель трансмиссии {getSortIndicator('transmissionModel')}</td>
          <td onClick={() => handleSort('driveAxleModel')}>Модель ведущего моста {getSortIndicator('driveAxleModel')}</td>
          <td onClick={() => handleSort('steeringAxleModel')}>Модель управляемого моста {getSortIndicator('steeringAxleModel')}</td>
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
    </main>
  );
}

export default Public;