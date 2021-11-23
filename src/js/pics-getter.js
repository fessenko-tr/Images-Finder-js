import axios from 'axios';

class PixabayPicsGetter  {
 
  #PRIVATE_KEY = '24442755-5b469587b1e17155da92db841';
  page = 1;
  totalHits = 0;
  baseUrl ='https://pixabay.com/api/'
  queue = '';

  constructor( perPage ) {
  this.perPage = perPage;
  }
  
  composeURL(){
    return `${this.baseUrl}?key=${this.#PRIVATE_KEY}&q=${this.queue}&page=${this.page}&per_page=${this.perPage}&image_type=photo&orientation=horizontal&safesearch=true`
  }

  async fetchUrl() {
  this.onEmptyQ();
  const data = await axios.get(this.composeURL());

  this.onEmptyResults(data.data.hits);

  return await data.data;
  
  }
  
  set q(usersString) {
  this.queue = usersString
  .split(' ')
  .filter(e => e.length !== 0)
  .join('+');
  }
  
  get q(){
  return this.queue;
  }
  
  set itemsOnPage(itemsOnPage){
    this.perPage = itemsOnPage;
  } 

  get itemsOnPage(){
    return this.perPage;
  }

  get currentPage(){
    return this.page;
  }

  onEmptyQ(){
  if (this.queue.length === 0){
   throw new Error('Enter something to get the pics!')
  }
  }
  
  onEmptyResults(data) {
  if(data.length === 0){
  throw new Error('Sorry, there are no images matching your search query. Please try again.');
  }
  }

  
  }


export default PixabayPicsGetter;
