import { message } from 'antd';
import axios from 'axios'
import Cookies from 'js-cookie'
import _ from "lodash";


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
  console.log(window.location)
  const {
    url = '',
    headers = {},
    method = "post",
    params = {},
    data = {},
  } = options;
  let header = Object.assign({}, options.headers)
  const Authorization = Cookies.get('Authorization')
  const refreshToken = Cookies.get('refreshToken')

  header['Authorization'] =  Authorization//refreshToken
  if (!header['content-type']) {
    header['content-type'] = 'application/x-www-form-urlencoded'
  }
  return new Promise((resolve, reject) => {
    const { clooseLoading = false } = elseSet
    clooseLoading ? loading = message.loading('加载中...', 0):''
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
              // window.location.hash = `#/login?redirect=${window.location.hash.replace('#','')}`
              break
            default:
              break
          }
        }
      }).finally(() => {
        setTimeout(loading,0);
      });
  })
}
