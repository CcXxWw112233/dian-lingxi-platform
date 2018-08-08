import { message } from 'antd';
import axios from 'axios'

let loading ;
axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default function request(options = {}, elseSet = {}) {
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
    const { clooseLoading = false } = elseSet
    clooseLoading ? loading = message.loading('加载中...', 0):''
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
        // reject(error)
      }).finally(() => {
        setTimeout(loading,0);
     });
  })
}
