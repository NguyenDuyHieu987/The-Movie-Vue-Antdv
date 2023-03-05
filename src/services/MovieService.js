import ALLGENRES from '../constants/Genres';
// import LANGUAGES from '../constants/Languages';
import COUNTRIES from '../constants/Country';

const axios = require('axios').default;

// const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
// const YOUTUBE_BASE_URL = 'https://www.youtube.com/watch';

// const URL_API = 'https://the-movie-node-content.onrender.com';
// const URL_API = 'http://127.0.0.1:5000';
const URL_API = 'https://the-movie-flask-api-ccntent.onrender.com';
// const URL_API = 'https://the-movie-node.onrender.com';
// const URL_API = 'http://localhost:3001';

// const URL_API_IMAGE = 'https://the-movie-node-image.onrender.com';
// const URL_API_IMAGE = 'https://python-api-basic.onrender.com';
const URL_API_IMAGE = 'https://phimhay247-nodejs-api-image.onrender.com';

const signIn = async (params) => {
  const bodyFormData = new FormData();
  bodyFormData.append('email', params.email);
  bodyFormData.append('password', params.password);
  bodyFormData.append('user_token', params.user_token);

  return await axios.post(`${URL_API}/auth/login?api=hieu987`, bodyFormData);
};

const getUserToken = async (params) => {
  const bodyFormData = new FormData();
  bodyFormData.append('user_token', params.user_token);

  return await axios.post(
    `${URL_API}/auth/getusertoken?api=hieu987`,
    bodyFormData
  );
};

const signUp = async (params) => {
  const bodyFormData = new FormData();
  bodyFormData.append('id', params.id);
  bodyFormData.append('username', params.username);
  bodyFormData.append('email', params.email);
  bodyFormData.append('password', params.password);
  bodyFormData.append('created_by', params.created_by);
  bodyFormData.append('avatar', params.avatar);
  bodyFormData.append('user_token', params.user_token);

  return await axios.post(`${URL_API}/auth/signup?api=hieu987`, bodyFormData);
};

const getTrending = async (page) =>
  await axios.get(`${URL_API}/trending/all?page=${page}&api=hieu987`);

const getNowPlaying = async (page) =>
  await axios.get(`${URL_API}/movie/nowplaying?page=${page}&api=hieu987`);

const getUpComing = async (page) =>
  await axios.get(`${URL_API}/movie/upcoming?page=${page}&api=hieu987`);

const getPopular = async (page) =>
  await axios.get(`${URL_API}/movie/popular?page=${page}&api=hieu987`);

const getTopRated = async (page) =>
  await axios.get(`${URL_API}/movie/toprated?page=${page}&api=hieu987`);

const getTvAiringToday = async (page) =>
  await axios.get(`${URL_API}/tv/airingtoday?page=${page}&api=hieu987`);

const getTvOntheAir = async (page) =>
  await axios.get(`${URL_API}/tv/ontheair?page=${page}&api=hieu987`);

const getTvPopular = async (page) =>
  await axios.get(`${URL_API}/tv/popular?page=${page}&api=hieu987`);

const getTvTopRated = async (page) =>
  await axios.get(`${URL_API}/tv/toprated?page=${page}&api=hieu987`);

const getDaTaSearch = async (text, page) =>
  await axios.get(
    `${URL_API}/search/multi?query=${text}&page=${page}&api=hieu987`
  );

const getMoviesByGenres = async (genres_name, page) => {
  const genres = await getIdGenresByName(genres_name);

  // const genreStr = !genres_name.includes('&')
  //   ? `${genresName.id},${genresName.name}`
  //   : `${genresName.id},${genresName.name.replace('&', '%26')}`;

  const genreStr = genres_name != '' ? genres.id : '';

  return await axios.get(
    !genres_name.includes('&')
      ? `${URL_API}/discover/all?api=hieu987&with_genres=${genreStr}&page=${page}`
      : `${URL_API}/discover/all?api=hieu987&with_genres=${genreStr}&page=${page}`
  );
};

const getMoviesByYear = async (year, page) => {
  const str = /^\d+$/.test(year)
    ? `${URL_API}/discover/all?api=hieu987&primary_release_date_gte=${year}-01-01&primary_release_date_lte=${year}-12-30&page=${page}`
    : `${URL_API}/discover/all?api=hieu987&primary_release_date_lte=${year.slice(
        -4
      )}-01-01&page=${page}`;
  return await axios.get(str);
};

const getMovieByCountry = async (country_name, page) => {
  const countriName = await getCountry(country_name);
  return await axios.get(
    `${URL_API}/discover/all?api=hieu987&with_original_language=${countriName.iso_639_1}&page=${page}`
  );
};

const getMoviesByYearBeFore2000 = async (year, page) =>
  await axios.get(
    `${URL_API}/discover/all?api=hieu987&primary_release_date_lte=${year}-01-01&page=${page}`
  );

const getMovieByCredit = async (movieId) =>
  await axios.get(
    `${URL_API}/movie/detail/${movieId}?api=hieu987&append_to_response=credits`
  );

const getTvByCredit = async (movieId) =>
  await axios.get(
    `${URL_API}/tv/detail/${movieId}?api=hieu987&append_to_response=credits`
  );

const getMovieByRecommend = async (type, movieId, page) =>
  await axios.get(
    `https://api.themoviedb.org/3/${type}/${movieId}?api_key=fe1b70d9265fdb22caa86dca918116eb&append_to_response=recommendations&page=${page}`
  );

const getMovieBySimilar = async (type, genres, page) => {
  const genrnStr = genres.id != '' ? genres.id : '';

  return await axios.get(
    `${URL_API}/discover/${type}?with_genres=${genrnStr}&page=${page}&api=hieu987`
  );
};
const getList = async (userID) =>
  await axios.get(`${URL_API}/list/${userID}/getlist?api=hieu987`);

const getWatchList = async (userID, page) =>
  await axios.get(
    `${URL_API}/watchlist/getwatchlist/${userID}/all?api=hieu987&page=${page}`
  );

const getTheMostVoteCount = async (page) =>
  await axios.get(
    `${URL_API}/discover/all?api=hieu987&sort_by=popularity_desc&page=${page}`
  );

const FilterDataMovie = async (formSelect) => {
  const yearLte = formSelect.year + '-12-30';
  const yearGte =
    formSelect.year != ''
      ? /^\d+$/.test(formSelect.year)
        ? formSelect.year + '-01-01'
        : formSelect.year.slice(-4) + '-01-01'
      : '';

  // const genresName = await getIdGenresByName(formSelect.genre);

  // const genreStr =
  //   formSelect.genre !== ''
  //     ? !formSelect.genre.includes('&')
  //       ? `${genresName.id},${genresName.name}`
  //       : `${genresName.id},${genresName.name.replace('&', '%26')}`
  //     : '';

  const genreStr =
    formSelect.genre !== ''
      ? /^\d+$/.test(formSelect.genre)
        ? formSelect.genre
        : await getIdGenresByName(formSelect.genre)
      : '';

  return /^\d+$/.test(formSelect.year)
    ? await axios.get(
        `${URL_API}/discover/${formSelect.type}?sort_by=${formSelect.sortBy}&primary_release_date_gte=${yearGte}&primary_release_date_lte=${yearLte}&with_genres=${genreStr}&with_original_language=${formSelect.country}&page=${formSelect.pageFilter}&api=hieu987`
      )
    : await axios.get(
        `${URL_API}/discover/${formSelect.type}?sort_by=${formSelect.sortBy}&primary_release_date_lte=${yearGte}&with_genres=${genreStr}&with_original_language=${formSelect.country}&page=${formSelect.pageFilter}&api=hieu987`
      );
};

const getMovies = async (page) =>
  await axios.get(`${URL_API}/movie/phimle?api=hieu987&page=${page}`);

const getTv = async (page) =>
  await axios.get(`${URL_API}/tv/phimbo?api=hieu987&page=${page}`);

const getMovieById = async (movieId, append_to_response = '') =>
  await axios.get(
    `${URL_API}/movie/detail/${movieId}?append_to_response=${append_to_response}&api=hieu987`
  );

const getTvById = async (movieid, append_to_response = '') =>
  await axios.get(
    `${URL_API}/tv/detail/${movieid}?append_to_response=${append_to_response}&api=hieu987`
  );

const getMoviesBySeason = async (movieid, season) =>
  await axios.get(`${URL_API}/tv/${movieid}/season/${season}?api=hieu987`);

const addItemList = async (userID, params) => {
  const bodyFormData = new FormData();
  bodyFormData.append('media_type', params.media_type);
  bodyFormData.append('media_id', params.media_id);

  return await axios.post(
    `${URL_API}/list/${userID}/add_item?api=hieu987`,
    bodyFormData
  );
};

const removeItemList = async (userID, params) => {
  const bodyFormData = new FormData();
  bodyFormData.append('media_type', params.media_type);
  bodyFormData.append('media_id', params.media_id);

  return await axios.post(
    `${URL_API}/list/${userID}/remove_item?api=hieu987`,
    bodyFormData
  );
};

const handleWatchList = async (userID, params) =>
  userID
    ? await axios.post(`${URL_API}/watchlist/${userID}?api=hieu987`, params)
    : await axios.post(`${URL_API}/watchlist/5831457?api=hieu987`, params);

const ratingMovie = async (moveid, { value }) => {
  const bodyFormData = new FormData();
  bodyFormData.append('value', value);

  return await axios.post(
    `${URL_API}/movie/rating/${moveid}?api=hieu987`,
    bodyFormData
  );
};

const ratingTV = async (moveid, { value }) => {
  const bodyFormData = new FormData();
  bodyFormData.append('value', value);

  return await axios.post(
    `${URL_API}/tv/rating/${moveid}?api=hieu987`,
    bodyFormData
  );
};

const getAllGenre = async () =>
  await axios.get(`${URL_API}/genre/all?api=hieu987`);

const getAllYear = async () =>
  await axios.get(`${URL_API}/year/all?api=hieu987`);

const getAllNational = async () =>
  await axios.get(`${URL_API}/country/all?api=hieu987`);

const getAllCountry = () => {
  var countryList = [];

  COUNTRIES?.map((item) => {
    countryList.push(item);
  });
  return countryList;
};

const getIdGenresByName = async (genres_name) =>
  ALLGENRES.genres.find((gen) => (gen.name === genres_name ? gen : null));

// {
//   const genres = await getAllGenre().then((res) => {
//     return res.data;
//   });
//   return genres.find((gen) => (gen.name === genres_name ? gen : null));
// };

// const getGenresNameById = (genreId:number) =>
//   ALLGENRES.genres.find((gen) => (gen.id === genreId ? gen : null));

const getAllGenresById = (genres, allGenres) => {
  var genresArray = [];
  // const allGenres = await getAllGenre().then((res) => {
  //   return res.data;
  // });

  genres?.map((item) => {
    allGenres.find((gen) => {
      if (gen.id === (item?.id ? item.id : item)) {
        genresArray.push(gen?.name_vietsub);
      }
    });
  });

  return genresArray;
};
const getGenresName = (genresName, allGenres) =>
  allGenres.find((gen) => {
    if (gen.name === genresName) {
      return gen;
    }
  });

const getCountry = async (country_name) =>
  // Country.find((country) => country.name2 === country_name);
  {
    const countries = await getAllNational().then((res) => {
      return res.data;
    });
    return countries.find((country) => country.name2 === country_name);
  };

// const getCountry = async (country_name) => {
//   const county = await axios
//     .get(`${URL_API}/country/${country_name}?api=hieu987`)
//     .then((res) => {
//       return res.data;
//     });
//   return county;
// };

const getCountryVietSub = (original_language, allCountries) =>
  allCountries.find((country) => country.name === original_language);

const getLanguage = (original_language, allCountries) =>
  allCountries.find((language) => language.iso_639_1 === original_language);

// const getPoster = (path) => `${TMDB_IMAGE_BASE_URL}/original${path}`;
const getPosterCast = (path) => `${TMDB_IMAGE_BASE_URL}/original${path}`;

const getPoster = (path) => {
  return path === null || path === undefined
    ? ''
    : `${URL_API_IMAGE}/image${path}?api=hieu987`;
};

const getAvatar = (path) => {
  return path === null || path === undefined
    ? ''
    : `${URL_API_IMAGE}/image/account/${path}?api=hieu987`;
};

export {
  getPoster,
  getIdGenresByName,
  getAllGenresById,
  getGenresName,
  getTrending,
  getNowPlaying,
  getUpComing,
  getPopular,
  getTopRated,
  getTvAiringToday,
  getTvOntheAir,
  getTvPopular,
  getTvTopRated,
  getLanguage,
  getDaTaSearch,
  getMovieById,
  getMoviesByGenres,
  getMoviesByYear,
  getMoviesByYearBeFore2000,
  getMovieByCredit,
  getTvByCredit,
  getMovieBySimilar,
  getMovieByRecommend,
  getAllCountry,
  getMovieByCountry,
  getCountry,
  getCountryVietSub,
  getList,
  getTheMostVoteCount,
  getWatchList,
  FilterDataMovie,
  getTv,
  getTvById,
  getMoviesBySeason,
  getAllGenre,
  getAllNational,
  getAllYear,
  addItemList,
  removeItemList,
  handleWatchList,
  getPosterCast,
  getMovies,
  ratingMovie,
  ratingTV,
  signUp,
  signIn,
  getUserToken,
  getAvatar,
};
