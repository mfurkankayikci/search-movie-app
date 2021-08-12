const data = {
  currentMovie: null,
  imdbId: '',
}

const ui = {
  movieDetailContainer: document.querySelector('.movie-detail__container'),
}

const getImdbIdFromQuery = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  data.imdbId = urlParams.get('imdbId')

  fetchMovieWithId();
}

function fetchMovieWithId() {
  fetch(`https://www.omdbapi.com/?i=${data.imdbId}&apikey=thewdb`)
    .then(response => response.json())
    .then((response) => {
      if (response.Response) {
        data.currentMovie = response;

        cleanMovieDetailContainer();
        renderMovies();
      }
    });
}

const cleanMovieDetailContainer = () => {
  ui.movieDetailContainer.innerHTML = '';
}

const renderMovies = () => {
  ui.movieDetailContainer.innerHTML = `
      ${renderMovieCardHeader(data.currentMovie)}

      ${renderMovieCardContent(data.currentMovie)}
      
      ${renderMovieCardSpecificInfos(data.currentMovie)}
  `;
}

const renderMovieCardHeader = (movie) => {
  return `
    <div class="movie-detail__image-container p-6 -mt-20 md:mt-0 md:-ml-20 w-full md:w-3/12">
        <img class="w-full h-full object-cover object-center rounded-lg shadow-md"
             src="${movie.Poster}"
             alt="${movie.Title}"
        >
    </div>
  `
}

const renderMovieCardContent = (movie) => {
  return `
    <div class="movie-detail__content">
      <h1 class="text-4xl mb-2 text-gray-600 font-semibold">${movie.Title}</h1>

      <div class="flex items-baseline">
        <div class="bg-red-500 text-white text-xs px-2 inline-block rounded-full uppercase">
          ${movie.Type}
        </div>

        <div class="ml-2 text-gray-600 uppercase text-xs font-semibold tracking-wider">
          ${movie.Year}
        </div>
      </div>

      <hr class="my-4">

      <p class="text-lg text-gray-400">
        ${movie.Plot}
      </p>
    </div>
  `
}

const renderMovieCardSpecificInfos = (movie) => {
  return `
    <div class="mt-4 bg-white px-6 pb-6 pt-2 rounded-lg shadow-lg">
      <h4 class="text-lg text-red-500 font-semibold">Other Infos</h4>
  
      <ul class="grid auto-cols-auto auto-rows-max">
        ${getMovieSpecificInfos(data.currentMovie)}
      </ul>
    </div>
  `
}

const getMovieSpecificInfos = (currentMovie) => {
  return Object.entries(currentMovie).reduce((acc, [key, val]) => {
    return acc + `
      <li class="flex flex-col flex-wrap w-full md:flex-row py-1 break-all">
        <div class="text-base text-gray-500 font-semibold mr-2">${key}:</div>

        <div class="text-base text-gray-400">${val}</div>
      </li>
    `;
  }, '');
}

document.body.onload = getImdbIdFromQuery;
