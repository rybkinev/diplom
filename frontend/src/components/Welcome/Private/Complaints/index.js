import React, {useEffect, useState} from "react";
import './index.css';
import api from "../../../../api";
import CustomInput from "../../../InputTimeout";


const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'dateFailure', direction: 'desc' });
  const [filters, setFilters] = useState({
    vehicle: '',
    recoveryMethod: '',
    dateFailure: '',
    operatingTime: '',
    dateRecovery: '',
    nodeFailure: '',
    serviceCompany: '',
    usedParts: '',
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

  const fetchComplaints = () => {
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
      'api/v1/complaint/',
      { params }
    ).then((response) => {
      // console.debug('fetch complaint', response.data)
      setComplaints(response.data.results);
      setTotalPages(Math.ceil(response.data.count / response.data.page_size));
    }).catch((error) => {
      console.debug('Public api.get', error);
    });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    fetchComplaints();
  }, [currentPage, sortConfig, filters]);

  return (
    <div className='complaints-container'>
      <span>Информация о рекламациях по Вашей технике</span>
      <table>
        <thead>
        <tr>
          <td>
            <span onClick={() => handleSort('dateFailure')}>
              Дата поломки {getSortIndicator('dateFailure')}
            </span>
            <CustomInput
              placeholder="Фильтр по дате неисправности"
              name="dateFailure"
              value={filterInput.dateFailure}
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
            <span onClick={() => handleSort('nodeFailure')}>
              Неисправный узел {getSortIndicator('nodeFailure')}
            </span>
            <CustomInput
              placeholder="Фильтр по узлу"
              name="nodeFailure"
              value={filterInput.nodeFailure}
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
            <span onClick={() => handleSort('usedParts')}>
              Используемые запчасти {getSortIndicator('usedParts')}
            </span>
            <CustomInput
              placeholder="Фильтр по запчастям"
              name="usedParts"
              value={filterInput.usedParts}
              filterInput={filterInput}
              setFilterInput={setFilterInput}
              setFilters={setFilters}
            />
          </td>
          <td>
            <span onClick={() => handleSort('recoveryMethod')}>
              Метод восстановления {getSortIndicator('recoveryMethod')}
            </span>
            <CustomInput
              placeholder="Фильтр по методу восстановления"
              name="recoveryMethod"
              value={filterInput.recoveryMethod}
              filterInput={filterInput}
              setFilterInput={setFilterInput}
              setFilters={setFilters}
            />
          </td>
          <td>
            <span onClick={() => handleSort('dateRecovery')}>
              Дата восстановления {getSortIndicator('dateRecovery')}
            </span>
            <CustomInput
              placeholder="Фильтр по дате восстановления"
              name="dateRecovery"
              value={filterInput.dateRecovery}
              filterInput={filterInput}
              setFilterInput={setFilterInput}
              setFilters={setFilters}
            />
          </td>
        </tr>
        </thead>
        <tbody>
        {complaints.map((i, index) => (
          <tr key={index}>
            <td>{i.dateFailure}</td>
            <td>{i.vehicle.serialNumber}</td>
            <td>{i.nodeFailure.name}</td>
            <td>{i.operatingTime}</td>
            <td>{i.usedParts}</td>
            <td>{i.recoveryMethod.name}</td>
            <td>{i.dateRecovery}</td>
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

export default Complaints;
