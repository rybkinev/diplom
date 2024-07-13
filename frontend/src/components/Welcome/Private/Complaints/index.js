import React, {useEffect, useRef, useState} from "react";
import './index.css';
import api from "../../../../api";
import CustomInput from "../../Table/InputTimeout";
import Pagination from "../../Table/Pagination";
import HeaderCell from "../../Table/HeaderCell";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import useResponsive from "../../../../hooks/useResponsive";
import {useDispatch, useSelector} from "react-redux";
import {fetchPermissions} from "../../../../store/userSlice";


const Complaints = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  // const permissions = useSelector((state) => state.user?.permissions);

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

  const {
    shouldHideButtonEdit,
    shouldHideDateRecovery,
    shouldHideMethodRecovery,
    shouldHideUsedParts,
    shouldHideComplaintOperatingTime,
  } = useResponsive();

  // const hasPermission = (perm) => permissions.includes(perm);

  // const handleSort = (key) => {
  //   let direction = 'asc';
  //   if (sortConfig.key === key && sortConfig.direction === 'asc') {
  //     direction = 'desc';
  //   }
  //   setSortConfig({ key, direction });
  // };
  // const getSortIndicator = (key) => {
  //   if (sortConfig.key === key) {
  //     return sortConfig.direction === 'asc' ? '🔼' : '🔽';
  //   }
  //   return '';
  // };

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

  // useEffect(() => {
  //   dispatch(fetchPermissions());
  // }, [dispatch]);

  const handleSetFilterDate = (e) => {
    const value = e.target.text;
    setFilterInput({ ...filterInput, ['dateFailure']: value });
    setFilters({ ...filters, ['dateFailure']: value });
  };

  const handleEditRowClick = (e) => {
    const idComplaint = e.currentTarget.getAttribute('data-key')

    console.debug('Complaints handleEditRowClick', idComplaint, e.target);

    navigate(
      `${idComplaint}`,
      {
        state: {
          background: location,
          editable: true,
        }
      })
  }

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
          {!shouldHideComplaintOperatingTime &&
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
          {!shouldHideUsedParts &&
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
          }
          {!shouldHideMethodRecovery &&
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
          }
          {!shouldHideDateRecovery &&
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
          }
          <td></td>
        </tr>
        </thead>
        <tbody>
        {complaints.map((i, index) => (
          <tr key={index}>
            <td>
              {/*{i.dateFailure}*/}
              <a onClick={handleSetFilterDate}>
                {i.dateFailure}
              </a>
            </td>
            {!vehicleId &&
              <td>
                {/*{i.vehicle.serialNumber}*/}
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
                ? i.nodeFailure?.name
                : <Link
                      to={`/complaint/failure-node/${i.nodeFailure?.id}`}
                    state={{background: location}}
                  >
                    {i.nodeFailure?.name}
                  </Link>
              }
            </td>
            {!shouldHideComplaintOperatingTime &&
              <td>{i.operatingTime}</td>
            }
            {!shouldHideUsedParts &&
              <td>{i.usedParts}</td>
            }
            {!shouldHideMethodRecovery &&
              <td>
                {vehicleId
                  ? i.recoveryMethod?.name
                  : <Link
                    to={`/complaint/recovery-method/${i.recoveryMethod?.id}`}
                    state={{background: location}}
                  >
                    {i.recoveryMethod?.name}
                  </Link>
                }
              </td>
            }
            {!shouldHideDateRecovery &&
              <td>{i.dateRecovery}</td>
            }
            <td>
              <div className='buttons-row-edit'>
                <img
                  className='img-button-open-row'
                  src='/assets/img/open_row.png'
                  alt='Редактировать'
                  data-key={i.id}
                  onClick={handleEditRowClick}
                />
              </div>
              </td>
            {/*{(*/}
            {/*  hasPermission('change_complaint') ||*/}
            {/*  hasPermission('delete_complaint') ||*/}
            {/*  hasPermission('superuser')*/}
            {/*  ) &&*/}
            {/*  <td>*/}
            {/*    <div className='buttons-row-edit'>*/}
            {/*      {!shouldHideButtonEdit &&*/}
            {/*        <img*/}
            {/*          className='img-button-edit-row'*/}
            {/*          src='/assets/img/edit_row.png'*/}
            {/*          alt='Редактировать'*/}
            {/*          data-key={i.id}*/}
            {/*          onClick={handleEditRowClick}*/}
            {/*        />*/}
            {/*      }*/}
            {/*      {(hasPermission('delete_complaint') || hasPermission('superuser')) &&*/}
            {/*        <img*/}
            {/*          className='img-button-delete-row'*/}
            {/*          src='/assets/img/delete_row.png'*/}
            {/*          alt='Удалить'*/}
            {/*          // onClick={handleEditClick}*/}
            {/*        />*/}
            {/*      }*/}
            {/*    </div>*/}
            {/*  </td>*/}
            {/*}*/}
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
