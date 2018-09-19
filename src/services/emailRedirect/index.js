import request from '../../utils/requestAxios'
import { REQUEST_DOMAIN } from '../../globalset/js/constant'

//d登录
export async function confirmEmail(params) {
  return request({
    url: `${REQUEST_DOMAIN}/user/change/email/confirm`,
    method: 'GET',
    params,
  });
}

