import request from '../../utils/requestAxios'
import { REQUEST_DOMAIN } from '../../globalset/js/constant'
import Cookies from 'js-cookie'

//创建分组
export async function CreateGroup(data) {
  return request({
    url: `${REQUEST_DOMAIN}/group`,
    method: 'POST',
    data
  });
}

//移出分组成员
export async function removeMembersWithGroup(data) {
  return request({
    url: `${REQUEST_DOMAIN}/group/remove`,
    method: 'DELETE',
    data
  });
}

//给成员设置分组
export async function setMemberWitchGroup(data) {
  return request({
    url: `${REQUEST_DOMAIN}/group/set`,
    method: 'PUT',
    data
  });
}



//模糊查询组织列表
export async function getSearchOrganizationList(params) {
  return request({
    url: `${REQUEST_DOMAIN}/organization`,
    method: 'GET',
    params
  });
}

//创建组织
export async function createOrganization(params) {
  return request({
    url: `${REQUEST_DOMAIN}/organization`,
    method: 'POST',
    params
  });
}

//更新组织
export async function updateOrganization(data) {
  return request({
    url: `${REQUEST_DOMAIN}/organization`,
    method: 'PUT',
    data
  });
}

//申请加入组织
export async function applyJoinOrganization(params) {
  return request({
    url: `${REQUEST_DOMAIN}/organization/apply`,
    method: 'GET',
    params
  });
}

//邀请成员加入组织
export async function inviteJoinOrganization(data) {
  return request({
    url: `${REQUEST_DOMAIN}/organization/invite`,
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
