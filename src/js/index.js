let movies = [];
let searchingMovie= '';
const resultContainer = document.querySelector('.result__container');
const searchInput = document.querySelector('.search__input');
const searchButton = document.querySelector('.search__button');

searchButton.addEventListener('click', () => {
    searchingMovie = searchInput.value;

    fetchMovie(searchingMovie);
});

searchInput.addEventListener('input', function (evt) {
    if (this.value === '') {
        resultContainer.innerHTML =
            `<img class="flex-basis-100 h-36" src="./assets/no-result.svg" alt="Search a movie"/>
             <h1 class="flex-basis-100 text-3xl text-center font-medium text-gray-500">Search a movie</h1>
            `;
    }
});

searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchingMovie = searchInput.value;

        fetchMovie(searchingMovie);
    }
});

function fetchMovie(movieName) {
    fetch(`https://www.omdbapi.com/?s=${movieName}&apikey=thewdb`)
        .then(response => response.json())
        .then((response) => {
            if (response.Response) {
                movies = response.Search;
                resultContainer.innerHTML = '';

                movies.forEach((movies) => {
                    resultContainer.innerHTML +=
                        `<div class="result__card transform transition duration-500 hover:scale-110 m-4 flex-shrink w-64">
                              <a href="/deneme" imdb-id="${movies.imdbID}" target="_blank">
                                  <div style="height: 420px;">
                                      <img class="w-full h-full object-cover object-center rounded-lg shadow-md"
                                           src="${movies.Poster}"
                                           alt="${movies.Title}"
                                      >
                                  </div>
                              </a>

                          <div class="relative px-4 -mt-16">
                              <div class="bg-white p-6 rounded-lg shadow-lg">
                                <div class="flex items-baseline">
                                  <div class="bg-red-500 text-white text-xs px-2 inline-block rounded-full uppercase">
                                    ${movies.Type}
                                  </div>
                    
                                  <div class="ml-2 text-gray-600 uppercase text-xs font-semibold tracking-wider">
                                    ${movies.Year}
                                  </div>
                                </div>
                    
                                <a href="www.google.com" target="_blank"  imdb-id="${movies.imdbID}">
                                  <h4
                                    class="transition duration-500 hover:text-red-500 mt-2 text-xl font-semibold uppercase leading-tight truncate">
                                    ${movies.Title}
                                  </h4>
                                </a>
                              </div>
                          </div>
                         </div>`;
                });
            }
        })
        .catch(() => {
            resultContainer.innerHTML =
                `<img class="flex-basis-100 h-36" src="./assets/no-result.svg" alt="Movie not found"/>
                 <h1 class="flex-basis-100 text-3xl text-center font-medium text-gray-500">Movie not found</h1>
                 `;
        });
}
