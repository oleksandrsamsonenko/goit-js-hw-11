import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix';
// import throttle from 'lodash.throttle';

const apiKey = `32997992-21d577d14436d1c75bdc39ad8`;

const searchForm = document.querySelector(`#search-form`);
const galleryEl = document.querySelector(`.gallery`);
const loadMore = document.querySelector(`.load-more`);
// const {
//   elements: { searchQuery },
// } = searchForm;
const searchQuery = document.querySelector(`[name="searchQuery"]`);
let pageCounter = 1;

let pictureCounter = 0;
let gallery = new SimpleLightbox('.gallery a', {
  showCounter: true,
  disableRightClick: true,
});
gallery.on('show.simplelightbox', function () {});
loadMore.setAttribute(`hidden`, ``);
searchForm.addEventListener(`submit`, event => {
  event.preventDefault();
  pageCounter = 1;
  pictureCounter = 0;
  //   const URL = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery.value}&page=${pageCounter}&orientation=horizontal&safesearch=true`;
  getPictures(URL);
});

loadMore.addEventListener(`click`, () => {
  //   const URL = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery.value}&page=${pageCounter}&orientation=horizontal&safesearch=true`;
  getPictures(URL);
});

async function getPictures() {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery.value}&page=${pageCounter}&orientation=horizontal&safesearch=true`,
      {
        params: {
          per_page: 40,
        },
      }
    );
    console.log(response);
    if ((response.data.hits.length === 0) & (pageCounter === 1)) {
      throw new Error(
        `Sorry, there are no images matching your search query. Please try again.`
      );
    }
    if ((pictureCounter === response.data.totalHits) & (pageCounter !== 1)) {
      loadMore.setAttribute(`hidden`, ``);
      throw new Error(
        `We're sorry, but you've reached the end of search results.`
      );
    }
    pageCounter += 1;
    response.data.hits.forEach(element => {
      //   console.log(element);
      pictureCounter += 1;
      //   console.log(response.data.hits.length);

      galleryEl.insertAdjacentHTML(
        `beforeend`,
        `<div class="photo-card">
        <a class="gallery__item" href="${element.largeImageURL}"><img class="gallery__image" src=${element.webformatURL} alt="" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <span><b>Likes:</b></span><span>${element.likes}</span>
    </p>
    <p class="info-item">
      <span><b>Views:</b></span> <span>${element.views}</span>
    </p>
    <p class="info-item">
      <span><b>Comments:</b></span> <span>${element.comments}</span>
    </p>
    <p class="info-item">
      <span><b>Downloads:</b></span> <span>${element.downloads}</span>
    </p>
  </div>
</div>`
      );
    });
    gallery.refresh();
    loadMore.removeAttribute(`hidden`, ``);
  } catch (error) {
    Notify.warning(error.message);
  }
}

// window.addEventListener('scroll', throttle(handleUserScroll, 500));
// function handleUserScroll() {
//   const scrollTop = document.documentElement.scrollTop;
//   const scrollHeight = document.documentElement.scrollHeight;
//   const clientHeight = document.documentElement.clientHeight;
//   if (scrollTop + clientHeight > scrollHeight - clientHeight) {
//     console.log(scrollTop);
//     getPictures(URL);
//   }
// }
