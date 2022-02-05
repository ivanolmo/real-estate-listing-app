import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import { db } from '../firebase.config';
import LoadingSpinner from '../components/LoadingSpinner';
import shareIcon from '../assets/svg/shareIcon.svg';

function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        setListing(docSnapshot.data());
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return loading ? (
    <LoadingSpinner />
  ) : (
    <main>
      {/* slider */}
      <div
        className='share__container'
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt='Share' />
      </div>

      {shareLinkCopied && <p className='share__link'>Link Copied!</p>}

      <div className='listing__details'>
        <p className='listing__name'>
          {listing.name} - $
          {listing.offer
            ? listing.discountedPrice.toLocaleString('en-US')
            : listing.regularPrice.toLocaleString('en-US')}
        </p>
        <p className='listing__location'>{listing.location}</p>
        <p className='listing__type'>
          For {`${listing.type[0].toUpperCase()}${listing.type.slice(1)}`}
        </p>
        {listing.offer && (
          <p className='discount__price'>
            ${listing.regularPrice - listing.discountedPrice} discount
          </p>
        )}

        <ul className='details__list'>
          <li>
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Bedrooms`
              : '1 Bedroom'}
          </li>
          <li>
            {listing.bathrooms > 1
              ? `${listing.bathrooms} Bathrooms`
              : '1 Bathroom'}
          </li>
          <li>{listing.parking && 'Parking Included'}</li>
          <li>{listing.furnished && 'Furnished'}</li>
        </ul>
        <p className='location__title'>Location</p>
        {/* map */}
        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className='primary__btn'
          >
            Contact Owner
          </Link>
        )}
      </div>
    </main>
  );
}

export default Listing;
