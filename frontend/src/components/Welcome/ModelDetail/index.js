import React, {useEffect, useState} from "react";
import './index.css';
import api from "../../../api";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";


const ModelDetail = ({url, title}) => {
  const [data, setData] = useState({
    name: '',
    description: '',
    label: ''
  });
  const params = useParams();
  const prodId = params.id;

  const permissions = useSelector((state) => state.user.permissions);

  const fetchModelDetail = async () => {

    await api.get(
      `api/v1${url}${prodId}`,
    ).then((response) => {
      const data = response.data
      // console.debug('get model detail', data)
      setData(data);
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

  // const hasPermission = (perm) => permissions.includes(perm);

  return(
    <div className='model-detail'>
      {/*{hasPermission('change_maintenance') &&*/}
        <h2>Подробное описание {title} {data.name}</h2>
      {/*}*/}
      {data?.description &&
        <span>{data.description}</span>
      }
      {!data?.description &&
        <span>Описание еще не добавлено</span>
      }
    </div>
  )
}

export default ModelDetail;
