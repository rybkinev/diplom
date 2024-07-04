import React, {useState} from "react";
import './index.css';


const UnAuth = () => {
  const [serialNumber, setSerialNumber] = useState('');

  const handleSearch = () => {

  }

  return (
    <main className='un-auth'>
      <span>Проверьте комплектацию и технические характеристики техники Силант</span>

      <div className='main-search-inp'>
        <input
          type='text'
          placeholder='Заводской номер'
          value={serialNumber}
          required={true}
          autoComplete='on'
          onChange={(e) => {setSerialNumber(e.target.value)}}
        />
        <button
          disabled={!serialNumber}
        >
          Поиск
        </button>
      </div>

      <span>Результат поиска:</span>
      <span>Информация о комплектации и технических характеристиках Вашей техники</span>
      <table>
        <tr>
          <td>Заводской номер</td>
          <td>Модель</td>
          <td>Модель двигателя</td>
          <td>Модель трансмиссии</td>
          <td>Модель ведущего моста</td>
          <td>Модель управляемого моста</td>
        </tr>
      </table>
    </main>
  )
}

export default UnAuth;