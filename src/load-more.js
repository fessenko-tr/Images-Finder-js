import './styles.css';
import { Notify } from 'notiflix';
import template from './templates/template';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PixabayPicsGetter from './pics-getter';


const formRef = document.querySelector('#search-form');
const onPicsEndText = document.querySelector('.finish');
const loadMoreBtn = document.querySelector('.btnLoad');
const galleryRef = document.querySelector('.gallery');
const userQuery = document.querySelector('input')


const picsGetter = new PixabayPicsGetter(40);
const pictureGallery = new SimpleLightbox('.gallery div a');

formRef.addEventListener('submit', e => {
  e.preventDefault();
  picsGetter.q = userQuery.value;
  loadInitialPics();
});

loadMoreBtn.addEventListener('click', loadMore);

 function getPicsFromServer() {
  return picsGetter.fetchUrl();
}

async function loadInitialPics() {
  clearInterfaceOnPicLoad();

  try {
    const pics = await getPicsFromServer();
    Notify.success(`Hooray! We found ${pics.totalHits} images!`);
    picsGetter.totalHits = pics.totalHits;
    createMarkup(pics);
    isLastPage();
  } catch (error) {
    Notify.failure(error.message);
  }
}

async function loadMore() {
    picsGetter.page += 1;
    loadMoreBtn.classList.add('loader')
    const pics = await getPicsFromServer();
    createMarkup(pics);
    loadMoreBtn.classList.remove('loader')
    smoothScrollOnLoad();
    isLastPage();
  
}

function clearInterfaceOnPicLoad() {
  onPicsEndText.classList.add('hidden');
  loadMoreBtn.classList.add('hidden');
  galleryRef.innerHTML = '';
  picsGetter.page = 1;
  picsGetter.totalHits = 0;
}

function createMarkup({ hits }) {
  galleryRef.insertAdjacentHTML('beforeend', template(hits));
  pictureGallery.refresh();
}

function smoothScrollOnLoad() {
  window.scrollBy({
    top: galleryRef.firstElementChild.getBoundingClientRect().height * 2,
    behavior: 'smooth',
  });
}

function isLastPage() {
  if (galleryRef.childElementCount >= picsGetter.totalHits) {
    onPicsEndText.classList.remove('hidden');
    loadMoreBtn.classList.add('hidden');
  } else {
    loadMoreBtn.classList.remove('hidden');
  }
}

