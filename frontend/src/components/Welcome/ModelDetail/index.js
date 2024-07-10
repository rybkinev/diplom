import React, {useEffect, useState} from "react";
import './index.css';
import api from "../../../api";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchPermissions} from "../../../store/userSlice";


const ModelDetail = ({url, title, editPermission}) => {
  const [data, setData] = useState({
    name: '',
    description: '',
    label: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(data);

  const params = useParams();
  const prodId = params.id;

  const dispatch = useDispatch();
  const permissions = useSelector((state) => state.user.permissions);

  const fetchModelDetail = async () => {

    await api.get(
      `api/v1${url}${prodId}`,
    ).then((response) => {
      const data = response.data
      // console.debug('get model detail', data)
      setData(data);
      setEditData(data);
    }).catch((error) => {
      console.debug('VehicleDetail fetchVehicleDetail api.get', error)
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchModelDetail();
    };

    fetchData();

  }, [url]);
  useEffect(() => {
    dispatch(fetchPermissions());
  }, [dispatch]);


  const hasPermission = (perm) => permissions.includes(perm);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelClick = () => {
    setEditMode(false);
    setEditData(data); // Отмена изменений
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSaveClick = async () => {
    try {
      const response = await api.put(
        `api/v1${url}${prodId}/`,
        editData
      );
      setData(response.data);
      setEditMode(false);
    } catch (error) {
      console.debug('handleSaveClick api.put', error);
    }
  };

  return(
    <div className='model-detail'>
      {(hasPermission(editPermission) || hasPermission('superuser')) && !editMode &&
        <img
          className='img-button-edit'
          src='/assets/img/edit_white.png'
          alt='Редактировать'
          onClick={handleEditClick}
        />
      }

      {/*<h2>Подробное описание {title} {data.name}</h2>*/}
      {/*{data?.description &&*/}
      {/*  <span>{data.description}</span>*/}
      {/*}*/}
      {/*{!data?.description &&*/}
      {/*  <span>Описание еще не добавлено</span>*/}
      {/*}*/}
      {editMode ? (
        <div className='edit-mode'>
          <div className='edit-name'>
            <label>Название</label>
            <input
              type="text"
              name="name"
              value={editData.name}
              onChange={handleChange}
            />
          </div>
          <div className='edit-description'>
            <label>Описание</label>
            <textarea
              name="description"
              value={editData.description}
              onChange={handleChange}
            />
          </div>
          <div className='edit-buttons'>
            <a onClick={handleSaveClick}>Сохранить</a>
            <a onClick={handleCancelClick}>Отмена</a>
          </div>
        </div>
      ) : (
        <>
          <h2>Подробное описание {title} {data.name}</h2>
          {/*<span>{data?.description || 'Описание еще не добавлено'}</span>*/}
          <span>
            {/*Добаляю логику для сохранения переносов строк*/}
            {data.description
              ? data.description.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))
              : 'Описание еще не добавлено'
            }
          </span>
        </>
      )}
    </div>
  )
}

export default ModelDetail;
