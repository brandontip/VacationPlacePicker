import {useEffect, useState} from "react";

export function useFetch(fetchFunction, intialDataValue) {
    const [isLoading, setIsFetching] = useState(true);
    const [error, setError] = useState();
    const [fetchedData, setFetchedData] = useState(intialDataValue);

    useEffect(() => {
        async function fetchData(){
            setIsFetching(true);
            try {
                const fetchResult= await fetchFunction();
                setFetchedData(fetchResult)
            }
            catch (error){
                setError(error)
            }
            setIsFetching(false);
        }
        fetchData();
    }, [fetchFunction]);

    return {
        isLoading,
        setIsFetching,
        fetchedData,
        setFetchedData,
        error
    }
}