import React, {useEffect, useState} from "react";
import './index.css';
import {useLocation, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import api from "../../../../../api";
import {fetchPermissions} from "../../../../../store/userSlice";
import InputListSelect from "../../../../InputListSelect";


const ComplaintDetail = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const permissions = useSelector((state) => state.user?.permissions);
  const params = useParams();

  const editPermission = 'change_complaint'

  const prodId = params?.id;

  let url = 'api/v1/complaint/'
  if (prodId)
    url = `api/v1/complaint/${prodId}/`

  const state = location?.state || {};
  const [editMode, setEditMode] = useState( false);

  const [data, setData] = useState({
    name: '',
    dateFailure: '',
    vehicle: { serialNumber: '' },
    descriptionFailure: '',
    nodeFailure: { name: '' },
    operatingTime: '',
    usedParts: '',
    recoveryMethod: { name: '' },
    dateRecovery: '',
    serviceCompany: '',
  });
  const [editData, setEditData] = useState(data);

  const fetchComplaintDetail = async () => {
    if (!prodId) return;

    await api.get(
      url,
    ).then((response) => {
      const data = response.data
      console.debug('ComplaintDetail fetchComplaintDetail api.get response.data', data)
      setData(data);
      setEditData(data);
    }).catch((error) => {
      console.debug('VehicleDetail fetchVehicleDetail api.get', error)
    });
  }

  const hasPermission = (perm) => permissions.includes(perm);

  const upgradePermission = () => {
    dispatch(fetchPermissions());
    if (
      prodId && !hasPermission(editPermission)
      && !hasPermission('superuser')
    ) {
      setEditMode(false);
      setEditData(data);
    }
  };

  useEffect(() => {
    upgradePermission();
    fetchComplaintDetail();
  }, []);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleCancelClick = () => {
    setEditMode(false);
    setEditData(data); // Отмена изменений
  };
  const handleSaveClick = async () => {
    try {

      // Создаем новый объект, в котором будут только ID для связанных объектов
      const payload = {
        ...editData,
        vehicle: editData.vehicle.id,
        nodeFailure: editData.nodeFailure.id,
        recoveryMethod: editData.recoveryMethod.id,
        serviceCompany: editData.serviceCompany.id
      };

      console.debug('ComplaintDetail handleSaveClick', payload);

      const response = await api.put(
        url,
        payload
      );
      setData(response.data);
      setEditMode(false);
    } catch (error) {
      console.debug('handleSaveClick api.put', error);
    }
  };

  return (
    <div className='edit-complaint-container'>
      {(hasPermission(editPermission) || hasPermission('superuser')) && !editMode &&
        <img
          className='img-button-edit'
          src='/assets/img/edit_page.png'
          alt='Редактировать'
          onClick={handleEditClick}
        />
      }
      <h2>{prodId ? editMode ? 'Редактирование рекламации' : 'Подробности рекламации' : 'Создание рекламации'}</h2>
      {editMode
        ? (
          <div className='edit-mode'>
            <div className='edit-fields date-failure'>
              <label>Дата поломки</label>
              <input
                type="date"
                name="dateFailure"
                value={editData.dateFailure}
                onChange={handleChange}
              />
            </div>

            <div className='edit-fields vehicle'>
              <label>Машина</label>
              <input
                type="text"
                name="vehicle"
                value={editData.vehicle.serialNumber}
                list="vehicle-list"
                onChange={handleChange}
              />
            </div>
            <div className='edit-fields node'>
              <label>Неисправный узел</label>
              {/*<input*/}
              {/*  type="text"*/}
              {/*  name="nodeFailure"*/}
              {/*  value={editData.nodeFailure.name}*/}
              {/*  onChange={handleChange}*/}
              {/*/>*/}
              <InputListSelect
                name="nodeFailure"
                url='api/v1/complaint/failure-node/'
                valueName='name'
                valueInput={editData.nodeFailure.name}
                handleChange={handleChange}
              />
            </div>
            <div className='edit-fields operating-time'>
              <label>Наработка, м/час</label>
              <input
                type="number"
                name="operatingTime"
                value={editData.operatingTime}
                onChange={handleChange}
              />
            </div>
            <div className='edit-fields used-parts'>
              <label>Используемые запчасти</label>
              <input
                type="text"
                name="usedParts"
                value={editData.usedParts}
                onChange={handleChange}
              />
            </div>
            <div className='edit-fields recovery-method'>
              <label>Метод восстановления</label>
              <input
                type="text"
                name="recoveryMethod"
                value={editData.recoveryMethod.name}
                onChange={handleChange}
              />
            </div>
            <div className='edit-fields date-recovery'>
              <label>Дата восстановления</label>
              <input
                type="date"
                name="dateRecovery"
                value={editData.dateRecovery}
                onChange={handleChange}
              />
            </div>

            <div className='edit-buttons'>
              <a onClick={handleSaveClick}>Сохранить</a>
              <a onClick={handleCancelClick}>Отмена</a>
            </div>
          </div>
        )
        : (
          <div className='view-mode'>
            <div className='view-field date-failure'>
              <label>Дата поломки:</label>
              <span>{editData.dateFailure}</span>
            </div>

            <div className='view-field vehicle'>
              <label>Машина:</label>
              <span>{editData.vehicle.serialNumber}</span>
            </div>
            <div className='view-field node'>
              <label>Неисправный узел:</label>
              <span>{editData.nodeFailure.name}</span>
            </div>
            <div className='view-field operating-time'>
              <label>Наработка, м/час:</label>
              <span>{editData.operatingTime}</span>
            </div>
            <div className='view-field used-parts'>
              <label>Используемые запчасти:</label>
              <span>{editData.usedParts}</span>
            </div>
            <div className='view-field recovery-method'>
              <label>Метод восстановления:</label>
              <span>{editData.recoveryMethod.name}</span>
            </div>
            <div className='view-field date-recovery'>
              <label>Дата восстановления:</label>
              <span>{editData.dateRecovery}</span>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default ComplaintDetail;
