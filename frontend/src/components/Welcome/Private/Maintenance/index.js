import React, {useState} from "react";
import './index.css';
import CustomInput from "../../../InputTimeout";


const Maintenance = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'dateMaintenance', direction: 'asc' });
  const [filters, setFilters] = useState({
    dateMaintenance: '',
    serialNumber: '',
    type: '',
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
            <span onClick={() => handleSort('type')}>
              Вид ТО {getSortIndicator('type')}
            </span>
            <CustomInput
              placeholder="Фильтр по виду ТО"
              name="type"
              value={filterInput.type}
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
      </table>
    </div>
  )
}

export default Maintenance;
