import React, { useState , useEffect } from "react";
import axios from './axios';
import './Row.css'
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';
const Row = ({ title ,fetchUrl , isLargeRow }) => {
    
    const [movies, setMovies] = useState([]);
    const [trilerUrl , setTrilerUrl] = useState('');
    const base_url ="https://image.tmdb.org/t/p/original/";

    useEffect(() => {

        //if[] , run once when the component is mounted
        //if[movies], run everytime the movies is updated
        async function fetchData() {
            const request = await axios.get(fetchUrl);
           setMovies(request.data.results);
            return request;
        }
        fetchData();
    } , [fetchUrl]);

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            autoplay: 1,
        }
    }

    const handleClick = (movie) =>{
        if(trilerUrl){
            setTrilerUrl('');
        }else{
            movieTrailer(movie?.name|| movie?.title || movie?.original_name || movie?.original_title||"")
            .then((url)=>{
                const urlParams = new URLSearchParams(new URL(url).search);
                setTrilerUrl(urlParams.get('v'));
            })
            .catch((err)=>{console.error(err.message);})
        }
    }

    return (
        <div className="row">
            <h2>{title}</h2>
            <div className={`row__posters`}>
                {
                    movies.map(movie =>(
                        <img 
                            key={movie.id}
                            onClick={()=>handleClick(movie)} 
                            className={`row_poster ${isLargeRow && "row__posterLarge"}`} 
                            src={`${base_url}${isLargeRow ? movie.poster_path :movie.backdrop_path}`} 
                            alt={movie.name}/>
                    ))
                }
            </div>
            {
                trilerUrl &&  <YouTube videoId={trilerUrl} opts={opts}/>
            }
        </div>
    );
};

export default Row;
