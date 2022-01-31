const fetchGeodata = async (address) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
  );

  const data = await response.json();

  if (data.status !== 'OK') throw new Error();

  let coords = data.results[0].geometry.location;
  let formattedAddress = data.results[0].formatted_address;

  return [coords, formattedAddress];
};

export default fetchGeodata;
