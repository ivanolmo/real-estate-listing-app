import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';

import { db } from '../firebase.config';
import googleIcon from '../assets/svg/googleIcon.svg';

function OAuth() {
  const navigate = useNavigate();
  const location = useLocation();

  const onClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const docRef = doc(db, 'users', user.uid);
      const checkDoc = await getDoc(docRef);

      if (!checkDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate('/');
    } catch (error) {
      toast.error("We've encountered an error, please try again");
    }
  };

  return (
    <div className='social__login'>
      <p>Sign {location.pathname === '/sign-in' ? 'In' : 'Up'} With</p>
      <button className='social__container' onClick={onClick}>
        <img className='social__icon' src={googleIcon} alt='Google' />
      </button>
    </div>
  );
}

export default OAuth;
