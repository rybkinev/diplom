import React, {useEffect, useState} from "react";
import './index.css';
import CustomInput from "../../Table/InputTimeout";
import api from "../../../../api";
import Pagination from "../../Table/Pagination";
import HeaderCell from "../../Table/HeaderCell";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import useResponsive from "../../../../hooks/useResponsive";
import usePermissions from "../../../../hooks/usePermissions";


const Maintenance = () => {
  const location = useLocation()
  const navigate = useNavigate();
  const hasPermission = usePermissions();

  const hasAddPermission = hasPermission('add_maintenance') || hasPermission('superuser')

  const params = useParams();
  const vehicleId = params.id;

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

  const {
    shouldHideOrganization,
    shouldHideDateOrder,
    shouldHideWorkOrder,
    shouldHideOperatingTime,
  } = useResponsive();

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

    let url = 'api/v1/maintenance/';
    if (vehicleId) {
      url = `api/v1/maintenance/vehicle/${vehicleId}`;
    }
    api.get(
      url,
      { params }
    ).then((response) => {
      // console.debug('fetch maintenance', response.data)
      setMaintenance(response.data.results);
      setTotalPages(Math.ceil(response.data.count / response.data.page_size));
    }).catch((error) => {
      console.debug('Maintenance fetchMaintenance api.get', error);
    });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    fetchMaintenance();
  }, [currentPage, sortConfig, filters]);

  const handleSetFilterDate = (e) => {
    const value = e.target.text;
    setFilterInput({ ...filterInput, ['dateMaintenance']: value });
    setFilters({ ...filters, ['dateMaintenance']: value });
  };

  const handleOpenRowClick = (e) => {
    const idMaintenance = e.currentTarget.getAttribute('data-key')
    if (!idMaintenance) {
      console.debug('Maintenance handleEditRowClick', '!idMaintenance', e.target);
      return;
    }
    // console.debug('Maintenance handleEditRowClick', idMaintenance, e.target);

    navigate(
      `${idMaintenance}`,
      {
        state: {
          background: location,
          editable: true,
        }
      })
  }

  const handleNewRecord = () => {
    navigate(
      'add',
      {
        state: {
          background: location,
          editable: true,
        }
      })
  }

  return(
    <div className='main-container maintenance'>
      <span className='text'>Информация о техническом обслуживании Вашей техники</span>
      <table>
        <thead>
        <tr>
          <HeaderCell
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            name={'dateMaintenance'}
            searchInput={<CustomInput
              placeholder="Дата проведения ТО"
              name="dateMaintenance"
              value={filterInput.dateMaintenance}
              filterInput={filterInput}
              setFilterInput={setFilterInput}
              setFilters={setFilters}
            />}
          >
            Дата проведения
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
            name={'typeMaintenance'}
            searchInput={<CustomInput
              placeholder="Вид ТО"
              name="typeMaintenance"
              value={filterInput.typeMaintenance}
              filterInput={filterInput}
              setFilterInput={setFilterInput}
              setFilters={setFilters}
            />}
          >
            Вид ТО
          </HeaderCell>
          {!shouldHideOperatingTime &&
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
          }
          {!shouldHideWorkOrder &&
            <HeaderCell
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
              name={'workOrder'}
              searchInput={<CustomInput
                placeholder="№ заказ наряда"
                name="workOrder"
                value={filterInput.workOrder}
                filterInput={filterInput}
                setFilterInput={setFilterInput}
                setFilters={setFilters}
              />}
            >
              № заказ наряда
            </HeaderCell>
          }
          {!shouldHideDateOrder &&
            <HeaderCell
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
              name={'dateOrder'}
              searchInput={<CustomInput
                placeholder="Дата заказ наряда"
                name="dateOrder"
                value={filterInput.dateOrder}
                filterInput={filterInput}
                setFilterInput={setFilterInput}
                setFilters={setFilters}
              />}
            >
              Дата заказ наряда
            </HeaderCell>
          }
          {!shouldHideOrganization &&
            <HeaderCell
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
              name={'organization'}
              searchInput={<CustomInput
                placeholder="Организация"
                name="organization"
                value={filterInput.organization}
                filterInput={filterInput}
                setFilterInput={setFilterInput}
                setFilters={setFilters}
              />}
            >
              Организация, проводившая ТО
            </HeaderCell>
          }
          <td>
            {(!vehicleId && hasAddPermission) &&
              <div className='head-buttons'>
                <a
                  className='head-button-create'
                  onClick={handleNewRecord}
                >
                  +
                </a>
              </div>
            }
          </td>
        </tr>
        </thead>
        <tbody>
        {maintenance.map((i, index) => (
          <tr key={index}>
            <td>
              {/*{i.dateMaintenance}*/}
              <a onClick={handleSetFilterDate}>
                {i.dateMaintenance}
              </a>
            </td>
            {!vehicleId &&
              <td>
                <Link
                  to={`/vehicles/${i.vehicle.id}`}
                  state={{background: location}}
                >
                  {i.vehicle.serialNumber}
                </Link>
              </td>
            }
            <td>
              {vehicleId
                ? i.typeMaintenance?.name
                : <Link
                  to={`/maintenance/maintenance-type/${i.typeMaintenance?.id}`}
                  state={{background: location}}
                >
                  {i.typeMaintenance?.name}
                </Link>
              }
            </td>
            {!shouldHideOperatingTime &&
              <td>{i.operatingTime}</td>
            }
            {!shouldHideWorkOrder &&
              <td>{i.workOrder}</td>
            }
            {!shouldHideDateOrder &&
              <td>{i.dateOrder}</td>
            }
            {!shouldHideOrganization &&
              <td>
                {vehicleId
                  ? i.organization?.name
                  : <Link
                    to={`/maintenance/organizations/${i.organization?.id}`}
                    state={{background: location}}
                  >
                    {i.organization?.name}
                  </Link>
                }
              </td>
            }
            <td>
              {!vehicleId &&
                <img
                  className='img-button-open-row'
                  src='/assets/img/open_row.png'
                  alt='Редактировать'
                  data-key={i.id}
                  onClick={handleOpenRowClick}
                />
              }
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      {!maintenance.length &&
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

export default Maintenance;
