import Places from './Places.jsx';
import Error from "./Error.jsx";
import {sortPlacesByDistance} from "../loc.js";
import {fetchAvailablePlaces} from "../http.js";
import {useFetch} from "../hooks/useFetch.js";


// create a wrapper around fetchAvailable that sorts
async function fetchSortedPlaces(){
  const places = await fetchAvailablePlaces();

  return new Promise((resolve)=>{
      navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(places, position.coords.latitude, position.coords.longitude);
          resolve(sortedPlaces);
      });
  });
}

export default function AvailablePlaces({ onSelectPlace }) {

  const {
    isLoading,
    setIsFetching: setIsLoading ,
    fetchedData: places,
    setFetchedData,
    error} = useFetch(fetchSortedPlaces,[]);
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
