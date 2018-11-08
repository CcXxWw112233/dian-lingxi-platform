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

//角色权限列表
export async function getRolePermissions(params) {
  return request({
    url: `${REQUEST_DOMAIN}/permissions/role`,
    method: 'GET',
    params
  });
}
//保存角色权限
export async function saveRolePermission(data) {
  return request({
    url: `${REQUEST_DOMAIN}/permissions/role`,
    method: 'POST',
    data
  });
}
//创建角色
export async function createRole(data) {
  return request({
    url: `${REQUEST_DOMAIN}/role`,
    method: 'POST',
    data
  });
}
//更新角色
export async function updateRole(data) {
  return request({
    url: `${REQUEST_DOMAIN}/role`,
    method: 'PUT',
    data
  });
}
//删除角色
export async function deleteRole(data) {
  return request({
    url: `${REQUEST_DOMAIN}/role`,
    method: 'DELETE',
    data
  });
}
//复制角色
export async function copyRole(data) {
  return request({
    url: `${REQUEST_DOMAIN}/role/copy`,
    method: 'PUT',
    data
  });
}
//创建角色
export async function setDefaultRole(data) {
  return request({
    url: `${REQUEST_DOMAIN}/role/default`,
    method: 'PUT',
    data
  });
}

//获取权限列表
export async function getPermissions(params) {
  return request({
    url: `${REQUEST_DOMAIN}/permissions`,
    method: 'GET',
    params
  });
}
//保存权限
export async function savePermission(data) {
  return request({
    url: `${REQUEST_DOMAIN}/permissions`,
    method: 'POST',
    data
  });
}
