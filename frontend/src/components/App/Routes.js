import React from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import Welcome from "../Welcome";
import Swagger from "../Swagger";


export function PrivateRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Welcome/>}/>
      {/*<Route path='/search' element={<Search/>}/>*/}
      {/*<Route path='/result' element={<SearchResult/>}/>*/}
      <Route path="/swagger" element={<Swagger/>}/>
      <Route path="*" element={<Navigate to="/" />}/>
    </Routes>
  )
}


export function PublicRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Welcome/>}/>
      {/*<Route path='/login' element={<Authorization/>}/>*/}
      <Route path="/swagger" element={<Swagger/>}/>
      <Route path="*" element={<Navigate to="/" />}/>
    </Routes>
  )
}