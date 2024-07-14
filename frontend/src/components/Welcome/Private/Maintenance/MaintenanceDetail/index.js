import React, {useEffect, useState} from "react";
import './index.css';
import {useNavigate, useParams} from "react-router-dom";
import InputListSelect from "../../../../InputListSelect";
import usePermissions from "../../../../../hooks/usePermissions";
import api from "../../../../../api";


const MaintenanceDetail = () => {
  const navigate = useNavigate();
  const hasPermission = usePermissions();

  const hasEditPermission = hasPermission('change_maintenance') || hasPermission('superuser');
  const hasAddPermission = hasPermission('add_maintenance') || hasPermission('superuser');
  const hasDeletePermission = hasPermission('delete_maintenance') || hasPermission('superuser');

  const params = useParams();

  const [editMode, setEditMode] = useState( true);

  const prodId = params?.id;

  const createMaintenance = prodId === 'add';

  let url = 'api/v1/maintenance/'
  if (!createMaintenance)
    url = `api/v1/maintenance/${prodId}/`

  const [data, setData] = useState({
    vehicle: { serialNumber: '' },
    typeMaintenance: { name: '' },
    dateMaintenance: '',
    operatingTime: '',
    workOrder: '',
    dateOrder: '',
    organization: { name: '' },
    serviceCompany: { name: '' },
  });
  const [editData, setEditData] = useState(data);

  const fetchMaintenanceDetail = async () => {

    if (createMaintenance) return;

    await api.get(
      url,
    ).then((response) => {
      const data = response.data
      console.debug('MaintenanceDetail fetchMaintenanceDetail api.get response.data', data)
      setData(data);
      setEditData(data);
    }).catch((error) => {
      console.debug('MaintenanceDetail fetchMaintenanceDetail api.get', error)
    });
  }

  useEffect(() => {
    fetchMaintenanceDetail();
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
    if (createMaintenance)
      navigate(-1);

    setEditMode(false);
    setEditData(data); // Отмена изменений
  };
  const handleSaveClick = async () => {

    const payload = {
      ...editData,
      vehicle: editData.vehicle.id,
      typeMaintenance: editData.typeMaintenance.id,
      organization: editData.organization.id,
      serviceCompany: editData.serviceCompany.id
    };

    console.debug('MaintenanceDetail handleSaveClick', payload);

    if (!createMaintenance) {
      await api.put(
        url,
        payload
      ).then((response) => {
        setData(response.data);
        setEditMode(false);
      }).catch((error) => {
        console.debug('MaintenanceDetail handleSaveClick api.put', error)
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
        console.debug('MaintenanceDetail handleSaveClick api.put', error)
      });
    }

  };
  const handleDeleteClick = async () => {
    if (createMaintenance) return;

    const isConfirmed = window.confirm('Вы уверены, что хотите удалить эту запись?');

    if (isConfirmed) {
      await api.delete(
        url
      ).catch((error) => {
        console.debug('MaintenanceDetail handleDeleteClick api.delete', error);
      });
      console.debug('MaintenanceDetail handleDeleteClick api.delete');
      navigate(-1);
    }
  }

  if (createMaintenance && !hasAddPermission) {
    return <h1>У Вас нет прав на создание рекламаций</h1>;
  }

  return (
    <div className='detail-maintenanco-container'>
      {hasEditPermission && !editMode && (
        <img
          className='img-button-edit'
          src='/assets/img/edit_page.png'
          alt='Редактировать'
          onClick={handleEditClick}
        />
      )}
      <h2>
        {createMaintenance
          ? 'Создание записи о ТО'
          : editMode
            ? 'Редактирование записи о ТО'
            : 'Подробности записи о ТО'}
      </h2>
      {editMode ? (
        <EditMode
          editData={editData}
          handleChange={handleChange}
          handleSaveClick={handleSaveClick}
          handleCancelClick={handleCancelClick}
          handleDeleteClick={handleDeleteClick}
          hasDeletePermission={hasDeletePermission}
          createMaintenance={createMaintenance}
        />
      ) : (
        <ViewMode data={editData}/>
      )}
    </div>
  )
}

const EditMode = ({
                    editData,
                    handleChange,
                    handleSaveClick,
                    handleCancelClick,
                    handleDeleteClick,
                    hasDeletePermission,
                    createMaintenance
}) => (
  <div className='edit-mode'>
    <EditFieldSelect label='Машина' name='vehicle' value={editData.vehicle.serialNumber} handleChange={handleChange} url='api/v1/vehicles/' valueName='serialNumber'/>
    <EditFieldSelect label='Вид ТО' name='typeMaintenance' value={editData.typeMaintenance.name} handleChange={handleChange} url='api/v1/maintenance/maintenance-type/' valueName='name'/>
    <EditField label='Дата ТО' type='date' name='dateMaintenance' value={editData.dateMaintenance} handleChange={handleChange}/>
    <EditField label='Наработка, м/час' type='number' name='operatingTime' value={editData.operatingTime} handleChange={handleChange}/>
    <EditField label='Номер заказ наряда' type='text' name='workOrder' value={editData.workOrder} handleChange={handleChange} />
    <EditField label='Дата заказ наряда' type='date' name='dateOrder' value={editData.dateOrder} handleChange={handleChange}/>
    <EditFieldSelect label='Организация' name='organization' value={editData.organization.name} handleChange={handleChange} url='api/v1/maintenance/organizations/' valueName='name' />
    <EditFieldSelect label='Сервисная компания' name='serviceCompany' value={editData.serviceCompany.name} handleChange={handleChange} url='api/v1/account/service-company/' valueName='name' />

    <div className='buttons'>
      <div className='delete-button'>
        {!createMaintenance && hasDeletePermission &&
          <a onClick={handleDeleteClick}>Удалить</a>
        }
      </div>
      <div className='edit-buttons'>
        <a
          onClick={handleSaveClick}
          className={''}
        >
          Сохранить
        </a>
        <a onClick={handleCancelClick}>Отмена</a>
      </div>
    </div>
  </div>
);

const EditField = ({ label, type, name, value, handleChange }) => (
  <div className='edit-fields'>
    <label htmlFor={name}>{label}</label>
    <input type={type} id={name} name={name} value={value} onChange={handleChange} />
  </div>
);

const EditFieldSelect = ({ label, name, value, handleChange, url, valueName }) => (
  <div className='edit-fields'>
    <label htmlFor={name}>{label}</label>
    <InputListSelect name={name} id={name} url={url} valueName={valueName} valueInput={value} handleChange={handleChange} />
  </div>
);

const ViewMode = ({ data }) => (
  <div className='view-mode'>
    <ViewField label='Дата ТО' value={data.dateMaintenance}/>
    <ViewField label='Машина' value={data.vehicle.serialNumber}/>
    <ViewField label='Вид ТО' value={data.typeMaintenance.name}/>
    <ViewField label='Наработка, м/час' value={data.operatingTime}/>
    <ViewField label='Номер заказ наряда' value={data.workOrder}/>
    <ViewField label='Дата заказ наряда' value={data.dateOrder}/>
    <ViewField label='Организация' value={data.organization.name}/>
    <ViewField label='Сервисная компания' value={data.serviceCompany.name}/>
  </div>
);

const ViewField = ({ label, value }) => (
  <div className='view-field'>
    <span className='label'>{label}:</span>
    <span className='value'>{value}</span>
  </div>
);

export default MaintenanceDetail;