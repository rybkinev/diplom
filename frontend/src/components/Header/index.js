import React, {useEffect, useState} from "react";
import './index.css';
import Auth from "../Auth";
import {useDispatch, useSelector} from "react-redux";
import {logoutUser} from "../../store/userSlice";
import {Link, useLocation, useNavigate} from "react-router-dom";


const Header = () => {
  const phoneNumber = '+7-8352-20-12-09';
  const [isOpenAuth, setIsOpenAuth] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation()

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

  // const handleLoginUser = () => {
  //   console.debug('Header open Auth')
  //   setIsOpenAuth(true)
  // }

  const handleLogoutUser = () => {
    dispatch(logoutUser());
    if (location.pathname !== '/swagger') {
      // Если текущая страница /swagger, остаёмся на ней
      navigate("/");
    }
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
            // <a
            //   className='btn-login'
            //   onClick={handleLoginUser}
            // >
            //   Войти
            // </a>
            <Link
              to='login'
              state={{background: location}}
              className='btn-login'
            >
              Войти
            </Link>
      }


      {/*<Auth isOpen={isOpenAuth} setIsOpen={setIsOpenAuth}/>*/}
    </header>
  )
}

export default Header;