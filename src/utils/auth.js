//刷新Token
import request from "./requestAxios";
import {REQUEST_DOMAIN} from "../globalset/js/constant";
import Cookies from 'js-cookie'

const gotoRefresh = async (data) => {
  const refreshTokenApi = (data) => {
    return request({
      url: `${REQUEST_DOMAIN}/refreshToken`,
      method: 'PUT',
      data
    });
  }
  const res = await refreshTokenApi(data)
  const code = res.code
  if('0' == code) {
    const tokenArray = res.data.split('__')
    Cookies.set('Authorization', tokenArray[0], {expires: 30, path: ''})
    Cookies.set('refreshToken', tokenArray[1], {expires: 30, path: ''})
    Cookies.set('is401', false, {expires: 30, path: ''})
  }else if('401' == code){
    Cookies.set('is401', true, {expires: 30, path: ''})
    setTimeout(function () {
      window.location.hash = `#/login?redirect=${window.location.hash.replace('#','')}`
    },1000)
  }else {
    Cookies.set('is401', true, {expires: 30, path: ''})
    setTimeout(function () {
      window.location.hash = `#/login?redirect=${window.location.hash.replace('#','')}`
    },1000)
  }
}
export const reRefreshToken = (data) => {
  const is401 = Cookies.get('is401') === 'false' || !Cookies.get('is401')? false : true
  if(!is401) {
    Cookies.set('is401', true, {expires: 30, path: ''})
    setTimeout(function () {
      gotoRefresh(data)
    }, 500)
  }
}
