import {useEffect} from "react";
import { useState} from 'react';
import Places from './Places.jsx';
import Error from "./Error.jsx";
import {sortPlacesByDistance} from "../loc.js";
import {fetchAvailablePlaces} from "../http.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [places, setPlaces] = useState([]); //data
  const [isLoading, setIsFetching] = useState(true); //loading
  const [error, setError] = useState(null); //error

  // useEffect(() => {
  //   setIsFetching(true);
  //   fetch('http://localhost:3000/places').then((response) => {
  //     return response.json();
  //   }).then((data) => {
  //     setPlaces(data.places);
  //       setIsFetching(false);
  //   });
  // }, []);

  useEffect(() => {
        async function fetchPlaces() {
          setIsFetching(true);
          try {
            const places = await fetchAvailablePlaces();
            navigator.geolocation.getCurrentPosition((position) => {
              const sortedPlaces = sortPlacesByDistance(places, position.coords.latitude, position.coords.longitude);
              setPlaces(sortedPlaces);
              setIsFetching(false);
            });

          }
          catch (error) {
            setError({message: error.message || 'HTTP request failure.'});
            setIsFetching(false);
          }

        }
        fetchPlaces()

      },[]);

if (error) {
  return <Error title="Failed to fetch places." message={error.message} />;
}

  return (
    <Places
      title="Available Places"
      places={places}
      isLoading={isLoading}
        loadingText="Loading places..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
