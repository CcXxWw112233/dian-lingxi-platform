import { message } from 'antd';
import axios from 'axios'
import Cookies from 'js-cookie'
import _ from "lodash";


function messageLoading(url) {
  return (
    message.loading('加载中...', 0)
  )
}
axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default function request(options = {}, elseSet = {}) {
  const { isNotLoading } = elseSet
  const {
    url = '',
    headers = {},
    method = "post",
    params = {},
    data = {},
  } = options;
  let loading = !isNotLoading ? messageLoading(url) : ''
  let header = Object.assign({}, options.headers)
  const Authorization = Cookies.get('Authorization')
  const refreshToken = Cookies.get('refreshToken')

  header['Authorization'] =  Authorization//refreshToken
  header['refreshToken'] =  refreshToken
  return new Promise((resolve, reject) => {
    const { clooseLoading = false } = elseSet
    axios({
      ...{
        url,
        headers: header,
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
        if (_.has(error, "response.status")) {
          switch (error.response.status) {
            case 401:
              const is401 = Cookies.get('is401') === 'false' || !Cookies.get('is401')? false : true
              if(!is401) {
                Cookies.set('is401', true, {expires: 30, path: ''})
                window.location.hash = `#/login?redirect=${window.location.hash.replace('#','')}`
              }else{
              }
              break
            default:
              break
          }
        }
      }).finally(() => {
        // message.destroy()
        setTimeout(loading,0);
      });
  })
}
