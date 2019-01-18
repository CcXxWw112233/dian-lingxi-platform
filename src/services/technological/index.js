import request from '../../utils/requestAxios'
import { REQUEST_DOMAIN } from '../../globalset/js/constant'
import Cookies from 'js-cookie'

//获取用户信息
export async function getUSerInfo(params) {
  return request({
    url: `${REQUEST_DOMAIN}/user`,
    method: 'GET',
  });
}


//退出登录
export async function logout(data) {
  return request({
    url: `${REQUEST_DOMAIN}/user/logout`,
    method: 'GET',
    params: {
      accessToken:  Cookies.get('Authorization'),
      refreshToken: Cookies.get('refreshToken')
    },
  });
}



