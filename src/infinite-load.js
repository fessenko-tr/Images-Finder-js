import './styles.css';
import { Notify } from 'notiflix';
import template from './templates/template';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PixabayPicsGetter from './pics-getter';
import InfiniteScroll from 'infinite-scroll'

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const input = document.querySelector('input')

const picsGetter = new PixabayPicsGetter();
const pictureGallery = new SimpleLightbox('.gallery div a');

const infiniteScroll = new InfiniteScroll(gallery, {
    path: ()=>picsGetter.composeURL(),
      responseBody: 'json',
      history: false,
       status: '.page-load-status',

});

form.addEventListener('submit',loadInitialPics);

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
        picsGetter.q = input.value;
        const pics = await picsGetter.fetchUrl();
        Notify.success(`we have found ${pics.totalHits} pics!`);
        infiniteScroll.off()
        infiniteScroll.loadNextPage();

    }catch(error){
        Notify.failure(error.message);
    } 
}












  function createMarkup({ hits }) {
    gallery.insertAdjacentHTML('beforeend', template(hits));
  }
  

  function clearInterfaceOnPicLoad() {
  gallery.innerHTML = '';
  picsGetter.page = 1;
  picsGetter.totalHits = 0;
}

