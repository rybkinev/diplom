import React, {useEffect} from 'react';
import './index.css';
import Header from "../Header";
import {useNavigate} from "react-router-dom";
import {PrivateRoutes, PublicRoutes} from './Routes';
import {useDispatch, useSelector} from "react-redux";
import {logout, setUser} from "../../store/userSlice";
import Footer from "../Footer";
// import api from "../API/api";

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  // useEffect(() => {
  //   const accessToken = localStorage.getItem('accessToken');
  //   const refreshToken = localStorage.getItem('refreshToken');
  //
  //   if (refreshToken) {
  //     const fetchUser = async () => {
  //       try {
  //         const response = await api.post('/api/token/refresh/', {
  //           refresh: refreshToken,
  //         });
  //         const newAccessToken = response.data.access;
  //
  //         const userResponse = await api.get('/api/user/', {
  //           headers: {
  //             Authorization: `Bearer ${newAccessToken}`,
  //           },
  //         });
  //
  //         dispatch(setUser({
  //           user: userResponse.data,
  //           accessToken: newAccessToken,
  //           refreshToken,
  //         }));
  //       } catch (error) {
  //         dispatch(logout());
  //         console.error('Failed to refresh token', error);
  //       }
  //     };
  //
  //     if (accessToken) {
  //       api.get('/api/user/', {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }).then((response) => {
  //         dispatch(setUser({
  //           user: response.data,
  //           accessToken,
  //           refreshToken,
  //         }));
  //       }).catch(fetchUser);
  //     } else {
  //       fetchUser();
  //     }
  //   }
  // }, [dispatch]);
  //
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate('/requests');
  //   } else {
  //     navigate('/login');
  //   }
  // }, []);
  //
  return (
    <>
      <Header/>

      {isAuthenticated
        ?
          <PrivateRoutes/>
        :
          <PublicRoutes/>
      }

      <Footer/>
    </>
  )
}


export default App;