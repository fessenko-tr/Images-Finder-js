import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import '../scss/_load-more.scss';
import { throttle } from 'infinite-scroll/js/core';
import template from '../templates/template';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PixabayPicsGetter from './pics-getter';
import MarkupMaker from './mark-up-maker';
import { Notify } from 'notiflix';
import { transparentNavOnScroll, smoothScroll } from './index';



const formRef = document.querySelector('#search-form');
const onPicsEndText = document.querySelector('.finish-text');
const loadMoreBtn = document.querySelector('.btnLoad');
const galleryRef = document.querySelector('.gallery');
const userQuery = document.querySelector('input')
const loaderRef = document.querySelector('.spinner-border')
const navBarRef = document.querySelector('.navbar')



const loadMorepicsGetter = new PixabayPicsGetter(40);
const pictureGallery = new SimpleLightbox('.gallery div a');
const loadMoreMarkupMaker = new MarkupMaker(galleryRef,template, loadMorepicsGetter )


formRef.addEventListener('submit', e => {
  e.preventDefault();
  loadMorepicsGetter.q = userQuery.value;
  loadInitialPics();
});

loadMoreBtn.addEventListener('click', loadMore);

 function getPicsFromServer() {
  return loadMorepicsGetter.fetchUrl();
}

async function loadInitialPics() {
  clearInterfaceOnPicLoad();

  try {
    const pics = await getPicsFromServer();
    Notify.success(`Hooray! We found ${pics.totalHits} images!`);
    loadMorepicsGetter.totalHits = pics.totalHits;
    createMarkupAndRefreshGallery(pics);
    isLastPage();
  } catch (error) {
    Notify.failure(error.message);
  }
}


async function loadMore() {
  loadMorepicsGetter.page += 1;
  loaderRef.classList.remove('hidden')
    const pics = await getPicsFromServer();
    createMarkupAndRefreshGallery(pics);
    loaderRef.classList.add('hidden')
    smoothScroll(galleryRef.firstElementChild.getBoundingClientRect().height * 2);
    isLastPage() && onPicsEndText.classList.remove('hidden');
  
}

function clearInterfaceOnPicLoad() {
  onPicsEndText.classList.add('hidden');
  loadMoreBtn.classList.add('hidden');
  loadMoreMarkupMaker.clearMarkup();
}

function createMarkupAndRefreshGallery({ hits }) {
  loadMoreMarkupMaker.createMarkup(hits, 'beforeend')
  pictureGallery.refresh();
}

function isLastPage() {
  if (galleryRef.childElementCount >= loadMorepicsGetter.totalHits) {
      loadMoreBtn.classList.add('hidden');
      return true;
  } else {
    loadMoreBtn.classList.remove('hidden');
    return false;
  }
}


window.addEventListener('scroll', throttle(()=>{
  transparentNavOnScroll(navBarRef, "rgb(24, 22, 32);", "rgb(24, 22, 32, 0.7)")
}, 500));