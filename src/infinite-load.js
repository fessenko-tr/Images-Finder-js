import './styles.css';
import { Notify } from 'notiflix';
import template from './templates/template';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PixabayPicsGetter from './pics-getter';
import InfiniteScroll from 'infinite-scroll'

const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const inputRef = document.querySelector('input')

const picsGetter = new PixabayPicsGetter(40);
const pictureGallery = new SimpleLightbox('.gallery div a');

const infiniteScroll = new InfiniteScroll(galleryRef, {
    path: ()=>picsGetter.composeURL(),
      responseBody: 'json',
      history: false,
       status: '.page-load-status',

});

formRef.addEventListener('submit',loadInitialPics);

infiniteScroll.on( 'load', (body)=>{
    picsGetter.onEmptyResults(body.hits)
        createMarkup(body)
        picsGetter.page+=1;
        pictureGallery.refresh();
});


async function loadInitialPics(e){

    try {
        e.preventDefault();
        clearInterfaceOnPicLoad()
        picsGetter.q = inputRef.value;
        const pics = await picsGetter.fetchUrl();
        Notify.success(`Hooray! We found ${pics.totalHits} images!`);
        infiniteScroll.off()
        infiniteScroll.loadNextPage();

    }catch(error){
        Notify.failure(error.message);
    } 
}


  function createMarkup({ hits }) {
    galleryRef.insertAdjacentHTML('beforeend', template(hits));
  }
  

  function clearInterfaceOnPicLoad() {
    galleryRef.innerHTML = '';
  picsGetter.page = 1;
  picsGetter.totalHits = 0;
}

