import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

import { db } from '../firebase.config';
import { toast } from 'react-toastify';

function Contact() {
  const [message, setMessage] = useState('');
  const [owner, setOwner] = useState(null);
  const [searchParams] = useSearchParams();

  const params = useParams();

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const getOwner = async () => {
      const docRef = doc(db, 'users', params.ownerId);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        setOwner(docSnapshot.data());
      } else {
        toast('Error getting owner data');
      }
    };
    getOwner();
  }, [params.ownerId]);

  return (
    <div className='page__container'>
      <header>
        <p className='page__header'>Contact Owner</p>
      </header>

      <main>
        <div className='contact__owner'>
          <p className='owner__name'>Contact {owner?.name}</p>
        </div>

        <form className='message__form'>
          <div className='message__div'>
            <label htmlFor='message' className='message__label'>
              Message
            </label>
            <textarea
              name='message'
              id='message'
              className='textarea'
              value={message}
              onChange={onChange}
            ></textarea>
          </div>
          <a
            href={`mailto:${owner?.email}?Subject=${searchParams.get(
              'listingName'
            )}&body=${message}`}
            target='_blank'
            rel='noreferrer'
          >
            <button type='button' className='primary__btn'>
              Send Message
            </button>
          </a>
        </form>
      </main>
    </div>
  );
}

export default Contact;
