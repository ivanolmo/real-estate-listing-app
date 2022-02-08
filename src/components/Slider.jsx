import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/a11y';

import { db } from '../firebase.config';
import LoadingSpinner from './LoadingSpinner';

function Slider() {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);

  const navigate = useNavigate();

  // fetch 5 listings from firestore to use on explore page
  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, 'listings');

      const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5));

      const querySnapshot = await getDocs(q);

      let listings = [];

      querySnapshot.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      // update state with an array of 5 listing objects
      // each obj contains an id and a data obj
      // data obj has images we use in the slider
      setListings(listings);
      setLoading(false);
    };

    fetchListings();
  }, []);

  return loading ? (
    <LoadingSpinner />
  ) : listings.length === 0 ? (
    <></>
  ) : (
    <>
      <p className='explore__heading'>Featured</p>

      <Swiper
        modules={[Pagination, Scrollbar, A11y]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        style={{ height: '300px' }}
      >
        {listings.map(({ data, id }) => {
          return (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <img
                className='swiper__image'
                src={data.imageUrls[0]}
                alt='listing'
              />
              <p className='swiper__text'>{data.name}</p>
              <p className='swiper__price'>
                $
                {data.discountedPrice?.toLocaleString('en-US') ??
                  data.regularPrice.toLocaleString('en-US')}
                {data.type === 'rent' && ' / month'}
              </p>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
}

export default Slider;
