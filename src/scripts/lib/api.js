import axios from 'axios';

export default axios.create({
  baseURL: '/',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});
