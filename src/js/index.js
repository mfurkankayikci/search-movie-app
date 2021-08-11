let movies = [];

function fetchMovie(movieName) {
    return fetch(`https://www.omdbapi.com/?s=${movieName}&apikey=thewdb`)
        .then(response => response.json())
        .then((response) => {
            if (response.Response) {
                movies = response.Search;
            }
        })
        .finally(() => {
            console.log(movies);
        });
}

document.body.onload = fetchMovie('avengers');
