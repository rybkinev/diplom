import React, {useEffect, useState} from "react";
import './index.css';
import {useNavigate, useParams} from "react-router-dom";
import api from "../../../../../api";
import InputListSelect from "../../../../InputListSelect";
import usePermissions from "../../../../../hooks/usePermissions";
import {EditField} from '../../Fields';


const ComplaintDetail = () => {
  const navigate = useNavigate();
  const hasPermission = usePermissions();

  const params = useParams();

  const hasEditPermission = hasPermission('change_complaint') || hasPermission('superuser');
  const hasAddPermission = hasPermission('add_complaint') || hasPermission('superuser');
  const hasDeletePermission = hasPermission('delete_complaint') || hasPermission('superuser');

  const [editMode, setEditMode] = useState( true);
  const prodId = params?.id;

  const [createComplaint, setCreateComplaint] = useState(prodId === 'add');

  let url = 'api/v1/complaint/'
  if (!createComplaint) {
    url = `api/v1/complaint/${prodId}/`
  }

  const [data, setData] = useState({
    // name: '',
    dateFailure: '',
    vehicle: { serialNumber: '' },
    descriptionFailure: '',
    nodeFailure: { name: '' },
    operatingTime: '',
    usedParts: '',
    recoveryMethod: { name: '' },
    dateRecovery: '',
    serviceCompany: { name: '' },
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
    if (createComplaint)
      navigate(-1);

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
        window.history.replaceState(null, '', `/private/complaints/${response.data.id}`);
        setCreateComplaint(false);
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

  if (createComplaint && !hasAddPermission) {
    return <h1>У Вас нет прав на создание рекламаций</h1>;
  }

  return (
    <div className='detail-complaint-container'>
      {hasEditPermission && !editMode && (
        <img
          className='img-button-edit'
          src='/assets/img/edit_page.png'
          alt='Редактировать'
          onClick={handleEditClick}
        />
      )}
      <h2>
        {createComplaint
          ? 'Создание рекламации'
          : editMode
            ? 'Редактирование рекламации'
            : 'Подробности рекламации'}
      </h2>
      {editMode ? (
        <EditMode
          editData={editData}
          handleChange={handleChange}
          handleSaveClick={handleSaveClick}
          handleCancelClick={handleCancelClick}
          handleDeleteClick={handleDeleteClick}
          hasDeletePermission={hasDeletePermission}
          createComplaint={createComplaint}
        />
      ) : (
        <ViewMode data={editData} />
      )}
    </div>
  );
}

const EditMode = ({
                    editData,
                    handleChange,
                    handleSaveClick,
                    handleCancelClick,
                    handleDeleteClick,
                    hasDeletePermission,
                    createComplaint
}) => (
  <div className='edit-mode'>
    <EditField label='Дата поломки' type='date' name='dateFailure' value={editData.dateFailure} handleChange={handleChange} />
    <EditFieldSelect label='Машина' name='vehicle' value={editData.vehicle.serialNumber} handleChange={handleChange} url='api/v1/vehicles/' valueName='serialNumber' />
    <EditFieldSelect label='Неисправный узел' name='nodeFailure' value={editData.nodeFailure.name} handleChange={handleChange} url='api/v1/complaint/failure-node/' valueName='name' />
    <EditField label='Наработка, м/час' type='number' name='operatingTime' value={editData.operatingTime} handleChange={handleChange} />
    <EditField label='Используемые запчасти' type='text' name='usedParts' value={editData.usedParts} handleChange={handleChange} />
    <EditFieldSelect label='Метод восстановления' name='recoveryMethod' value={editData.recoveryMethod.name} handleChange={handleChange} url='api/v1/complaint/recovery-method/' valueName='name' />
    <EditField label='Дата восстановления' type='date' name='dateRecovery' value={editData.dateRecovery} handleChange={handleChange} />
    <EditFieldSelect label='Сервисная компания' name='serviceCompany' value={editData.serviceCompany.name} handleChange={handleChange} url='api/v1/account/service-company/' valueName='name' />
    <EditField label='Описание неисправности' type='text' name='descriptionFailure' value={editData.descriptionFailure} handleChange={handleChange} />

    <div className='buttons'>
      <div className='delete-button'>
        {!createComplaint && hasDeletePermission &&
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

// const EditField = ({label, type, name, value, handleChange}) => (
//   <div className='edit-fields'>
//     <label htmlFor={name}>{label}</label>
//     <input type={type} id={name} name={name} value={value} onChange={handleChange} />
//   </div>
// );

const EditFieldSelect = ({ label, name, value, handleChange, url, valueName }) => (
  <div className='edit-fields'>
    <label htmlFor={name}>{label}</label>
    <InputListSelect name={name} id={name} url={url} valueName={valueName} valueInput={value} handleChange={handleChange} />
  </div>
);

const ViewMode = ({ data }) => (
  <div className='view-mode'>
    <ViewField label='Дата поломки' value={data.dateFailure}/>
    <ViewField label='Машина' value={data.vehicle.serialNumber}/>
    <ViewField label='Неисправный узел' value={data.nodeFailure.name}/>
    <ViewField label='Наработка, м/час' value={data.operatingTime}/>
    <ViewField label='Используемые запчасти' value={data.usedParts}/>
    <ViewField label='Метод восстановления' value={data.recoveryMethod.name}/>
    <ViewField label='Дата восстановления' value={data.dateRecovery}/>
    <ViewField label='Сервисная компания' value={data.serviceCompany.name}/>
    <ViewField label='Описание неисправности' value={data.descriptionFailure}/>
  </div>
);

const ViewField = ({ label, value }) => (
  <div className='view-field'>
    <span className='label'>{label}:</span>
    <span className='value'>{value}</span>
  </div>
);


export default ComplaintDetail;
