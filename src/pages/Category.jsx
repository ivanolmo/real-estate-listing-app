import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { toast } from 'react-toastify';

import { db } from '../firebase.config';
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

        // execute query
        const querySnap = await getDocs(q);

        // initialize empty array that will contain listings data
        let listings = [];

        querySnap.forEach((t) => console.log(t));
      } catch (error) {
        toast.error(
          'There was an error querying the database, please try again...'
        );
      }
    };

    fetchListings();
  }, []);

  return <div>{params.categoryName}</div>;
}

export default Category;
