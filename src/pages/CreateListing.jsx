import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';

import LoadingSpinner from '../components/LoadingSpinner';
import uploadImage from '../utils/uploadImage';
import fetchGeodata from '../utils/fetchGeodata';
import { db } from '../firebase.config';

const initialFormState = {
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
  images: [],
};

function CreateListing() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFormData({ ...initialFormState, userRef: user.uid });
      } else {
        navigate('/sign-in');
      }
    });

    return unsubscribe;
  }, [auth, navigate]);

  const onMutate = (e) => {
    // declare variable to whether a piece of form data is a boolean
    let isBool = null;

    // check if the value is 'true' or 'false', since booleans passed through
    // inputs get converted to strings
    if (e.target.value === 'true') {
      isBool = true;
    }

    if (e.target.value === 'false') {
      isBool = false;
    }

    // if the value is of type files, set images array in state to files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    // if value is a boolean, set the form data to the boolean value,
    // else just set value. uses nullish coalescing operator (??)
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: isBool ?? (e.target.valueAsNumber || e.target.value),
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    // check if discounted price >= regular price
    if (
      formData.discountedPrice &&
      formData.discountedPrice >= formData.regularPrice
    ) {
      setLoading(false);
      toast(
        'Discounted price should be lower than regular price, please check your input and try again!'
      );
      return;
    }

    // check if upload limit is being exceeded
    if (formData.images.length > 10) {
      setLoading(false);
      toast('Maximum of 10 images!');
      return;
    }

    // get geolocation of form address
    const [coords, formattedAddress] = await fetchGeodata(
      formData.address
    ).catch(() => {
      setLoading(false);
      toast('There was an error fetching geocode data');
      return;
    });

    // pass images to helper function and retrieve Firebase URLs once uploaded
    const imageUrls = await toast.promise(
      Promise.all([...formData.images].map((image) => uploadImage(image))),
      {
        pending: 'Uploading images...',
        success: 'Your images were successfully uploaded',
        error: 'There was an error uploading images',
      },
      setLoading(false)
    );

    // create copy of state data to prepare a listing document
    const listingData = {
      ...formData,
      imageUrls,
      location: formattedAddress,
      geolocation: { ...coords },
      timestamp: serverTimestamp(),
    };

    // edit listing data details since we started with a copy of state but need some changes
    delete listingData.images; // we want to replace this with the imageUrls
    delete listingData.address; // we want to replace this with the formatted address
    !listingData.offer && delete listingData.discountedPrice; // remove discounted price field if offer isn't set to true

    // create ref to new document and then send data to Firestore, then redirect to listing page
    let listingCreatedSuccess;

    const docRef = await toast
      .promise(
        addDoc(collection(db, 'listings'), listingData),
        {
          pending: 'Your listing is being created...',
          success: 'Your listing has been successfully created',
          error: 'There was an error creating your listing',
        },
        setLoading(false)
      )
      .then((listingCreatedSuccess = true));

    if (listingCreatedSuccess) {
      navigate(`/category/${listingData.type}/${docRef.id}`);
    }
  };

  return loading ? (
    <LoadingSpinner />
  ) : (
    <div className='profile'>
      <header>
        <p className='page__header'>Create a Listing</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <label className='form__label' htmlFor=''>
            Sell / Rent
          </label>
          <div className='form__btns'>
            <button
              className={`form__btn ${
                formData.type === 'sale' ? 'form__btn--active' : ''
              }`}
              type='button'
              id='type'
              value='sale'
              onClick={onMutate}
            >
              Sell
            </button>
            <button
              className={`form__btn ${
                formData.type === 'rent' ? 'form__btn--active' : ''
              }`}
              type='button'
              id='type'
              value='rent'
              onClick={onMutate}
            >
              Rent
            </button>
          </div>
          <label className='form__label' htmlFor='name'>
            Name
          </label>
          <input
            className='input__name'
            type='text'
            id='name'
            value={formData.name}
            maxLength='32'
            minLength='10'
            required
            onChange={onMutate}
          />
          <div className='flex'>
            <div>
              <label htmlFor='bedrooms' className='form__label'>
                Bedrooms
              </label>
              <input
                type='number'
                className='input__small'
                id='bedrooms'
                value={formData.bedrooms}
                min='1'
                max='50'
                required
                onChange={onMutate}
              />
            </div>
            <div>
              <label htmlFor='bathrooms' className='form__label'>
                Bathrooms
              </label>
              <input
                type='number'
                className='input__small'
                id='bathrooms'
                value={formData.bathrooms}
                min='1'
                max='50'
                required
                onChange={onMutate}
              />
            </div>
          </div>
          <label className='form__label'>Parking</label>
          <div className='form__btns'>
            <button
              className={`form__btn ${
                formData.parking ? 'form__btn--active' : ''
              }`}
              type='button'
              id='parking'
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={`form__btn ${
                !formData.parking && formData.parking !== null
                  ? 'form__btn--active'
                  : ''
              }`}
              type='button'
              id='parking'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>
          <label className='form__label'>Furnished</label>
          <div className='form__btns'>
            <button
              className={`form__btn ${
                formData.furnished ? 'form__btn--active' : ''
              }`}
              type='button'
              id='furnished'
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={`form__btn ${
                !formData.furnished && formData.furnished !== null
                  ? 'form__btn--active'
                  : ''
              }`}
              type='button'
              id='furnished'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>
          <label htmlFor='address' className='form__label'>
            Address
          </label>
          <textarea
            type='text'
            className='input__address'
            id='address'
            value={formData.address}
            required
            onChange={onMutate}
          />
          <label htmlFor='' className='form__label'>
            Offer
          </label>
          <div className='form__btns'>
            <button
              className={`form__btn ${
                formData.offer ? 'form__btn--active' : ''
              }`}
              type='button'
              id='offer'
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={`form__btn ${
                !formData.offer && formData.offer !== null
                  ? 'form__btn--active'
                  : ''
              }`}
              type='button'
              id='offer'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>
          <label htmlFor='regularPrice' className='form__label'>
            Regular Price
          </label>
          <div className='input__price'>
            <input
              type='number'
              className='input__small'
              id='regularPrice'
              value={formData.regularPrice}
              min='500'
              max='10000000'
              required
              onChange={onMutate}
            />
            {formData.type === 'rent' && (
              <p className='price__text'>$ / Month</p>
            )}
          </div>
          {formData.offer && (
            <>
              <label htmlFor='discountedPrice' className='form__label'>
                Discounted Price
              </label>
              <div className='input__price'>
                <input
                  type='number'
                  className='input__small'
                  id='discountedPrice'
                  value={formData.discountedPrice}
                  min='500'
                  max='10000000'
                  required
                  onChange={onMutate}
                />
                {formData.type === 'rent' && (
                  <p className='price__text'>$ / Month</p>
                )}
              </div>
            </>
          )}
          <label htmlFor='images' className='form__label'>
            Images
          </label>
          <p className='images__info'>
            The first image will be the cover (max 10).
          </p>
          <input
            type='file'
            className='input__files'
            id='images'
            max='10'
            accept='.jpg,.jpeg,.png'
            multiple
            required
            onChange={onMutate}
          />
          <button type='submit' className='primary__btn create-listing__btn'>
            Create Listing
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateListing;
