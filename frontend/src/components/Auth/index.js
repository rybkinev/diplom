import React, {useEffect, useRef, useState} from "react";
import './index.css';
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import Loader from "../Loader";
import api from "../../api";
import {setUser} from "../../store/userSlice";


const Auth = ({isOpen, setIsOpen}) => {
  const inputRef = useRef(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const closeAuth = () => {
    setIsOpen(false);
    setUsername('');
    setPassword('');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    await api.post(
      '/api/v1/account/token/',
      {username, password}
    ).then((response) => {
      const { access, refresh } = response.data;

      // console.debug('handleSubmit 1', response.data);
      // console.debug('accessToken', access);
      // console.debug('refreshToken', refresh);

      setUsername('');
      setPassword('');
      setLoading(false);

      dispatch(setUser({accessToken: access, refreshToken: refresh, login: username}));

      const state = location.state;
      const background = state && state.background;
      if (background.pathname === '/swagger') {
        // Если текущая страница /swagger, остаёмся на ней
        navigate(background.pathname);
      } else {
        // В остальных случаях редирект на "private"
        navigate('private');
      }

    })
      .catch((error) => {
        setLoading(false);
        console.error('Login failed', error);
        if (error.response?.status === 401) {
          setPasswordError('Неправильный пароль');
        }
        else {
          console.debug('Auth error not 401');
          // TODO Желательно показывать какую то другую ошибку
          setPasswordError('Непредвиденная ошибка');
        }
      });
  }

  return(
    <form className="auth-form" method='post' onSubmit={handleSubmit}>
      <div className="wrap-input" data-validate="Enter username">
        <span>Логин:</span>
        <input
          type='text'
          value={username}
          autoComplete='on'
          required
          className={loginError ? 'input-error' : ''}
          onChange={(e) => setUsername(e.target.value)}
          ref={inputRef}
        />
        {loginError && <span className="error-message">{loginError}</span>}
      </div>
      <div className="wrap-input" data-validate="Enter password">
        <span>Пароль:</span>
        <input
          type='password'
          value={password}
          autoComplete='on'
          required
          className={passwordError ? 'input-error' : ''}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && <span className="error-message">{passwordError}</span>}
      </div>
      <button
        className="auth-form-btn-submit"
        type='submit'
        disabled={!(username && password)}
      >
        {loading && <Loader/>}
        {!loading && 'Войти'}
      </button>
    </form>
  )
}


export default Auth;
