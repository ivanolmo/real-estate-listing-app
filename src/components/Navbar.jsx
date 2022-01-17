import { useNavigate, useLocation } from 'react-router-dom';

import { ReactComponent as ExploreIcon } from '../assets/svg/exploreIcon.svg';
import { ReactComponent as OfferIcon } from '../assets/svg/localOfferIcon.svg';
import { ReactComponent as PersonOutlineIcon } from '../assets/svg/personOutlineIcon.svg';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // check if route matches current page, if so change icon color
  const checkPathRouteMatch = (route) => {
    return route === location.pathname;
  };

  return (
    <footer className='navbar'>
      <nav className='navbar__nav'>
        <ul className='navbar__list'>
          <li className='navbar__item' onClick={() => navigate('/')}>
            <ExploreIcon
              fill={checkPathRouteMatch('/') ? '#2c2c2c' : '#8f8f8f'}
              width='36px'
              height='36px'
            />
            <p
              className={`item__name  ${
                checkPathRouteMatch('/') ? 'item__name--active' : ''
              }`}
            >
              Explore
            </p>
          </li>
          <li className='navbar__item' onClick={() => navigate('/offers')}>
            <OfferIcon
              fill={checkPathRouteMatch('/offers') ? '#2c2c2c' : '#8f8f8f'}
              width='36px'
              height='36px'
            />
            <p
              className={`item__name  ${
                checkPathRouteMatch('/offers') ? 'item__name--active' : ''
              }`}
            >
              Offers
            </p>
          </li>
          <li className='navbar__item' onClick={() => navigate('/profile')}>
            <PersonOutlineIcon
              fill={checkPathRouteMatch('/profile') ? '#2c2c2c' : '#8f8f8f'}
              width='36px'
              height='36px'
            />
            <p
              className={`item__name  ${
                checkPathRouteMatch('/profile') ? 'item__name--active' : ''
              }`}
            >
              Profile
            </p>
          </li>
        </ul>
      </nav>
    </footer>
  );
}

export default Navbar;
