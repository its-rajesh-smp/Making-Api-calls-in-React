import React, { useCallback, useEffect, useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';




let interval;
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

      console.log("SS");
      try {
        const response = await fetch("https://swapi.dev/api/films/")
        const { results } = await response.json()
        const newDataArrary = results.map(movie => {
          return { title: movie.title, releaseDate: movie.release_date, openingText: movie.opening_crawl, id: movie.episode_id }
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

  const addNewMovieHandeler = (e) => {
    e.preventDefault()
    const newMovieObject = { id: Math.random(), title: title, openingText: openingText, releaseDate: releaseDate }
    console.log(newMovieObject);
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
        <MoviesList movies={movieList} />
      </section>




    </React.Fragment>
  );
}

export default App;
