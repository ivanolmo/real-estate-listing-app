import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';

import { db } from '../firebase.config';
import { ReactComponent as ArrowRight } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const { name, email, password } = formData;

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  // create new user with Firestore auth
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // user object returned from Firestore
      const user = userCredential.user;

      // update user profile with the name they entered
      updateProfile(auth.currentUser, {
        displayName: name,
      });

      // create user data object, delete password, and add timestamp
      const userData = { ...formData };
      delete userData.password; // don't add user pass to db!
      userData.timestamp = serverTimestamp();

      // create new document in users collection with user data
      await setDoc(doc(db, 'users', user.uid), userData);

      navigate('/');
    } catch (error) {
      toast.error('Sign Up Error');
    }
  };

  return (
    <>
      <div className='page__container'>
        <header>
          <p className='page__header'>Welcome Back!</p>
        </header>

        <form onSubmit={onSubmit}>
          <input
            type='text'
            className='name__input'
            placeholder='Name'
            id='name'
            onChange={onChange}
          />
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
          <div className='signUp__bar'>
            <p className='signUp__text'>Sign Up</p>
            <button className='signUp__btn'>
              <ArrowRight fill='#ffffff' width='34px' height='34px' />
            </button>
          </div>
        </form>

        {/* google oauth */}
        <Link to='/sign-in' className='register__link'>
          Sign In
        </Link>
      </div>
    </>
  );
}

export default SignUp;
