import axios from 'axios'
axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default function request(options = {}) {
  const {
    url = '',
    headers = {},
    method = "post",
    params = {},
    data = {},
  } = options;
  let header = Object.assign({}, options.header)
  if (!header['content-type']) {
    header['content-type'] = 'application/x-www-form-urlencoded'
  }
  return new Promise((resolve, reject) => {
    axios({
      ...{
        url,
        headers,
        method,
        params,
        data,
        url,
      }
    })
      .then(res => {
        resolve(res.data);
      })
      .catch((error, e) => {
        console.log(error)
        reject(error)
      });
  })
}
