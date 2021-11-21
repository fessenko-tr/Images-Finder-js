import UrlFetcher from './url-fetcher';
import './styles.css';
import { Notify } from 'notiflix';
import template from './templates/template';
import PicsGetter from './pics-getter';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const input = document.querySelector('.input');
const finish = document.querySelector('.finish');
const inputBtn = document.querySelector('.btn');
const loadMoreBtn = document.querySelector('.btnLoad');
const gallery = document.querySelector('.gallery');

const picsGetter = new PicsGetter(`https://pixabay.com/api/`);

const pictureGallery = new SimpleLightbox('.gallery div a');

async function getPics() {
  picsGetter.perPage = 15;
  const pics = await picsGetter.fetchUrl();
  Notify.success(`we have found ${pics.totalHits} pics!`);

  return pics;
}

async function loadPics() {
  finish.classList.add('hidden');

  gallery.innerHTML = '';

  if (picsGetter.queue.length === 0) {
    loadMoreBtn.classList.add('hidden');
    Notify.failure('please enter not an empry str');
    return;
  }

  picsGetter.page = 1;

  const pics = await getPics();
  createMarkup(pics);
  loadMoreBtn.classList.remove('hidden');

  if (gallery.childElementCount >= pics.totalHits && pics.totalHits !== 0) {
    loadMoreBtn.classList.add('hidden');
    finish.classList.remove('hidden');
  }
}

async function loadMore() {
  picsGetter.page += 1;
  const pics = await getPics();
  if (pics.length === 0) {
    Notify.failure('no pics left ><');
    loadMoreBtn.classList.add('hidden');

    return;
  }
  createMarkup(pics);

  scroll();
}

function createMarkup({ hits, totalHits }) {
  if (hits.length === 0) {
    loadMoreBtn.classList.add('hidden');

    Notify.failure('notjing is found');
    return;
  }
  gallery.insertAdjacentHTML('beforeend', template(hits));
  pictureGallery.refresh();
}

form.addEventListener('submit', e => {
  e.preventDefault();
  picsGetter.setProperQ(e.target.elements[0].value);
  loadPics();
});

loadMoreBtn.addEventListener('click', e => {
  e.preventDefault();
  loadMore();
});

function scroll() {
  window.scrollBy({
    top: gallery.firstElementChild.getBoundingClientRect().height * 2,
    behavior: 'smooth',
  });
}
