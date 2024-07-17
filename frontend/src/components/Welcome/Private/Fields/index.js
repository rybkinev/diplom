import React from "react";
import './index.css';


const EditField = ({label, type, name, value, handleChange}) => (
  <div className='edit-fields'>
    <label htmlFor={name}>{label}</label>
    <input type={type} id={name} name={name} value={value} onChange={handleChange} />
  </div>
);

export {EditField};