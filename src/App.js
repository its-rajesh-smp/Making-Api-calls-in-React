import React, { useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';




let interval;
function App() {

  const [movieList, setMovieList] = useState([])
  const [loader, setLoader] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = () => {
    if (movieList.length === 0) { setLoader(true) }
    setError(null)



    interval = setInterval(async function () {
      try {
        const response = await fetch("https://swapi.dev/api/film/")
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
  }


  return (
    <React.Fragment>
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
