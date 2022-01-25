import { Link } from 'react-router-dom';

import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg';
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg';

function Explore() {
  return (
    <div className='explore'>
      <header>
        <p className='page__header'>Explore</p>
      </header>
      <main>
        {/* image slider */}
        <p className='explore__heading'>Categories</p>
        <div className='explore__categories'>
          <Link to='/category/rent'>
            <img className='category__img' src={rentCategoryImage} alt='rent' />
            <p className='category__name'>Places for rent</p>
          </Link>
          <Link to='/category/sale'>
            <img className='category__img' src={sellCategoryImage} alt='sale' />
            <p className='category__name'>Places for sale</p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Explore;
