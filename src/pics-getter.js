import axios from 'axios';

class PixabayPicsGetter  {
 
  #PRIVATE_KEY = '24442755-5b469587b1e17155da92db841';
  page = 1;
  totalHits = 0;
  baseUrl ='https://pixabay.com/api/'
  queue = '';


  constructor( perPage = 20 ) {
  this.perPage = perPage;

  }
  
  composeURL(){
    return `${this.baseUrl}?key=${this.#PRIVATE_KEY}&q=${this.queue}&page=${this.page}&per_page=${this.perPage}&image_type=photo&orientation=horizontal&safesearch=true`
  }
  async fetchUrl() {
  
  this.onEmptyQ();
  
  console.log(this.composeURL())
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
  
  onEmptyQ(){
  if (this.queue.length === 0){
   throw new Error('q is empty')
  }
  }
  
  onEmptyResults(data) {
  if(data.length === 0){
  throw new Error('no pics');
  }
  }
  
 
  
  }
  
  

export default PixabayPicsGetter;
