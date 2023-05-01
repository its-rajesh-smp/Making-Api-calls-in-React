import React, { useCallback, useEffect, useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';


let interval;
const API_URL = "https://dummy-react-project-26fa0-default-rtdb.asia-southeast1.firebasedatabase.app/movies"

function App() {

  const [movieList, setMovieList] = useState([])
  const [loader, setLoader] = useState(false)
  const [error, setError] = useState(null)

  /* -------------------------------------------------------------------------- */
  /*                                 FETCH DATA                                 */
  /* -------------------------------------------------------------------------- */
  const fetchData = useCallback(() => {
    if (movieList.length === 0) { setLoader(true) }
    setError(null)

    interval = setInterval(async function () {

      console.log("INTERVAL CALL");
      try {
        const response = await fetch(API_URL + ".json")
        const results = await response.json()

        const newMoviesArray = Object.keys(results)

        const newDataArrary = newMoviesArray.map(movieId => {
          return { title: results[movieId].title, releaseDate: results[movieId].releaseDate, openingText: results[movieId].openingText, id: movieId }
        })
        setMovieList(newDataArrary)


        console.log("DATA FETCHED");
        clearInterval(interval)

      } catch (error) {
        setError('Something went wrong ....Retrying')
      }
      setLoader(false)
    }, 1000);
  }, [])


  useEffect(() => {
    fetchData()
  }, [fetchData])


  /* -------------------------------------------------------------------------- */
  /*                                ADD NEW MOVIE                               */
  /* -------------------------------------------------------------------------- */

  const [title, setTitle] = useState("")
  const [openingText, setOpeningText] = useState("")
  const [releaseDate, setReleaseDate] = useState("")

  const addNewMovieHandeler = async (e) => {
    e.preventDefault()
    try {
      const newMovieObject = { title: title, openingText: openingText, releaseDate: releaseDate }

      const response = await fetch(API_URL + ".json", {
        method: "POST",
        body: JSON.stringify(newMovieObject)
      })

      const data = await response.json()
      newMovieObject.id = data.name

      setMovieList(prev => [newMovieObject, ...prev])
    } catch (error) {
      console.log(error);
    }
  }


  /* -------------------------------------------------------------------------- */
  /*                               DELETE A MOVIE                               */
  /* -------------------------------------------------------------------------- */

  const deleteAMovieHandeler = async (movieId) => {

    try {
      await fetch(API_URL + "/" + movieId + ".json", {
        method: "DELETE"
      })
      setMovieList(prev => {
        const deletedData = prev.filter((val) => {
          return movieId !== val.id
        })

        console.log(deletedData);
        return deletedData
      })



    } catch (error) {
      console.log(error);
    }



    console.log("DELETED");
  }



  return (
    <React.Fragment>

      <section>
        <form >
          <input type='text' placeholder='Title' onChange={(e) => { setTitle(e.target.value) }} />
          <input type='text' placeholder='Opening Text' onChange={(e) => { setOpeningText(e.target.value) }} />
          <input type='text' placeholder='Release Date' onChange={(e) => { setReleaseDate(e.target.value) }} />
        </form>
        <button onClick={addNewMovieHandeler}>Add Movie</button>
      </section>



      <section>
        <button onClick={fetchData}>Fetch Movies</button>
      </section>

      <section>
        {loader && <h1>Loading</h1>}
        {error}
        {error !== null && <button onClick={() => { clearInterval(interval) }}>Stop Retrying</button>}
        <MoviesList deleteAMovieHandeler={deleteAMovieHandeler} movies={movieList} />
      </section>




    </React.Fragment>
  );
}

export default App;
