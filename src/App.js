import React, { useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';


function App() {

  const [movieList, setMovieList] = useState([])

  const [loader, setLoader] = useState(false)

  const fetchData = async () => {
    if (movieList.length === 0) { setLoader(true) }

    const response = await fetch("https://swapi.dev/api/films/")
    const { results } = await response.json()
    const newDataArrary = results.map(movie => {
      return { title: movie.title, releaseDate: movie.release_date, openingText: movie.opening_crawl, id: movie.episode_id }
    })

    setLoader(false)
    setMovieList(newDataArrary)
  }


  return (
    <React.Fragment>
      <section>
        <button onClick={fetchData}>Fetch Movies</button>
      </section>

      <section>
        {loader && <h1>Loading</h1>}
        <MoviesList movies={movieList} />
      </section>




    </React.Fragment>
  );
}

export default App;
