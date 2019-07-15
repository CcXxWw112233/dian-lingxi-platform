import { message } from 'antd';
import axios from 'axios'
import Cookies from 'js-cookie'
import _ from "lodash";
import {REQUEST_DOMAIN} from "../globalset/js/constant";
import { reRefreshToken } from './oauth'
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

  //去掉空字符串
  // if (params && typeof params === 'object') {
  //   for(let i in params) {
  //     if(!params[i]) {
  //       delete params[i]
  //     }
  //   }
  // }
  // if (data && typeof data === 'object') {
  //   for (let i in data) {
  //     if (!data[i]) {
  //       delete data[i]
  //     }
  //   }
  // }

  let loading = !isNotLoading ? messageLoading(url) : ''
  let header = Object.assign({}, options.headers)
  const Authorization = Cookies.get('Authorization')
  const refreshToken = Cookies.get('refreshToken')

  header['Authorization'] = Authorization//refreshToken
  header['refreshToken'] = refreshToken
  header['OrganizationId'] = localStorage.getItem('OrganizationId') || '0'
  header['BoardId'] = localStorage.getItem('storageCurrentOperateBoardId') || '0'//当前操作项目的项目id

  // header['board_id'] = board_id

  return new Promise((resolve, reject) => {
    const { clooseLoading = false } = elseSet
    axios({
      ...{
        url,
        headers: {...header, ...headers},
        method,
        params,
        data,
        timeout: 60000,
      }
    })
      .then(res => {
        setTimeout(loading,0);

        resolve(res.data);
      })
      .catch((error, e) => {
        setTimeout(loading,0);

        if (_.has(error, "response.status")) {
          switch (error.response.status) {
            case 401:
              reRefreshToken({
                refreshToken: Cookies.get('refreshToken'),
                accessToken: Cookies.get('Authorization')
              })
              break
            default:
              break
          }
        } else {
          message.error('系统繁忙，请稍后重试！')
        }
      })
  })
}




// switch (error.response.status) {
//   case 401:
//     const is401 = Cookies.get('is401') === 'false' || !Cookies.get('is401')? false : true
//     Cookies.remove('userInfo', { path: '' })
//     if(!is401) {
//       Cookies.set('is401', true, {expires: 30, path: ''})
//       setTimeout(function () {
//         window.location.hash = `#/login?redirect=${window.location.hash.replace('#','')}`
//       },1000)
//     }else{
//     }
//     break
//   default:
//     break
// }
