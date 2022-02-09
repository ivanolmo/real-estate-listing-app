import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, updateProfile } from 'firebase/auth';
import {
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { db } from '../firebase.config';
import ListingItem from '../components/ListingItem';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';

function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();

  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
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
      toast.error(error.message);
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  // TODO add error handling
  const onDelete = (listingId) => {
    confirmAlert({
      title: 'Are you sure you want to delete this listing?',
      buttons: [
        {
          label: 'Delete',
          onClick: async () => {
            await deleteDoc(doc(db, 'listings', listingId));

            const updatedListings = listings.filter(
              (listing) => listing.id !== listingId
            );

            setListings(updatedListings);
            setLoading(false);
            toast.success('Successfully deleted this listing!');
          },
        },
        {
          label: 'Cancel',
          onClick: () => {}, // just close confirm dialog
        },
      ],
    });
  };

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, 'listings');

      const q = query(
        listingsRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);

      const listings = [];

      querySnapshot.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      setLoading(false);
    };

    fetchUserListings();
  }, [auth.currentUser.uid]);

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
              className='profile__email'
              disabled
              onChange={onChange}
            />
          </form>
        </div>

        <Link to='/create-listing' className='create__listing'>
          <img src={homeIcon} alt='home' />
          <p>Rent or sell your home</p>
          <img src={arrowRight} alt='submit' />
        </Link>

        {!loading && listings?.length > 0 && (
          <>
            <p className='listing__text'>Your Listings</p>
            <ul className='listings__list'>
              {listings.map((listing) => {
                return (
                  <ListingItem
                    key={listing.id}
                    id={listing.id}
                    listing={listing.data}
                    onDelete={() => onDelete(listing.id)}
                  />
                );
              })}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}

export default Profile;
