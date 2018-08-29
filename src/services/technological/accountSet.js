import request from "../../utils/requestAxios";
import {REQUEST_DOMAIN} from "../../globalset/js/constant";

//获取用户信息
export async function getUserInfo(params) {
  return request({
    url: `${REQUEST_DOMAIN}/user`,
    method: 'GET',
  });
}

//更向用户信息
export async function updateUserInfo(data) {
  return request({
    url: `${REQUEST_DOMAIN}/user`,
    method: 'PUT',
    data,
  });
}

//更改密码
export async function changePassWord(data) {
  return request({
    url: `${REQUEST_DOMAIN}/user/password`,
    method: 'PUT',
    data,
  });
}
