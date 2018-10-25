import request from '../../utils/requestAxios'
import { REQUEST_DOMAIN } from '../../globalset/js/constant'
import Cookies from 'js-cookie'

//更新组织
export async function updateOrganization(data) {
  return request({
    url: `${REQUEST_DOMAIN}/organization`,
    method: 'PUT',
    data
  });
}

//上传组织logo
export async function uploadOrganizationLogo(data) {
  return request({
    url: `${REQUEST_DOMAIN}/organization/logo_upload`,
    method: 'POST',
    data
  });
}
