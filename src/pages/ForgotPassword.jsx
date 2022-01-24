import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';

import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const onChange = (e) => {
    setEmail(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();

      await sendPasswordResetEmail(auth, email);
      toast.success('Please check your email for a reset link');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className='page__container'>
      <header>
        <p className='page__header'>Forgot Password</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <label htmlFor='email'></label>
          <input
            type='email'
            className='email__input'
            id={email}
            value={email}
            onChange={onChange}
          />
          <Link className='forgot__password' to='/sign-in'>
            Sign In
          </Link>

          <div className='signIn__bar'>
            <div className='signIn__text'>Send Reset link</div>
            <button className='signIn__btn'>
              <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default ForgotPassword;
