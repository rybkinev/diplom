import React, {useEffect, useRef, useState} from "react";
import './index.css';
import api from "../../../../api";
import CustomInput from "../../Table/InputTimeout";
import HeaderCell from "../../Table/HeaderCell";
import Pagination from "../../Table/Pagination";
import {Link, useLocation, useNavigate} from "react-router-dom";
import useResponsive from "../../../../hooks/useResponsive";
import usePermissions from "../../../../hooks/usePermissions";
import Filter from "../../Filter";


const Vehicles = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hasPermission = usePermissions();

  const hasAddPermission = hasPermission('add_vehicle') || hasPermission('superuser')

  const [vehicles, setVehicles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'shippingDate', direction: 'desc' });
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

  const [showFilters, setShowFilters] = useState(false);

  const {
    shouldHideSteeringAxle,
    shouldHideDriveAxle,
    shouldHideTransmission,
    shouldHideEngine,
  } = useResponsive();

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

  const handleSetFilterDate = (e) => {
    const value = e.target.text;
    const newFilters = { ...filterInput, ['shippingDate']: value };
    setFilterInput(newFilters);
    setFilters(newFilters);

  };

  const handleNewRecord = () => {
    navigate(
      '/vehicles/add',
      {
        state: {
          background: location,
          editable: true,
        }
      })
  }

  const handleOpenRowClick = (e) => {
    const vehicleId = e.currentTarget.getAttribute('data-key')
    if (!vehicleId) {
      console.debug('Maintenance handleEditRowClick', '!idMaintenance', e.target);
      return;
    }
    // console.debug('Maintenance handleEditRowClick', idMaintenance, e.target);

    navigate(
      `/vehicles/${vehicleId}`,
      {
        state: {
          background: location,
          editable: true,
        }
      })
  }

  const handleOpenFilters = () => {
    setShowFilters(true);
  }
  const handleCloseFilters = () => {
    setShowFilters(false);
  }

  return (
    <div className='main-container vehicle'>
      {showFilters &&
        <Filter
          handleCloseFilters={handleCloseFilters}
        >
          <div className='filter-field-container'>
            <label htmlFor='shippingDate'>Дата выпуска:</label>
            <CustomInput
              placeholder="Дата выпуска"
              name="shippingDate"
              value={filterInput.shippingDate}
              filterInput={filterInput}
              setFilterInput={setFilterInput}
              setFilters={setFilters}
              type='date'
            />
          </div>
          <div className='filter-field-container'>
            <label htmlFor='serialNumber'>Заводской номер:</label>
            <CustomInput
              placeholder="Заводской номер"
              name="serialNumber"
              value={filterInput.serialNumber}
              filterInput={filterInput}
              setFilterInput={setFilterInput}
              setFilters={setFilters}
            />
          </div>
          <div className='filter-field-container'>
            <label htmlFor='vehicleModel'>Модель:</label>
            <CustomInput
              placeholder="Модель"
              name="vehicleModel"
              value={filterInput.vehicleModel}
              filterInput={filterInput}
              setFilterInput={setFilterInput}
              setFilters={setFilters}
            />
          </div>
          <div className='filter-field-container'>
            <label htmlFor='engineModel'>Двигатель:</label>
            <CustomInput
                  placeholder="Двигатель"
                  name="engineModel"
                  value={filterInput.engineModel}
                  filterInput={filterInput}
                  setFilterInput={setFilterInput}
                  setFilters={setFilters}
                />
          </div>
          <div className='filter-field-container'>
            <label htmlFor='transmissionModel'>Трансмиссия:</label>
            <CustomInput
              placeholder="Трансмиссия"
              name="transmissionModel"
              value={filterInput.transmissionModel}
              filterInput={filterInput}
              setFilterInput={setFilterInput}
              setFilters={setFilters}
            />
          </div>
          <div className='filter-field-container'>
            <label htmlFor='driveAxleModel'>Ведущий мост:</label>
            <CustomInput
              placeholder="Ведущий мост"
              name="driveAxleModel"
              value={filterInput.driveAxleModel}
              filterInput={filterInput}
              setFilterInput={setFilterInput}
              setFilters={setFilters}
            />
          </div>
          <div className='filter-field-container'>
            <label htmlFor='steeringAxleModel'>Управляемый мост:</label>
            <CustomInput
              placeholder="Управляемый мост"
              name="steeringAxleModel"
              value={filterInput.steeringAxleModel}
              filterInput={filterInput}
              setFilterInput={setFilterInput}
              setFilters={setFilters}
            />
          </div>
        </Filter>
      }
      <span className='text'>Информация о комплектации и технических характеристиках Вашей техники</span>
      {hasAddPermission &&
        <div className='head-buttons'>
          <a
            className='head-button-create'
            onClick={handleNewRecord}
          >
            Добавить запись
          </a>
        </div>
      }
      <table>
        <thead>
        <tr>
            <HeaderCell
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
              name={'shippingDate'}
              searchInput={<CustomInput
                placeholder="Дата выпуска"
                name="shippingDate"
                value={filterInput.shippingDate}
                filterInput={filterInput}
                setFilterInput={setFilterInput}
                setFilters={setFilters}
              />}
            >
              Дата выпуска
            </HeaderCell>
            <HeaderCell
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
              name={'serialNumber'}
              searchInput={<CustomInput
                placeholder="Заводской номер"
                name="serialNumber"
                value={filterInput.serialNumber}
                filterInput={filterInput}
                setFilterInput={setFilterInput}
                setFilters={setFilters}
              />}
            >
              Заводской номер
            </HeaderCell>
            <HeaderCell
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
              name={'vehicleModel'}
              searchInput={<CustomInput
                placeholder="Модель"
                name="vehicleModel"
                value={filterInput.vehicleModel}
                filterInput={filterInput}
                setFilterInput={setFilterInput}
                setFilters={setFilters}
              />}
            >
              Модель
            </HeaderCell>
            {!shouldHideEngine &&
              <HeaderCell
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
                name={'engineModel'}
                searchInput={<CustomInput
                  placeholder="Двигатель"
                  name="engineModel"
                  value={filterInput.engineModel}
                  filterInput={filterInput}
                  setFilterInput={setFilterInput}
                  setFilters={setFilters}
                />}
              >
                Двигатель
              </HeaderCell>
            }
            {!shouldHideTransmission &&
              <HeaderCell
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
                name={'transmissionModel'}
                searchInput={<CustomInput
                  placeholder="Трансмиссия"
                  name="transmissionModel"
                  value={filterInput.transmissionModel}
                  filterInput={filterInput}
                  setFilterInput={setFilterInput}
                  setFilters={setFilters}
                />}
              >
                Трансмиссия
              </HeaderCell>
            }
            {!shouldHideDriveAxle &&
              <HeaderCell
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
                name={'driveAxleModel'}
                searchInput={<CustomInput
                  placeholder="Ведущий мост"
                  name="driveAxleModel"
                  value={filterInput.driveAxleModel}
                  filterInput={filterInput}
                  setFilterInput={setFilterInput}
                  setFilters={setFilters}
                />}
              >
                Ведущий мост
              </HeaderCell>
            }
            {!shouldHideSteeringAxle &&
              <HeaderCell
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
                name={'steeringAxleModel'}
                searchInput={<CustomInput
                  placeholder="Управляемый мост"
                  name="steeringAxleModel"
                  value={filterInput.steeringAxleModel}
                  filterInput={filterInput}
                  setFilterInput={setFilterInput}
                  setFilters={setFilters}
                />}
              >
                Управляемый мост
              </HeaderCell>
            }
            <td>
              {/*{(hasAddPermission) &&*/}
              {/*  <div className='head-buttons'>*/}
              {/*    <a*/}
              {/*      className='head-button-create'*/}
              {/*      onClick={handleNewRecord}*/}
              {/*    >*/}
              {/*      +*/}
              {/*    </a>*/}
              {/*  </div>*/}
              {/*}*/}
              <div className='head-buttons'>
                <img
                  className='img-button-open-row'
                  src='/assets/img/filter_white.png'
                  alt='Редактировать'
                  onClick={handleOpenFilters}
                />
              </div>
            </td>
          </tr>
        </thead>
        <tbody>
        {vehicles.map((i, index) => (
          <tr key={index}>
            <td>
              <a onClick={handleSetFilterDate}>
                {i.shippingDate}
              </a>
            </td>
            <td>
                {/*{i.serialNumber}*/}
                <Link
                  to={`/vehicles/${i.id}`}
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
              {!shouldHideEngine &&
                <td>
                  <Link
                    to={`/vehicles/engine-model/${i.engineModel?.id}`}
                    state={{background: location}}
                  >
                    {i.engineModel?.name}
                  </Link>
                </td>
              }
              {!shouldHideTransmission &&
                <td>
                  <Link
                    to={`/vehicles/transmission-model/${i.transmissionModel?.id}`}
                    state={{background: location}}
                  >
                    {i.transmissionModel?.name}
                  </Link>
                </td>
              }
              {!shouldHideDriveAxle &&
                <td>
                  <Link
                    to={`/vehicles/drive-axle-model/${i.driveAxleModel?.id}`}
                    state={{background: location}}
                  >
                    {i.driveAxleModel?.name}
                  </Link>
                </td>
              }
              {!shouldHideSteeringAxle &&
                <td>
                  <Link
                    to={`/vehicles/steering-axle-model/${i.driveAxleModel?.id}`}
                    state={{background: location}}
                  >
                    {i.steeringAxleModel?.name}
                  </Link>
                </td>
              }
              <td>
                <img
                  className='img-button-open-row'
                  src='/assets/img/open_row.png'
                  alt='Редактировать'
                  data-key={i.id}
                  onClick={handleOpenRowClick}
                />
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
};

export default Vehicles;