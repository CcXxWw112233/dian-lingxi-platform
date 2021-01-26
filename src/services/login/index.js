import request from '../../utils/requestAxios'
import { REQUEST_AUTH, REQUEST_DOMAIN } from '../../globalset/js/constant'

//d登录
export async function formSubmit(data) {
  return request({
    url: `dian_lingxi_auth/signin`,
    method: 'POST',
    data
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

//绑定微信号与账号
export async function wechatAccountBind(data) {
  return request({
    url: `${REQUEST_DOMAIN}/user/wechat/account/bind`,
    method: 'POST',
    data
  })
}

//刷新Token
export const refreshTokenApi = data => {
  return request({
    url: `${REQUEST_DOMAIN}/refreshToken`,
    method: 'PUT',
    data
  })
}

//刷新图片验证码
export const changePicVerifySrc = params => {
  return request({
    url: `${REQUEST_AUTH}/public/oauth/token/getLoginImageCaptcha`,
    method: 'GET',
    params
  })
}

//模拟用户扫码登录测试
export const mockUserScanQrCodeLogin = params => {
  return request({
    url: `${REQUEST_DOMAIN}/wechat/collBack/test`,
    method: 'GET',
    params
  })
}
