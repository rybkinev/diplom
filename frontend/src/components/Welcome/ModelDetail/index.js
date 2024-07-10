import React, {useEffect, useState} from "react";
import './index.css';
import api from "../../../api";
import {useParams} from "react-router-dom";


const ModelDetail = ({url, title}) => {
  const [data, setData] = useState({
    name: '',
    description: '',
    label: ''
  });
  const params = useParams();
  const prodId = params.id;

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


  return(
    <div className='model-detail'>
      <h2>Подробное описание {title} {data.name}</h2>
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
