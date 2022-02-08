import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { toast } from 'react-toastify';

import { db } from '../firebase.config';
import ListingItem from '../components/ListingItem';
import LoadingSpinner from '../components/LoadingSpinner';

function Category() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // create a reference to the listings collection
        const listingsRef = collection(db, 'listings');

        // create a query to the db
        const q = query(
          listingsRef,
          where('type', '==', params.categoryName),
          orderBy('timestamp', 'desc'),
          limit(10)
        );

        // execute the query
        const querySnapshot = await getDocs(q);

        // initialize empty array that will contain listings data
        let listings = [];

        querySnapshot.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error(
          'There was an error querying the database, please try again...'
        );
      }
    };

    fetchListings();
  }, [params.categoryName]);

  return (
    <div className='category'>
      <header>
        <p className='page__header'>
          Places for {params.categoryName === 'rent' ? 'Rent' : 'Sale'}
        </p>
      </header>

      {loading ? (
        <LoadingSpinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className='category__listings'>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              ))}
            </ul>
          </main>
        </>
      ) : (
        <p>No listings for {params.categoryName}</p>
      )}
    </div>
  );
}

export default Category;
