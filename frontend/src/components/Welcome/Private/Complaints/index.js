import React, {useEffect, useState} from "react";
import './index.css';
import api from "../../../../api";
import CustomInput from "../../Table/InputTimeout";
import Pagination from "../../Table/Pagination";
import HeaderCell from "../../Table/HeaderCell";
import {useParams} from "react-router-dom";


const Complaints = () => {
  const params = useParams();
  const vehicleId = params.id;

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

    let url = 'api/v1/complaint/';
    if (vehicleId) {
      url = `api/v1/complaint/vehicle/${vehicleId}`;
    }

    api.get(
      url,
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
    <div className='main-container complaints'>
      <span className='text'>Информация о рекламациях по Вашей технике</span>
      <table>
        <thead>
        <tr>
          <HeaderCell
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            name={'dateFailure'}
            searchInput={<CustomInput
              placeholder="Дата поломки"
              name="dateFailure"
              value={filterInput.dateFailure}
              filterInput={filterInput}
              setFilterInput={setFilterInput}
              setFilters={setFilters}
            />}
          >
            Дата поломки
          </HeaderCell>
          {!vehicleId &&
            <HeaderCell
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
              name={'vehicle'}
              searchInput={<CustomInput
                placeholder="Заводской номер"
                name="vehicle"
                value={filterInput.vehicle}
                filterInput={filterInput}
                setFilterInput={setFilterInput}
                setFilters={setFilters}
              />}
            >
              Заводской номер
            </HeaderCell>
          }
          <HeaderCell
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            name={'nodeFailure'}
            searchInput={<CustomInput
              placeholder="Неисправный узел"
              name="nodeFailure"
              value={filterInput.nodeFailure}
              filterInput={filterInput}
              setFilterInput={setFilterInput}
              setFilters={setFilters}
            />}
          >
            Неисправный узел
          </HeaderCell>
          <HeaderCell
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            name={'operatingTime'}
            searchInput={<CustomInput
              placeholder="Наработка"
              name="operatingTime"
              value={filterInput.operatingTime}
              filterInput={filterInput}
              setFilterInput={setFilterInput}
              setFilters={setFilters}
            />}
          >
            Наработка, м/час
          </HeaderCell>
          <HeaderCell
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            name={'usedParts'}
            searchInput={<CustomInput
              placeholder="Запчасти"
              name="usedParts"
              value={filterInput.usedParts}
              filterInput={filterInput}
              setFilterInput={setFilterInput}
              setFilters={setFilters}
            />}
          >
            Используемые запчасти
          </HeaderCell>
          <HeaderCell
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            name={'recoveryMethod'}
            searchInput={<CustomInput
              placeholder="Метод восстановления"
              name="recoveryMethod"
              value={filterInput.recoveryMethod}
              filterInput={filterInput}
              setFilterInput={setFilterInput}
              setFilters={setFilters}
            />}
          >
            Метод восстановления
          </HeaderCell>
          <HeaderCell
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            name={'dateRecovery'}
            searchInput={<CustomInput
              placeholder="Дата восстановления"
              name="dateRecovery"
              value={filterInput.dateRecovery}
              filterInput={filterInput}
              setFilterInput={setFilterInput}
              setFilters={setFilters}
            />}
          >
            Дата восстановления
          </HeaderCell>
        </tr>
        </thead>
        <tbody>
        {complaints.map((i, index) => (
          <tr key={index}>
            <td>{i.dateFailure}</td>
            {!vehicleId &&
              <td>{i.vehicle.serialNumber}</td>
            }
            <td>{i.nodeFailure.name}</td>
            <td>{i.operatingTime}</td>
            <td>{i.usedParts}</td>
            <td>{i.recoveryMethod.name}</td>
            <td>{i.dateRecovery}</td>
          </tr>
        ))}
        </tbody>
      </table>
      {!complaints.length &&
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
  )
}

export default Complaints;
