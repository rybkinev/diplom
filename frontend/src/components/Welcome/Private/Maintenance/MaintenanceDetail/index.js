import React, {useState} from "react";
import './index.css';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";


const MaintenanceDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const permissions = useSelector((state) => state.user?.permissions);
  const params = useParams();

  const state = location?.state || {};
  const [editMode, setEditMode] = useState( false);

  const editPermission = 'change_maintenance'
  const deletePermission = 'delete_maintenance'

  const hasPermission = (perm) => permissions.includes(perm);

  const prodId = params?.id;

  let url = 'api/v1/maintenance/'
  if (prodId)
    url = `api/v1/maintenance/${prodId}/`

  return (
    <div className='detail-maintenance-container'>
      {(hasPermission(editPermission) || hasPermission('superuser')) && !editMode &&
        <img
          className='img-button-edit'
          src='/assets/img/edit_page.png'
          alt='Редактировать'
          onClick={handleEditClick}
        />
      }
      <h2>{prodId ? editMode ? 'Редактирование рекламации' : 'Подробности рекламации' : 'Создание рекламации'}</h2>

    </div>
  )
}

export default MaintenanceDetail;