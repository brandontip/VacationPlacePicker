import { useRef, useState, useCallback } from 'react';
import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import {fetchUserPlaces, updateUserPlaces} from './http.js';
import Error from "./components/Error.jsx";
import {useFetch} from "./hooks/useFetch.js";


function App() {
  const selectedPlace = useRef();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState(null);
  const { isLoading, fetchedData: userPlaces, setFetchedData: setUserPlaces,error} = useFetch(fetchUserPlaces,[]);

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    try {
      await updateUserPlaces([selectedPlace,...userPlaces]);
    }
    catch (error){
      setUserPlaces(userPlaces); //we want stale userPlaces, i.e. unchanged
      setErrorUpdatingPlaces(error);
    }

  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
        prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );


    try {
      await updateUserPlaces(userPlaces.filter(place=>place.id !== selectedPlace.current.id));
    }
    catch (error){
      setUserPlaces(userPlaces); //we want stale userPlaces, i.e. unchanged
      setErrorUpdatingPlaces(error);
    }

    setModalIsOpen(false);
  }, [userPlaces]);

  function handleError(){
    setErrorUpdatingPlaces(null);
  }

  return (
      <>
        <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
          <DeleteConfirmation
              onCancel={handleStopRemovePlace}
              onConfirm={handleRemovePlace}
          />
        </Modal>

        <Modal open={errorUpdatingPlaces} onClose={handleError}>
          {errorUpdatingPlaces &&< Error title={"An error occurred updating places"} message={errorUpdatingPlaces.message} onConfirm={handleError}></Error>}
        </Modal>
        <header>
          <img src={logoImg} alt="Stylized globe" />
          <h1>PlacePicker</h1>
          <p>
            Create your personal collection of places you would like to visit or
            you have visited.
          </p>
        </header>
        <main>
          {error && <Error title="An Error Occurred Recovering Your Saved Places" message = {error.message} />}
          {!error && <Places
              title="I'd like to visit ..."
              fallbackText="Select the places you would like to visit below."
              places={userPlaces}
              onSelectPlace={handleStartRemovePlace}
              isLoading={isLoading}
              loadingText={'Fetching your places'}
          />}

          <AvailablePlaces onSelectPlace={handleSelectPlace} />
        </main>
      </>
  );
}

export default App;
