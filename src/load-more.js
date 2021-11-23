import './styles.css';
import { Notify } from 'notiflix';
import template from './templates/template';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PixabayPicsGetter from './pics-getter';


const form = document.querySelector('#search-form');
const finish = document.querySelector('.finish');
const loadMoreBtn = document.querySelector('.btnLoad');
const gallery = document.querySelector('.gallery');
const input = document.querySelector('input')


const picsGetter = new PixabayPicsGetter();
const pictureGallery = new SimpleLightbox('.gallery div a');

form.addEventListener('submit', e => {
  e.preventDefault();
  picsGetter.q = input.value;
  loadInitialPics();
});

loadMoreBtn.addEventListener('click', loadMore);

async function getPicsFromServer() {
  picsGetter.perPage = 70;
  const pics = await picsGetter.fetchUrl();

  return pics;
}

async function loadInitialPics() {
  clearInterfaceOnPicLoad();
  try {
    const pics = await getPicsFromServer();
    Notify.success(`we have found ${pics.totalHits} pics!`);
    picsGetter.totalHits = pics.totalHits;
    createMarkup(pics);
    isLastPage();
  } catch (error) {
    Notify.failure(error.message);
    return;
  }
}

async function loadMore() {
  picsGetter.page += 1;
  try {
    loadMoreBtn.classList.add('loader')
    const pics = await getPicsFromServer();
    createMarkup(pics);
    loadMoreBtn.classList.remove('loader')


    smoothScrollOnLoad();
    isLastPage();
  } catch (error) {
    return;
  }
}

function clearInterfaceOnPicLoad() {
  finish.classList.add('hidden');
  loadMoreBtn.classList.add('hidden');
  gallery.innerHTML = '';
  picsGetter.page = 1;
  picsGetter.totalHits = 0;
}

function createMarkup({ hits }) {
  gallery.insertAdjacentHTML('beforeend', template(hits));
  pictureGallery.refresh();
}

function smoothScrollOnLoad() {
  window.scrollBy({
    top: gallery.firstElementChild.getBoundingClientRect().height * 2,
    behavior: 'smooth',
  });
}

function isLastPage() {
  if (gallery.childElementCount >= picsGetter.totalHits) {
    finish.classList.remove('hidden');
    loadMoreBtn.classList.add('hidden');
  } else {
    loadMoreBtn.classList.remove('hidden');
  }
}

