import request from '../../utils/requestAxios'
import { REQUEST_DOMAIN_WORK_BENCH } from '../../globalset/js/constant'
import Cookies from 'js-cookie'

//获取用户信息
export async function getUSerInfo(params) {
  return request({
    url: `${REQUEST_DOMAIN_WORK_BENCH}/user`,
    method: 'GET',
  });
}


//退出登录
export async function logout(data) {
  return request({
    url: `${REQUEST_DOMAIN_WORK_BENCH}/user/logout`,
    method: 'GET',
    params: {
      accessToken:  Cookies.get('Authorization'),
      refreshToken: Cookies.get('refreshToken')
    },
  });
}



