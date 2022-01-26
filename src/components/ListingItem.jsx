import { Link } from 'react-router-dom';

import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg';
import bedIcon from '../assets/svg/bedIcon.svg';
import bathtubIcon from '../assets/svg/bathtubIcon.svg';

function ListingItem({ listing, id, onDelete }) {
  return (
    <li className='category__listing'>
      <Link to={`/category/${listing.type}/${id}`} className='listing__link'>
        <img
          className='listing__img'
          src={listing.imageUrls[0]}
          alt={listing.name}
        />
        <div className='listing__details'>
          <p className='listing__location'>{listing.location}</p>
          <p className='listing__name'>{listing.name}</p>
          <p className='listing__price'>
            ${listing.offer ? listing.discountedPrice : listing.regularPrice}
            {listing.type === 'rent' && ' / month'}
          </p>
          <div className='listing__info'>
            <img src={bedIcon} alt='bedroom' />
            <p className='info__text'>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Bedrooms`
                : '1 Bedroom'}
            </p>
            <img src={bathtubIcon} alt='bathroom' />
            <p className='info__text'>
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Bathrooms`
                : '1 Bathroom'}
            </p>
          </div>
        </div>
      </Link>
      {onDelete && (
        <DeleteIcon
          className='remove__icon'
          fill='#e74c3c'
          onClick={() => onDelete(listing.id, listing.name)}
        />
      )}
    </li>
  );
}

export default ListingItem;
