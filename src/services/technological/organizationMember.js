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
//分组列表
export async function getGroupList(params) {
  return request({
    url: `${REQUEST_DOMAIN}/group`,
    method: 'GET',
    params
  });
}
//更新分组
export async function updateGroup(data) {
  return request({
    url: `${REQUEST_DOMAIN}/group`,
    method: 'PUT',
    data
  });
}
//删除分组
export async function deleteGroup(data) {
  return request({
    url: `${REQUEST_DOMAIN}/group${data.id}`,
    method: 'DELETE',
    data
  });
}

//获取局部分组数据
export async function getGroupPartialInfo(data) {
  return request({
    url: `${REQUEST_DOMAIN}/group/partial`,
    method: 'PUT',
    data
  });
}



//查询当前用户所拥有或所属组织
export async function getCurrentUserOrganizes(params) {
  return request({
    url: `${REQUEST_DOMAIN}/organization`,
    method: 'GET',
    params
  }, { isNotLoading: true} );
}

//模糊查询组织列表
export async function getSearchOrganizationList(params) {
  return request({
    url: `${REQUEST_DOMAIN}/organization/search`,
    method: 'GET',
    params
  }, { isNotLoading: true} );
}

//创建组织
export async function createOrganization(data) {
  return request({
    url: `${REQUEST_DOMAIN}/organization`,
    method: 'POST',
    data
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
export async function applyJoinOrganization(data) {
  return request({
    url: `${REQUEST_DOMAIN}/organization/apply`,
    method: 'POST',
    data
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
