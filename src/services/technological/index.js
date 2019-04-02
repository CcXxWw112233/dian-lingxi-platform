import request from '../../utils/requestAxios'
import {REQUEST_DOMAIN, REQUEST_DOMAIN_BOARD} from '../../globalset/js/constant'
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
      accessToken: Cookies.get('Authorization'),
      refreshToken: Cookies.get('refreshToken')
    },
  });
}

//获取全局搜索类型列表
export async function getGlobalSearchTypeList(params) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/comm/search/type/list`,
    method: 'GET',
    params
  });
}

//获取全局搜索类型列表
export async function getGlobalSearchResultList(params) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/comm/search`,
    method: 'GET',
    params
  }, {isNotLoading: true});
}
