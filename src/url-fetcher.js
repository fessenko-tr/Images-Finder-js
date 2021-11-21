import axios from 'axios';
import { Notify } from 'notiflix';

class UrlFetcher {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async fetchUrl(params) {
    const data = await axios.get(this.baseUrl + params);
    return data.data;
  }
}

export default UrlFetcher;
