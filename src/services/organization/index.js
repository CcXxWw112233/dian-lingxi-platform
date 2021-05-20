import request from '../../utils/requestAxios'
import {
  REQUEST_DOMAIN,
  REQUEST_DOMAIN_FLOWS
} from '../../globalset/js/constant'
import Cookies from 'js-cookie'
import { isApiResponseOk } from '../../utils/handleResponseData'

// 获取对应组织下的组织成员列表（仅列表）
export async function getCorrespondingOrganizationMmembers(params) {
  return request({
    url: `${REQUEST_DOMAIN}/member/all/list`,
    method: 'GET',
    params: {
      ...params,
      _organization_id: params._organization_id
        ? params._organization_id
        : localStorage.getItem('OrganizationId')
    }
  })
}

//根据用户id获取用户信息，支持获取多个用户
export async function fetchUsersByIds({ ids }) {
  //ids: 用户id, 多个用逗号隔开
  return request({
    url: `${REQUEST_DOMAIN}/user/info/list`,
    method: 'GET',
    params: { ids }
  })
}

//更新组织
export async function updateOrganization(data) {
  return request({
    url: `${REQUEST_DOMAIN}/organization`,
    method: 'PUT',
    data: {
      ...data,
      _organization_id: localStorage.getItem('OrganizationId')
    }
  })
}

//上传组织logo
export async function uploadOrganizationLogo(data) {
  return request({
    url: `${REQUEST_DOMAIN}/organization/logo_upload`,
    method: 'POST',
    data
  })
}

//角色权限列表
export async function getRolePermissions(params) {
  return request({
    url: `${REQUEST_DOMAIN}/permissions/role`,
    method: 'GET',
    params
  })
}
//保存角色权限
export async function saveRolePermission(data) {
  return request({
    url: `${REQUEST_DOMAIN}/permissions/role`,
    method: 'POST',
    data
  })
}
/**
 * 创建角色
 * @param {{_organization_id: string , name: string, group_id:string, parent_id: string}} data 新建的角色数据
 * @returns {Promise<{data:any, code: string,message:string}>}
 */
export async function createRole(data) {
  return request({
    url: `${REQUEST_DOMAIN}/role`,
    method: 'POST',
    data: {
      ...data,
      _organization_id: localStorage.getItem('OrganizationId')
    }
  })
    .then(resp => {
      if (isApiResponseOk(resp)) {
        return resp
      }
      return Promise.reject(resp)
    })
    .catch(err => Promise.reject(err))
}
//更新角色
export async function updateRole(data) {
  return request({
    url: `${REQUEST_DOMAIN}/role`,
    method: 'PUT',
    data
  })
    .then(resp => {
      if (isApiResponseOk(resp)) {
        return resp
      }
      return Promise.reject(resp)
    })
    .catch(err => Promise.reject(err))
}
//删除角色
export async function deleteRole(data) {
  return request({
    url: `${REQUEST_DOMAIN}/role`,
    method: 'DELETE',
    data
  })
    .then(resp => {
      if (isApiResponseOk(resp)) {
        return resp
      }
      return Promise.reject(resp)
    })
    .catch(err => Promise.reject(err))
}
//复制角色
export async function copyRole(data) {
  return request({
    url: `${REQUEST_DOMAIN}/role/copy`,
    method: 'PUT',
    data
  })
    .then(resp => {
      if (isApiResponseOk(resp)) {
        return resp
      }
      return Promise.reject(resp)
    })
    .catch(err => Promise.reject(err))
}
//创建角色
export async function setDefaultRole(data) {
  return request({
    url: `${REQUEST_DOMAIN}/role/default`,
    method: 'PUT',
    data: {
      ...data,
      _organization_id: localStorage.getItem('OrganizationId')
    }
  })
    .then(resp => {
      if (isApiResponseOk(resp)) {
        return resp
      }
      return Promise.reject(resp)
    })
    .catch(err => Promise.reject(err))
}

//获取权限列表
export async function getPermissions(params) {
  return request({
    url: `${REQUEST_DOMAIN}/permissions`,
    method: 'GET',
    params: {
      ...params,
      _organization_id: localStorage.getItem('OrganizationId')
    }
  })
}
//保存权限
export async function savePermission(data) {
  return request({
    url: `${REQUEST_DOMAIN}/permissions`,
    method: 'POST',
    data
  })
}

//获取名词列表
export async function getNounList(params) {
  return request({
    url: `${REQUEST_DOMAIN}/organization/noun`,
    method: 'GET',
    params: {
      ...params,
      _organization_id: localStorage.getItem('OrganizationId')
    }
  })
}
//保存名词列表
export async function saveNounList(data) {
  return request({
    url: `${REQUEST_DOMAIN}/organization/noun`,
    method: 'POST',
    data: {
      ...data,
      _organization_id: localStorage.getItem('OrganizationId')
    }
  })
}

//获取当前名词定义方案
export async function getCurrentNounPlan(params) {
  return request({
    url: `${REQUEST_DOMAIN}/organization/current_noun`,
    method: 'GET',
    params: {
      ...params,
      _organization_id: localStorage.getItem('OrganizationId')
    }
  })
}

//获取功能管理列表
export async function getFnManagementList(params) {
  const _organization_id =
    localStorage.getItem('OrganizationId') === '0'
      ? localStorage.getItem('OrganizationId')
      : !params
      ? params.organization_id
      : localStorage.getItem('OrganizationId')

  return request({
    url: `${REQUEST_DOMAIN}/organization_app`,
    method: 'GET',
    params: {
      ...params,
      // _organization_id: localStorage.getItem('OrganizationId'),
      _organization_id: _organization_id
    }
  })
}

//修改功能管理状态
export async function setFnManagementStatus(data) {
  return request({
    url: `${REQUEST_DOMAIN}/organization_app/set`,
    method: 'PUT',
    data
  })
}

//投资地图权限功能-新增管理员
export async function investmentMapAddAdministrators(data) {
  return request({
    url: `${REQUEST_DOMAIN}/organization_app/map_admin`,
    method: 'POST',
    data: {
      ...data
    }
  })
}

//投资地图权限功能-删除管理员
export async function investmentMapDeleteAdministrators(data) {
  return request({
    url: `${REQUEST_DOMAIN}/organization_app/map_admin`,
    method: 'DELETE',
    data
  })
}

//投资地图权限功能-查看管理员列表
export async function investmentMapQueryAdministrators(params) {
  return request({
    url: `${REQUEST_DOMAIN}/organization_app/map_admin`,
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function getPayingStatus(params) {
  return request({
    url: `${REQUEST_DOMAIN}/organization/paying_status`,
    method: 'GET',
    params: {
      ...params
    }
  })
}

export async function getOrderList(params) {
  return request({
    url: `${REQUEST_DOMAIN}/organization/${params.orgId}/order/list`,
    method: 'GET'
  })
}

// 获取模板列表
export async function getTemplateList(params) {
  return request({
    url: `${REQUEST_DOMAIN}/org/template/list`,
    method: 'GET',
    params: {
      ...params,
      _organization_id:
        params._organization_id || localStorage.getItem('OrganizationId')
    }
  })
}

// 获取模板引用次数
export async function getTempleteQuoteCount(params) {
  return request({
    url: `${REQUEST_DOMAIN}/org/template`,
    method: 'GET',
    params
  })
}

// 获取模板列表内容
export async function getTemplateListContainer(params) {
  return request({
    url: `${REQUEST_DOMAIN}/org/template/content`,
    method: 'GET',
    params
  })
}

// 创建模板
export async function createTemplete(data) {
  return request({
    url: `${REQUEST_DOMAIN}/org/template`,
    method: 'POST',
    data: {
      ...data,
      _organization_id:
        data._organization_id || localStorage.getItem('OrganizationId')
    }
  })
}

// 更新模板
export async function updateTemplete(data) {
  return request({
    url: `${REQUEST_DOMAIN}/org/template`,
    method: 'PUT',
    data
  })
}

// 删除模板
export async function deleteTemplete(params) {
  return request({
    url: `${REQUEST_DOMAIN}/org/template`,
    method: 'DELETE',
    params
  })
}

// 创建模板内容
export async function createTempleteContainer(data) {
  return request({
    url: `${REQUEST_DOMAIN}/org/template/content`,
    method: 'POST',
    data
  })
}

// 更新模板内容
export async function updateTempleteContainer(data) {
  return request({
    url: `${REQUEST_DOMAIN}/org/template/content`,
    method: 'PUT',
    data
  })
}

// 删除模板内容
export async function deleteTempleteContainer(params) {
  return request({
    url: `${REQUEST_DOMAIN}/org/template/content`,
    method: 'DELETE',
    params
  })
}

// 自有模板内容排序
export async function sortTempleteContainer(data) {
  return request({
    url: `${REQUEST_DOMAIN}/org/template/sort`,
    method: 'POST',
    data
  })
}

// ------------------------ 自定义字段接口 S --------------------------

/** 获取自定义字段列表
 * @param {{?_organization_id: string}} params 参数需要传组织id
 *
 */
export async function getCustomFieldList(params = {}) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}/board/field/group/list`,
    method: 'GET',
    params: {
      ...params,
      _organization_id: params._organization_id
        ? params._organization_id
        : localStorage.getItem('OrganizationId')
    }
  })
}

/**
 * 创建自定义字段分组
 * @param {String} name 分组名称
 */
export async function createCustomFieldGroup(data) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}/board/field/group`,
    method: 'POST',
    data: {
      ...data,
      _organization_id: localStorage.getItem('OrganizationId')
    }
  })
}

/**
 * 更新自定义字段分组
 * @param {String} id 分组ID
 * @param {String} name 分组名称
 */
export async function updateCustomFieldGroup(data) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}/board/field/group`,
    method: 'PUT',
    data
  })
}

/**
 * 删除自定义字段分组
 * @param {String} id 分组ID
 */
export async function deleteCustomFieldGroup(params) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}/board/field/group`,
    method: 'DELETE',
    params
  })
}

// 创建自定义字段
export async function createCustomField(data) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}/board/field`,
    method: 'POST',
    data: {
      ...data,
      _organization_id: localStorage.getItem('OrganizationId')
    }
  })
}

// 更新自定义字段
export async function updateCustomField(data) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}/board/field`,
    method: 'PUT',
    data: {
      ...data
      // _organization_id: localStorage.getItem('OrganizationId')
    }
  })
}

// 删除自定义字段
export async function deleteCustomField(params) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}/board/field`,
    method: 'DELETE',
    params
  })
}

// 停用自定义字段
export async function discountCustomField(data) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}/board/field/set`,
    method: 'PUT',
    data
  })
}

// 获取字段引用列表
export async function getCustomFieldQuoteList(params) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}/board/field/quote/list`,
    method: 'get',
    params: {
      ...params,
      _organization_id: localStorage.getItem('OrganizationId')
    }
  })
}

// 创建关联字段接口
export async function createRelationCustomField(data) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}/board/field/relation`,
    method: 'POST',
    data
  })
}

// 设置自定义字段关联值
export async function setRelationCustomField(data) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}/board/field/relation`,
    method: 'PUT',
    data
  })
}

// 删除自定义关联
export async function deleteRelationCustomField(params) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}/board/field/relation`,
    method: 'DELETE',
    params
  })
}

/** 日历获取模板列表
 * @param {{ids: string}} params 需要传入每个项目中的模板id
 */

export async function calendarGetTemplateList(params) {
  return request({
    url: `${REQUEST_DOMAIN}/org/template/list/detail`,
    method: 'GET',
    params
  })
}

/** 获取角色分组列表 */
export const OrgRoleGroupList = params => {
  return request({
    url: `${REQUEST_DOMAIN}/org/role/group/list`,
    method: 'GET',
    params
  })
    .then(resp => {
      if (isApiResponseOk(resp)) {
        return resp
      }
      return Promise.reject(resp)
    })
    .catch(err => Promise.reject(err))
}

/** 新增组织角色分组
 * @param {{org_id:string, name: string}} data 添加分组的信息
 * @returns {Promise<{data: {role_group_name: string, id: string}}>}
 */
export const OrgAddRoleGroup = data => {
  return request({
    url: `${REQUEST_DOMAIN}/org/role/group`,
    method: 'POST',
    data
  })
    .then(resp => {
      if (isApiResponseOk(resp)) {
        return resp
      }
      return Promise.reject(resp)
    })
    .catch(err => Promise.reject(err))
}

/** 修改组织角色分组
 * @param {{id: string, name: string}} data 组织角色详情
 */
export const OrgPutRoleGroup = data => {
  return request({
    url: `${REQUEST_DOMAIN}/org/role/group`,
    method: 'PUT',
    data
  })
    .then(resp => {
      if (isApiResponseOk(resp)) {
        return resp
      }
      return Promise.reject(resp)
    })
    .catch(err => Promise.reject(err))
}

/** 删除组织角色分组
 * @param {{id: string}} data 需要删除的分组信息
 */
export const OrgRoleRemoveGroup = data => {
  return request({
    url: `${REQUEST_DOMAIN}/org/role/group?group_id=${data.group_id}`,
    method: 'DELETE',
    data
  })
    .then(resp => {
      if (isApiResponseOk(resp)) {
        return resp
      }
      return Promise.reject(resp)
    })
    .catch(err => Promise.reject(err))
}

/** 添加组织角色 */
export const OrgRoleAdd = data => {
  return request({
    url: `${REQUEST_DOMAIN}/org/member/role`,
    method: 'POST',
    data
  })
    .then(resp => {
      if (isApiResponseOk(resp)) {
        return resp
      }
      return Promise.reject(resp)
    })
    .catch(err => Promise.reject(err))
}
/** 删除组织角色
 * @param {{id: string, org_id: string}} data 需要删除的分组信息
 */
export const OrgRoleRemove = data => {
  return request({
    url: `${REQUEST_DOMAIN}/org/member/role?org_id=${data.org_id}&role_id=${data.id}`,
    method: 'DELETE',
    data
  })
    .then(resp => {
      if (isApiResponseOk(resp)) {
        return resp
      }
      return Promise.reject(resp)
    })
    .catch(err => Promise.reject(err))
}
/** 修改组织角色
 * @param {{id: string, name: string}} data 组织角色详情
 */
export const OrgPutRole = data => {
  return request({
    url: `${REQUEST_DOMAIN}/org/member/role`,
    method: 'PUT',
    data
  })
    .then(resp => {
      if (isApiResponseOk(resp)) {
        return resp
      }
      return Promise.reject(resp)
    })
    .catch(err => Promise.reject(err))
}

// ------------------------ 自定义字段接口 E --------------------------
