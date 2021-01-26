import request from '../../utils/requestAxios'
import { REQUEST_AUTH, REQUEST_DOMAIN } from '../../globalset/js/constant'

//注册
export async function formSubmit(data) {
  return request({
    url: `${REQUEST_DOMAIN}/user/oauth/signup`,
    method: 'POST',
    data: data
  })
}

//获取验证码
export async function requestVerifyCode(data) {
  return request({
    url: `${REQUEST_AUTH}/public/sms/code/send`,
    method: 'POST',
    data
  })
}

//验证邮箱或手机号是否已注册
export async function checkAccountRestered(data) {
  const { accountType, email = '', mobile = '' } = data
  return request({
    url: `${REQUEST_DOMAIN}/user/${accountType}/check`,
    method: 'GET',
    params: {
      email,
      mobile
    }
  })
}
//注册绑定微信并且登录
export async function wechatSignupBindLogin(data) {
  return request({
    url: `${REQUEST_DOMAIN}/user/oauth/token/wechat_account_bind`,
    method: 'POST',
    data
  })
}
