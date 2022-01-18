import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ReactComponent as ArrowRight } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <>
      <div className='page__container'>
        <header>
          <p className='page__header'>Welcome Back!</p>
        </header>

        <form>
          <input
            type='email'
            className='email__input'
            placeholder='Email'
            id='email'
            onChange={onChange}
          />
          <div className='password__container'>
            <input
              type={showPassword ? 'text' : 'password'}
              className='password__input'
              placeholder='Password'
              id='password'
              value={password}
              onChange={onChange}
            />
            <img
              src={visibilityIcon}
              alt='Show Password'
              className='show__password'
              onClick={() => setShowPassword((prevState) => !prevState)}
            />
          </div>
          <Link to='/forgot-password' className='forgot__password'>
            Forgot Password
          </Link>
          <div className='signIn__bar'>
            <p className='signIn__text'>Sign In</p>
            <button className='signIn__btn'>
              <ArrowRight fill='#ffffff' width='34px' height='34px' />
            </button>
          </div>
        </form>

        {/* google oauth */}
        <Link to='/sign-up' className='register__link'>
          Sign Up
        </Link>
      </div>
    </>
  );
}

export default SignIn;
