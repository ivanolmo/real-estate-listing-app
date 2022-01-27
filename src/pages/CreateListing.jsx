import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import LoadingSpinner from '../components/LoadingSpinner';

function CreateListing() {
  const [formData, setFormData] = useState({
    userRef: 'id',
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    location: '',
    geolocation: {
      lat: 0,
      lng: 0,
    },
    imageUrls: [],
  });

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        setFormData({ ...formData, userRef: user.uid });
      });
    } else {
      navigate('/sign-in');
    }
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  return <div>CreateListing</div>;
}

export default CreateListing;
