import React, {useEffect, useState} from "react";
import './index.css';
import Auth from "../Auth";
import {useDispatch, useSelector} from "react-redux";
import {logout, logoutUser} from "../../store/userSlice";


const Header = () => {
  const phoneNumber = '+7-8352-20-12-09';
  const [isOpenAuth, setIsOpenAuth] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const dispatch = useDispatch();

  const openAuth = () => {
    console.debug('Header open Auth')
    setIsOpenAuth(true)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 5) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogoutUser = () => {
    // dispatch(logout());
    dispatch(logoutUser());
    console.debug('logout')
  }

  return (
    <header className={isScrolled ? 'scrolled' : ''}>
      <img
        className='brand-logo'
        src='/assets/img/logo/Logo_Blue.svg'
        alt='Logo'
      />

      <h1>
        Электронная сервисная книжка "Мой Силант"
      </h1>
      <address>
        <p>
          <a href={'tel:' + phoneNumber}>{phoneNumber}</a> , telegram
        </p>
      </address>
      {
        isAuthenticated
          ?
            <a
              className='btn-login'
              onClick={handleLogoutUser}
            >
              Выйти
            </a>
          :
            <a
              className='btn-login'
              onClick={openAuth}
            >
              Войти
            </a>
      }


      <Auth isOpen={isOpenAuth} setIsOpen={setIsOpenAuth}/>
    </header>
  )
}

export default Header;