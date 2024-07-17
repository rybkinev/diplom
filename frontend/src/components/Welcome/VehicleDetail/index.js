import React, {useEffect, useState} from "react";
import './index.css';
import {useNavigate, useParams} from "react-router-dom";
import api from "../../../api";
import {useSelector} from "react-redux";
import Maintenance from "../Private/Maintenance";
import Complaints from "../Private/Complaints";
import usePermissions from "../../../hooks/usePermissions";
import InputListSelect from "../../InputListSelect";


const VehicleDetail = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const hasPermission = usePermissions();
  const hasEditPermission = hasPermission('change_vehicle') || hasPermission('superuser');
  const hasAddPermission = hasPermission('add_vehicle') || hasPermission('superuser');
  const hasDeletePermission = hasPermission('delete_vehicle') || hasPermission('superuser');

  const params = useParams();
  const prodId = params.id;

  // const [vehicleInfo, setVehicleInfo] = useState({});
  const [activePage, setActivePage] = useState('maintenance');

  const [editMode, setEditMode] = useState( true);
  const [createVehicle, setCreateVehicle] = useState(prodId === 'add');

  let url = 'api/v1/vehicles/';
  if (!createVehicle)
    url = `api/v1/vehicles/${prodId}/`;

  const [data, setData] = useState({
    serialNumber: '',
    vehicleModel: { name: '' },
    engineModel: { name: '' },
    snEngine: '',
    transmissionModel: { name: '' },
    snTransmission: '',
    driveAxleModel: { name: '' },
    snDriveAxle: '',
    steeringAxleModel: { name: '' },
    snSteeringAxle: '',
    shippingDate: '',
    deliveryAddress: '',
    serviceCompany: { name: '' },
    contract: '',
    consignee: '',
    equipment: '',
    client: { name: '' },
  });
  const [editData, setEditData] = useState(data);

  const fetchVehicleDetail = async () => {

    if (createVehicle) return;

    await api.get(
      url,
    ).then((response) => {
      const data = response.data
      // console.debug('get vehicle detail', data)
      setData(data);
      setEditData(data);
    }).catch((error) => {
      console.debug('VehicleDetail fetchVehicleDetail api.get', error)
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchVehicleDetail();
    };

    if (prodId !== 'add') {
      setEditMode(false);
    }

    fetchData();

  }, [prodId]);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleCancelClick = () => {
    if (createVehicle)
      navigate(-1);

    setEditMode(false);
    setEditData(data); // Отмена изменений
  };
  const handleSaveClick = async () => {

    const payload = {
      ...editData,
      vehicleModel: editData.vehicleModel.id,
      engineModel: editData.engineModel.id,
      transmissionModel: editData.transmissionModel.id,
      driveAxleModel: editData.driveAxleModel.id,
      steeringAxleModel: editData.steeringAxleModel.id,
      serviceCompany: editData.serviceCompany.id,
      consignee: editData.consignee.id,
      client: editData.client.id,
    };

    console.debug('VehicleDetail handleSaveClick', payload);

    if (!createVehicle) {
      await api.put(
        url,
        payload
      ).then((response) => {
        setData(response.data);
        setEditMode(false);
      }).catch((error) => {
        console.debug('VehicleDetail handleSaveClick api.put', error)
      });
    }
    else {
      await api.post(
        url,
        payload
      ).then((response) => {
        setData(response.data);
        setEditMode(false);
        window.history.replaceState(null, '', `/vehicles/${response.data.id}`);
        setCreateVehicle(false);
      }).catch((error) => {
        console.debug('VehicleDetail handleSaveClick api.put', error)
      });
    }

  };
  const handleDeleteClick = async () => {
    if (createVehicle) return;

    const isConfirmed = window.confirm('Вы уверены, что хотите удалить эту запись?');

    if (isConfirmed) {
      await api.delete(
        url
      ).catch((error) => {
        console.debug('VehicleDetail handleDeleteClick api.delete', error);
      });
      console.debug('VehicleDetail handleDeleteClick api.delete');
      navigate(-1);
    }
  }

  if (createVehicle && !hasAddPermission) {
    return <h1>У Вас нет прав на создание машин</h1>;
  }

  return (
    <div className='vehicle-detail'>
      {hasEditPermission && !editMode && (
        <img
          className='img-button-edit'
          src='/assets/img/edit_page.png'
          alt='Редактировать'
          onClick={handleEditClick}
        />
      )}
      {/*Кнопка на Главную*/}
      <h1>
        {createVehicle
          ? 'Создание машины'
          : editMode
            ? `Редактирование данных о машине ${data.vehicleModel?.name}`
            : `Подробные сведения о машине ${data.vehicleModel?.name}`
        }
      </h1>
      {!editMode
        ? (
            <ViewMode
              vehicleInfo={data}
              isAuthenticated={isAuthenticated}
              createVehicle={createVehicle}
              activePage={activePage}
              setActivePage={setActivePage}
            />
          )
        : (
            <EditMode
              editData={editData}
              handleChange={handleChange}
              handleSaveClick={handleSaveClick}
              handleCancelClick={handleCancelClick}
              handleDeleteClick={handleDeleteClick}
              hasDeletePermission={hasDeletePermission}
              createVehicle={createVehicle}
            />
          )
      }
    </div>
  )
}

const ViewMode = ({vehicleInfo, isAuthenticated, createVehicle, activePage, setActivePage}) => (
  <>
    <div className='detail-container'>
      <ReferenceDisplay model={vehicleInfo.vehicleModel} sn={vehicleInfo.serialNumber}/>
      <div className='detail-grid-container'>
        <ReferenceDisplay model={vehicleInfo.engineModel} sn={vehicleInfo.snEngine}/>
        <ReferenceDisplay model={vehicleInfo.transmissionModel} sn={vehicleInfo.snTransmission}/>
        <ReferenceDisplay model={vehicleInfo.driveAxleModel} sn={vehicleInfo.snDriveAxle}/>
        <ReferenceDisplay model={vehicleInfo.steeringAxleModel} sn={vehicleInfo.snSteeringAxle}/>
      </div>
      <Detail label={'Комплектация'} valueDetail={vehicleInfo?.equipment}/>
      <Detail label={'Адрес доставки'} valueDetail={vehicleInfo?.deliveryAddress}/>
      <Detail label={'Грузополучатель'} valueDetail={vehicleInfo?.consignee}/>
      <Detail label={'Договор'} valueDetail={vehicleInfo?.contract}/>
      <Detail label={'Покупатель'} valueDetail={vehicleInfo?.client?.firstName}/>
      <Detail label={'Сервисная компания'} valueDetail={vehicleInfo.serviceCompany?.name}/>
    </div>
    {!createVehicle && isAuthenticated &&
      <>
        <div className='vehicle-detail-navigate'>
          <a
            className={activePage === 'maintenance' ? 'active' : ''}
            onClick={() => setActivePage('maintenance')}
          >
            ТО
          </a>
          <a
            className={activePage === 'complaints' ? 'active' : ''}
            onClick={() => setActivePage('complaints')}
          >
            Рекламации
          </a>
        </div>
        {activePage === 'maintenance' &&
          <Maintenance/>
        }
        {activePage === 'complaints' &&
          <Complaints/>
        }
      </>
    }
  </>
)


const ReferenceDisplay = ({model, sn}) => {
  return (
    <div className='model-container'>
      <div className='model-info'>
        <div className='model-name'>
          <span>{model?.label}: </span>
          <span>{model?.name}</span>
        </div>
        {sn
          ?
          <div className='model-sn'>
            <span>Серийный номер: </span>
            <span>{sn}</span>
          </div>
          : <></>
        }
      </div>
      {/*<div className='description'>*/}
      {/*  <span>{model?.description}</span>*/}
      {/*</div>*/}
    </div>
  )
}
const Detail = ({ label, valueDetail }) => {
  return (
    <>
      {valueDetail && (
        <div className='detail'>
          <span className='label'>{label}: </span>
          <span>{valueDetail}</span>
        </div>
      )}
    </>
  );
}

const EditMode = ({
                    editData,
                    handleChange,
                    handleSaveClick,
                    handleCancelClick,
                    handleDeleteClick,
                    hasDeletePermission,
                    createVehicle
}) => (
  <div className='edit-mode'>
    <EditField label='Серийный номер' type='text' name='serialNumber' value={editData.serialNumber} handleChange={handleChange}/>
    <EditFieldSelect label='Модель техники' name='vehicleModel' value={editData.vehicleModel.name} handleChange={handleChange} url='api/v1/vehicles/vehicle-model/' valueName='name' />
    <EditFieldSelect label='Модель двигателя' name='engineModel' value={editData.engineModel.name} handleChange={handleChange} url='api/v1/vehicles/engine-model/' valueName='name' />
    <EditField label='Серийный номер двигателя' type='text' name='snEngine' value={editData.snEngine} handleChange={handleChange}/>
    <EditFieldSelect label='Модель трансмиссии' name='transmissionModel' value={editData.transmissionModel.name} handleChange={handleChange} url='api/v1/vehicles/transmission-model/' valueName='name' />
    <EditField label='Серийный номер трансмиссии' type='text' name='snTransmission' value={editData.snTransmission} handleChange={handleChange}/>
    <EditFieldSelect label='Модель ведущего моста' name='driveAxleModel' value={editData.driveAxleModel.name} handleChange={handleChange} url='api/v1/vehicles/drive-axle-model/' valueName='name' />
    <EditField label='Серийный номер ведущего моста' type='text' name='snDriveAxle' value={editData.snDriveAxle} handleChange={handleChange}/>
    <EditFieldSelect label='Модель управляемого моста' name='steeringAxleModel' value={editData.steeringAxleModel.name} handleChange={handleChange} url='api/v1/vehicles/steering-axle-model/' valueName='name' />
    <EditField label='Серийный номер управляемого моста' type='text' name='snSteeringAxle' value={editData.snSteeringAxle} handleChange={handleChange}/>
    <EditField label='Дата отгрузки' type='date' name='shippingDate' value={editData.shippingDate} handleChange={handleChange}/>
    <EditField label='Адрес доставки' type='text' name='deliveryAddress' value={editData.deliveryAddress} handleChange={handleChange}/>
    <EditFieldSelect label='Сервисная компания' name='serviceCompany' value={editData.serviceCompany.name} handleChange={handleChange} url='api/v1/account/service-company/' valueName='name' />
    <EditField label='Договор' type='text' name='contract' value={editData.contract} handleChange={handleChange}/>
    <EditField label='Грузополучатель' type='text' name='consignee' value={editData.consignee} handleChange={handleChange}/>
    <EditField label='Комплектация' type='text' name='equipment' value={editData.equipment} handleChange={handleChange}/>
    <EditFieldSelect label='Покупатель' name='client' value={editData.client.name} handleChange={handleChange} url='api/v1/vehicles/clients/' valueName='firstName' />
    <div className='buttons'>
      <div className='delete-button'>
        {!createVehicle && hasDeletePermission &&
          <a onClick={handleDeleteClick}>Удалить</a>
        }
      </div>
      <div className='edit-buttons'>
        <a
          onClick={handleSaveClick}
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

export default VehicleDetail;
