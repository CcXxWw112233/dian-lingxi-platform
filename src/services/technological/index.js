import request from '../../utils/requestAxios'
import { REQUEST_DOMAIN } from '../../globalset/js/constant'

//获取用户信息
export async function getUSerInfo(params) {
  return request({
    url: `${REQUEST_DOMAIN}/user`,
    method: 'GET',
  });
}


//d登录
export async function formSubmit(data) {
  return request({
    url: `${REQUEST_DOMAIN}/user/signin`,
    method: 'POST',
    data,
  });
}

//获取验证码
export async function requestVerifyCode(data) {
  return request({
    url: `${REQUEST_DOMAIN}/sms/code/send`,
    method: 'POST',
    data,
  });
}
