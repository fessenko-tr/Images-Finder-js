import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import { Notify } from 'notiflix';
import template from '../templates/template';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PixabayPicsGetter from './pics-getter';
import InfiniteScroll from 'infinite-scroll'
import MarkupMaker from './mark-up-maker';
import { throttle } from 'infinite-scroll/js/core';
import { transparentNavOnScroll } from './index';

const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const inputRef = document.querySelector('input')
const navBarRef = document.querySelector('.navbar')


const infinitePicsGetter = new PixabayPicsGetter(40);
const pictureGallery = new SimpleLightbox('.gallery div a', {
    scaleImageToRatio: true,
});
const infiniteMarkupMaker = new MarkupMaker(galleryRef,template, infinitePicsGetter )


let infiniteScroll = null;


formRef.addEventListener('submit',loadInitialPics);


function startScrolling(instance) {
    instance.on( 'load', (pics)=>{
        infinitePicsGetter.onEmptyResults(pics.hits)
        infiniteMarkupMaker.createMarkup(pics.hits, 'beforeend');
        infinitePicsGetter.page+=1;
        pictureGallery.refresh();
});
}


function createNewScroller(){
    return new InfiniteScroll(galleryRef, {
        path: ()=>infinitePicsGetter.composeURL(),
          responseBody: 'json',
          history: false,
           status: '.page-load-status',
    
    });
}

async function loadInitialPics(e){
    try {
        e.preventDefault();
        infiniteScroll?.destroy();
        infiniteScroll = createNewScroller();
        infiniteMarkupMaker.clearMarkup()
        infinitePicsGetter.q = inputRef.value;
        const pics = await infinitePicsGetter.fetchUrl();
        Notify.success(`Hooray! We found ${pics.totalHits} images!`);
        startScrolling(infiniteScroll)
        infiniteScroll.loadNextPage();

    }catch(error){
        Notify.failure(error.message);
    } 
}


window.addEventListener('scroll', throttle(()=>{
    transparentNavOnScroll(navBarRef, "rgb(24, 22, 32);", "rgb(24, 22, 32, 0.7)")
}, 500));


