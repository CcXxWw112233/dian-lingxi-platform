import request from "../../utils/requestAxios";
import {REQUEST_DOMAIN_BOARD} from "../../globalset/js/constant";

//获取项目列表
export async function getProjectList(params) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board`,
    method: 'GET',
    params
  });
}
//获取app标
export async function getAppsList(params) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/app`,
    method: 'GET',
    params
  });
}

//新增项目
export async function addNewProject(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board`,
    method: 'POST',
    data
  });
}

//更新项目
export async function updateProject(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board`,
    method: 'PUT',
    data
  });
}

//删除项目
export async function deleteProject(id) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/${id}`,
    method: 'DELETE',
  });
}

//项目归档
export async function archivedProject(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/archived`,
    method: 'PUT',
    data
  });
}

//取消收藏
export async function cancelCollection(id) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/cancel/${id}`,
    method: 'DELETE',
    data: {
      id
    }
  });
}

//项目详情
export async function projectDetail(id) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/detail/${id}`,
    method: 'POST',
    data:{
      id
    }
  });
}

//添加项目组成员
export async function addMenbersInProject(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/members/add`,
    method: 'POST',
    data
  });
}

// 退出项目
export async function quitProject(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/quit`,
    method: 'DELETE',
    data,
  });
}

// 收藏项目
export async function collectionProject(id) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/star/${id}`,
    method: 'POST',
    data: {
      id
    }
  },{ isNotLoading: true });
}

// 添加项目app
export async function addProjectApp(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/app/add`,
    method: 'POST',
    data
  });
}
