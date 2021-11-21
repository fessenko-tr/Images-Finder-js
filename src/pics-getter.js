import axios from 'axios';
import UrlFetcher from './url-fetcher';

class picsGetter extends UrlFetcher {
  #PRIVATE_KEY = '24442755-5b469587b1e17155da92db841';
  constructor(baseURL, queue = '', page = 1, perPage = 40) {
    super(baseURL);
    this.queue = queue;
    this.page = page;
    this.perPage = perPage;
  }
  async fetchUrl() {
    const URL = `${this.baseUrl}?key=${this.#PRIVATE_KEY}&q=${this.queue}&page=${this.page}&per_page=${this.perPage}`;
    const data = await axios.get(URL);
    return await data.data;
  }

  setProperQ(usersString) {
    this.queue = usersString
      .split(' ')
      .filter(e => e.length !== 0)
      .join('+');
  }
}

export default picsGetter;
