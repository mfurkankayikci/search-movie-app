const data = {
    movies: [],
};

const ui = {
    resultContainer: document.querySelector('.result__container'),
    searchInput: document.querySelector('.search__input'),
    searchButton: document.querySelector('.search__button'),
}

ui.searchInput.addEventListener('input', function (evt) {
    if (this.value === '') {
        renderSearchMovieContainer();
    }
});

ui.searchButton.addEventListener('click', () => {
    fetchMovies();
});

ui.searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter'){
        fetchMovies();
    }
});

const renderSearchMovieContainer = () => {
    ui.resultContainer.innerHTML = `
    <img class="flex-basis-100 h-36" src="./assets/no-result.svg" alt="Search a movie"/>
    <h1 class="flex-basis-100 text-3xl text-center font-medium text-gray-500">Search a movie</h1>
  `;
}

function fetchMovies() {
    const searchText = ui.searchInput.value;

    fetch(`https://www.omdbapi.com/?s=${searchText}&apikey=thewdb`)
      .then(response => response.json())
      .then((response) => {
          if (response.Response) {
              data.movies = response.Search;

              cleanResultContainer()

              renderMovies()
          }
      }).catch(() => {
        renderErrorMessage();
    });
}

const cleanResultContainer = () => {
    ui.resultContainer.innerHTML = '';
}

const renderMovies = () => {
    ui.resultContainer.innerHTML = data.movies.reduce((acc, movie) => {
        return acc + `
      <div class="result__card transform transition duration-500 hover:scale-110 m-4 flex-shrink w-64">
        ${renderMovieCardHeader(movie)}

        <div class="relative px-4 -mt-16">
          ${renderMovieCardContent(movie)}
        </div>
      </div>`;
    }, '');
}

const renderMovieCardHeader = (movie) => {
    return `
    <a href="./movie-detail.html?imdbId=${movie.imdbID}" target="_blank">
      <div style="height: 420px;">
        <img class="w-full h-full object-cover object-center rounded-lg shadow-md"
           src="${movie.Poster}"
           alt="${movie.Title}"
        >
      </div>
    </a>
  `
}

const renderMovieCardContent = (movie) => {
    return `
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <div class="flex items-baseline">
        <div class="bg-red-500 text-white text-xs px-2 inline-block rounded-full uppercase">
          ${movie.Type}
        </div>
  
        <div class="ml-2 text-gray-600 uppercase text-xs font-semibold tracking-wider">
          ${movie.Year}
        </div>
      </div>
  
      <a href="./movie-detail.html?imdbId=${movie.imdbID}" target="_blank">
        <h4
          class="transition duration-500 hover:text-red-500 mt-2 text-xl font-semibold uppercase leading-tight truncate">
          ${movie.Title}
        </h4>
      </a>
    </div>
  `
}

const renderErrorMessage = () => {
    ui.resultContainer.innerHTML = `
    <img class="flex-basis-100 h-36" src="./assets/no-result.svg" alt="Movie not found"/>
    <h1 class="flex-basis-100 text-3xl text-center font-medium text-gray-500">Movie not found</h1>
  `;
}
