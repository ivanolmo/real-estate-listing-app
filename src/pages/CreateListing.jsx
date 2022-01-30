import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import LoadingSpinner from '../components/LoadingSpinner';

function CreateListing() {
  const [loading, setLoading] = useState(false);
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
    images: [],
  });

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  const onSubmit = (e) => {
    e.preventDefault();
  };

  const onMutate = (e) => {
    let isBool = null;

    if (e.target.value === 'true') {
      isBool = true;
    }

    if (e.target.value === 'false') {
      isBool = false;
    }

    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: isBool ?? e.target.value,
      }));
    }
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

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
                Bedrooms
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
        </form>
        <button type='submit' className='primary__btn create-listing__btn'>
          Create Listing
        </button>
      </main>
    </div>
  );
}

export default CreateListing;
