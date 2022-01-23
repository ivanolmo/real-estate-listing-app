import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

import { db } from '../firebase.config';

function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();

  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  const onLogout = () => {
    auth.signOut();
    navigate('/');
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // update user's display name in Firebase
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        toast.success('Updated name successfully!');
      }

      // update user name field in Firestore
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        name,
      });
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <div className='profile'>
      <header className='profile__header'>
        <p className='page__header'>My Profile</p>
        <button type='button' className='logout__btn' onClick={onLogout}>
          Logout
        </button>
      </header>
      <main>
        <div className='details__header'>
          <p className='details__title'>Personal Details</p>
          <p
            className='details__update'
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? 'Done' : 'Change'}
          </p>
        </div>
        <div className='profile__card'>
          <form>
            <label htmlFor='name'></label>
            <input
              type='text'
              id='name'
              value={name}
              className={`profile__name ${
                changeDetails ? 'profile__name--active' : ''
              }`}
              disabled={!changeDetails}
              onChange={onChange}
            />
            <label htmlFor='email'></label>
            <input
              type='email'
              id='email'
              value={email}
              // className={`profile__email ${
              //   changeDetails ? 'profile__email--active' : ''
              // }`}
              // disabled={!changeDetails}
              className='profile__email'
              disabled
              onChange={onChange}
            />
          </form>
        </div>
      </main>
    </div>
  );
}

export default Profile;
