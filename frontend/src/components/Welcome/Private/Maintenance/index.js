import React, {useEffect, useState} from "react";
import './index.css';
import CustomInput from "../../../InputTimeout";
import api from "../../../../api";


const Maintenance = () => {
  const [maintenance, setMaintenance] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'dateMaintenance', direction: 'desc' });
  const [filters, setFilters] = useState({
    dateMaintenance: '',
    vehicle: '',
    typeMaintenance: '',
    operatingTime: '',
    workOrder: '',
    dateOrder: '',
    organization: '',
  });
  const [filterInput, setFilterInput] = useState(filters);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '🔼' : '🔽';
    }
    return '';
  };

  const fetchMaintenance = () => {
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
      'api/v1/maintenance/',
      { params }
    ).then((response) => {
      // console.debug('fetch maintenance', response.data)
      setMaintenance(response.data.results);
      setTotalPages(Math.ceil(response.data.count / response.data.page_size));
    }).catch((error) => {
      console.debug('Public api.get', error);
    });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    fetchMaintenance();
  }, [currentPage, sortConfig, filters]);

  return(
    <div className='maintenance-container'>
      <span>Информация о техническом обслуживании Вашей техники</span>
      <table>
        <thead>
        <tr>
          <td>
            <span onClick={() => handleSort('dateMaintenance')}>
              Дата проведения ТО {getSortIndicator('dateMaintenance')}
            </span>
            <CustomInput
              placeholder="Фильтр по дате ТО"
              name="dateMaintenance"
              value={filterInput.dateMaintenance}
              filterInput={filterInput}
              setFilterInput={setFilterInput}
              setFilters={setFilters}
            />
          </td>
          <td>
            <span onClick={() => handleSort('vehicle')}>
              Заводской номер {getSortIndicator('vehicle')}
            </span>
            <CustomInput
              placeholder="Фильтр по заводскому номеру"
              name="vehicle"
              value={filterInput.vehicle}
              filterInput={filterInput}
              setFilterInput={setFilterInput}
              setFilters={setFilters}
            />
          </td>
          <td>
            <span onClick={() => handleSort('typeMaintenance')}>
              Вид ТО {getSortIndicator('typeMaintenance')}
            </span>
            <CustomInput
              placeholder="Фильтр по виду ТО"
              name="typeMaintenance"
              value={filterInput.typeMaintenance}
              filterInput={filterInput}
              setFilterInput={setFilterInput}
              setFilters={setFilters}
            />
          </td>
          <td>
            <span onClick={() => handleSort('operatingTime')}>
              Наработка, м/час {getSortIndicator('operatingTime')}
            </span>
            <CustomInput
              placeholder="Фильтр по наработке"
              name="operatingTime"
              value={filterInput.operatingTime}
              filterInput={filterInput}
              setFilterInput={setFilterInput}
              setFilters={setFilters}
            />
          </td>
          <td>
            <span onClick={() => handleSort('workOrder')}>
              № заказ наряда {getSortIndicator('workOrder')}
            </span>
            <CustomInput
              placeholder="Фильтр по заказ наряду"
              name="workOrder"
              value={filterInput.workOrder}
              filterInput={filterInput}
              setFilterInput={setFilterInput}
              setFilters={setFilters}
            />
          </td>
          <td>
            <span onClick={() => handleSort('dateOrder')}>
              Дата заказ наряда {getSortIndicator('dateOrder')}
            </span>
            <CustomInput
              placeholder="Фильтр по дате заказ наряда"
              name="dateOrder"
              value={filterInput.dateOrder}
              filterInput={filterInput}
              setFilterInput={setFilterInput}
              setFilters={setFilters}
            />
          </td>
          <td>
            <span onClick={() => handleSort('organization')}>
              Организация, проводившая ТО {getSortIndicator('organization')}
            </span>
            <CustomInput
              placeholder="Фильтр по организации"
              name="organization"
              value={filterInput.organization}
              filterInput={filterInput}
              setFilterInput={setFilterInput}
              setFilters={setFilters}
            />
          </td>
        </tr>
        </thead>
        <tbody>
        {maintenance.map((i, index) => (
          <tr key={index}>
            <td>{i.dateMaintenance}</td>
            <td>{i.vehicle.serialNumber}</td>
            <td>{i.typeMaintenance.name}</td>
            <td>{i.operatingTime}</td>
            <td>{i.workOrder}</td>
            <td>{i.dateOrder}</td>
            <td>{i.organization.name}</td>
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
  )
}

export default Maintenance;
