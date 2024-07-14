import React, {useEffect, useState} from "react";
import './index.css';
import {useNavigate, useParams} from "react-router-dom";
// import {useDispatch, useSelector} from "react-redux";
import api from "../../../../../api";
// import {fetchPermissions} from "../../../../../store/userSlice";
import InputListSelect from "../../../../InputListSelect";
import usePermissions from "../../../../../hooks/usePermissions";


const ComplaintDetail = () => {
  const navigate = useNavigate();
  const hasPermission = usePermissions();

  const params = useParams();

  const addPermission = 'add_complaint';
  const editPermission = 'change_complaint';
  const deletePermission = 'delete_complaint';
  const superuserPermission = 'superuser';

  const [editMode, setEditMode] = useState( true);
  const prodId = params?.id;

  const createComplaint = prodId === 'add';

  let url = 'api/v1/complaint/'
  if (!createComplaint) {
    url = `api/v1/complaint/${prodId}/`
  }


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

    if (createComplaint) return;

    await api.get(
      url,
    ).then((response) => {
      const data = response.data
      // console.debug('ComplaintDetail fetchComplaintDetail api.get response.data', data)
      setData(data);
      setEditData(data);
    }).catch((error) => {
      console.debug('VehicleDetail fetchVehicleDetail api.get', error)
    });
  }

  useEffect(() => {
    // upgradePermission();
    fetchComplaintDetail();
    if (prodId !== 'add') {
      setEditMode(false);
    }
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

    const payload = {
      ...editData,
      vehicle: editData.vehicle.id,
      nodeFailure: editData.nodeFailure.id,
      recoveryMethod: editData.recoveryMethod.id,
      serviceCompany: editData.serviceCompany.id
    };

    // console.debug('ComplaintDetail handleSaveClick', payload);

    if (!createComplaint) {
      await api.put(
        url,
        payload
      ).then((response) => {
        setData(response.data);
        setEditMode(false);
      }).catch((error) => {
        console.debug('ComplaintDetail handleSaveClick api.put', error)
      });
    }
    else {
      await api.post(
        url,
        payload
      ).then((response) => {
        setData(response.data);
        setEditMode(false);
      }).catch((error) => {
        console.debug('ComplaintDetail handleSaveClick api.put', error)
      });
    }

  };
  const handleDeleteClick = async () => {
    if (createComplaint) return;

    const isConfirmed = window.confirm('Вы уверены, что хотите удалить эту запись?');

    if (isConfirmed) {
      await api.delete(
        url
      ).catch((error) => {
        console.debug('handleDeleteClick api.delete', error);
      });
      navigate(-1);
      console.debug('handleDeleteClick api.delete');
    }
  }

  return (
    <div className='detail-complaint-container'>
      {createComplaint && !hasPermission(addPermission) && !hasPermission(superuserPermission) &&
        <h1>У Вас нет прав на создание рекламаций</h1>
      }
      {(hasPermission(editPermission) || hasPermission(superuserPermission)) && !editMode &&
        <img
          className='img-button-edit'
          src='/assets/img/edit_page.png'
          alt='Редактировать'
          onClick={handleEditClick}
        />
      }
      <h2>{!createComplaint ? editMode ? 'Редактирование рекламации' : 'Подробности рекламации' : 'Создание рекламации'}</h2>
      {editMode
        ? (
          <div className='edit-mode'>
            <div className='edit-fields date-failure'>
              <label htmlFor='editDateFailure'>Дата поломки</label>
              <input
                type="date"
                id='editDateFailure'
                name="dateFailure"
                value={editData.dateFailure}
                onChange={handleChange}
              />
            </div>

            <div className='edit-fields vehicle'>
              <label htmlFor='editVehicle'>Машина</label>
              {/*<input*/}
              {/*  type="text"*/}
              {/*  id='editVehicle'*/}
              {/*  name="vehicle"*/}
              {/*  value={editData.vehicle.serialNumber}*/}
              {/*  list="vehicle-list"*/}
              {/*  onChange={handleChange}*/}
              {/*/>*/}
              <InputListSelect
                name="vehicle"
                id='editVehicle'
                url='api/v1/vehicles/'
                valueName='serialNumber'
                valueInput={editData.vehicle.serialNumber}
                handleChange={handleChange}
              />
            </div>
            <div className='edit-fields node'>
              <label htmlFor='editNodeFailure'>Неисправный узел</label>
              <InputListSelect
                name="nodeFailure"
                id='editNodeFailure'
                url='api/v1/complaint/failure-node/'
                valueName='name'
                valueInput={editData.nodeFailure.name}
                handleChange={handleChange}
              />
            </div>
            <div className='edit-fields operating-time'>
              <label htmlFor='editOperatingTime'>Наработка, м/час</label>
              <input
                type="number"
                id='editOperatingTime'
                name="operatingTime"
                value={editData.operatingTime}
                onChange={handleChange}
              />
            </div>
            <div className='edit-fields used-parts'>
              <label htmlFor='editUsedParts'>Используемые запчасти</label>
              <input
                type="text"
                id='editUsedParts'
                name="usedParts"
                value={editData.usedParts}
                onChange={handleChange}
              />
            </div>
            <div className='edit-fields recovery-method'>
              <label htmlFor='editRecoveryMethod'>Метод восстановления</label>
              {/*<input*/}
              {/*  type="text"*/}
              {/*  name="recoveryMethod"*/}
              {/*  id='editRecoveryMethod'*/}
              {/*  value={editData.recoveryMethod.name}*/}
              {/*  onChange={handleChange}*/}
              {/*/>*/}
              <InputListSelect
                name="recoveryMethod"
                id='editRecoveryMethod'
                url='api/v1/complaint/recovery-method/'
                valueName='name'
                valueInput={editData.recoveryMethod.name}
                handleChange={handleChange}
              />
            </div>
            <div className='edit-fields date-recovery'>
              <label htmlFor='editDateRecovery'>Дата восстановления</label>
              <input
                type="date"
                id='editDateRecovery'
                name="dateRecovery"
                value={editData.dateRecovery}
                onChange={handleChange}
              />
            </div>
            <div className='edit-fields service-company'>
              <label htmlFor='editServiceCompany'>Сервисная компания</label>
              <InputListSelect
                name="serviceCompany"
                id='editServiceCompany'
                url='api/v1/account/service-company/'
                valueName='name'
                valueInput={editData.serviceCompany.name}
                handleChange={handleChange}
              />
            </div>
            <div className='edit-fields description-failure'>
              <label htmlFor='editDescriptionFailure'>Описание неисправности</label>
              <input
                type="text"
                id='editDescriptionFailure'
                name="descriptionFailure"
                value={editData.descriptionFailure}
                onChange={handleChange}
              />
            </div>

            <div className='buttons'>
              <div className='delete-button'>
                {(!createComplaint && (hasPermission(deletePermission) || hasPermission(superuserPermission))) &&
                  <a onClick={handleDeleteClick}>Удалить</a>
                }
              </div>
              <div className='edit-buttons'>
                <a onClick={handleSaveClick}>Сохранить</a>
                <a onClick={handleCancelClick}>Отмена</a>
              </div>
            </div>
          </div>
        )
        : (
          <div className='view-mode'>
            <div className='view-field date-failure'>
              <label htmlFor='dateFailure'>Дата поломки:</label>
              <span id='dateFailure'>{editData.dateFailure}</span>
            </div>

            <div className='view-field vehicle'>
              <label htmlFor='serialNumber'>Машина:</label>
              <span id='serialNumber'>{editData.vehicle.serialNumber}</span>
            </div>
            <div className='view-field node'>
              <label htmlFor='nodeFailure'>Неисправный узел:</label>
              <span id='nodeFailure'>{editData.nodeFailure.name}</span>
            </div>
            <div className='view-field operating-time'>
              <label htmlFor='operatingTime'>Наработка, м/час:</label>
              <span id='operatingTime'>{editData.operatingTime}</span>
            </div>
            <div className='view-field used-parts'>
              <label htmlFor='usedParts'>Используемые запчасти:</label>
              <span id='usedParts'>{editData.usedParts}</span>
            </div>
            <div className='view-field recovery-method'>
              <label htmlFor='recoveryMethod'>Метод восстановления:</label>
              <span id='recoveryMethod'>{editData.recoveryMethod.name}</span>
            </div>
            <div className='view-field date-recovery'>
              <label htmlFor='dateRecovery'>Дата восстановления:</label>
              <span id='dateRecovery'>{editData.dateRecovery}</span>
            </div>
            <div className='view-field service-company'>
              <label htmlFor='serviceCompany'>Сервисная компания:</label>
              <span id='serviceCompany'>{editData.serviceCompany.name}</span>
            </div>
            <div className='view-field description-failure'>
              <label htmlFor='descriptionFailure'>Сервисная компания:</label>
              <span id='descriptionFailure'>{editData.descriptionFailure}</span>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default ComplaintDetail;
