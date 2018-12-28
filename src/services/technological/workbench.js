import request from '../../utils/requestAxios'
import {REQUEST_DOMAIN,REQUEST_DOMAIN_BOARD, REQUEST_DOMAIN_WORK_BENCH, REQUEST_DOMAIN_ARTICLE, WE_APP_ID} from '../../globalset/js/constant'
import Cookies from 'js-cookie'

//获取项目列表
export async function getProjectList(params) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/list`,
    method: 'GET',
  });
}
//获取项目列表(只返回用户)
export async function getProjectUserList(params) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/user_lists`,
    method: 'GET',
  });
}
export async function getUserImToken(data) {
  return request({
    url: `${REQUEST_DOMAIN}/user/im/token`,
    method: 'GET',
  });
}


//获取项目列表(只返回用户)
export async function getProjectStarList(params) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/board/star/list`,
    method: 'GET',
  });
}

//获取组织成员列表
export async function getOrgMembers(params) {
  return request({
    url: `${REQUEST_DOMAIN}/group`,
    method: 'GET',
  });
}

//获取工作台盒子
export async function getBoxList(params) {
  return request({
    url: `${REQUEST_DOMAIN_WORK_BENCH}/box`,
    method: 'GET',
  });
}
//获取工作台单个盒子设置过滤条件
export async function getItemBoxFilter(data) {
  return request({
    url: `${REQUEST_DOMAIN_WORK_BENCH}/box`,
    method: 'POST',
    data
  });
}
//获取工作台单个盒子设置过滤条件
export async function updateBox(data) {
  return request({
    url: `${REQUEST_DOMAIN_WORK_BENCH}/box`,
    method: 'PUT',
    data
  });
}
//我负责的任务
export async function getResponsibleTaskList(params) {
  return request({
    url: `${REQUEST_DOMAIN_WORK_BENCH}/card/responsible/${params['id']}`,
    method: 'GET',
  });
}
export async function getTodoList(params) {
  return request({
    url: `${REQUEST_DOMAIN_WORK_BENCH}/card/responsible/${params['id']}`,
    method: 'GET',
  });
}

// 完成任务
export async function completeTask(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/card/realize`,
    method: 'PUT',
    data,
  });
}

//我上传的文档
export async function getUploadedFileList(params) {
  return request({
    url: `${REQUEST_DOMAIN_WORK_BENCH}/file/uploading/${params['id']}`,
    method: 'GET',
  });
}
//待我处理的流程
export async function getBackLogProcessList(params) {
  return request({
    url: `${REQUEST_DOMAIN_WORK_BENCH}/flow/backlog/${params['id']}`,
    method: 'GET',
  });
}
//我参与的流程
export async function getJoinedProcessList(params) {
  return request({
    url: `${REQUEST_DOMAIN_WORK_BENCH}/flow/participation/${params['id']}`,
    method: 'GET',
  });
}
//获取会议列表
export async function getMeetingList(params) {
  return request({
    url: `${REQUEST_DOMAIN_WORK_BENCH}/card/meeting_arrangement/${params['id']}`,
    method: 'GET',
  });
}
//获取当前用户可用盒子列表
export async function getBoxUsableList(params) {
  return request({
    url: `${REQUEST_DOMAIN_WORK_BENCH}/box/user/usable/list`,
    method: 'GET',
  });
}
//获取当前用户可用盒子列表
export async function addBox(data) {
  return request({
    url: `${REQUEST_DOMAIN_WORK_BENCH}/box/user/add`,
    method: 'POST',
    data
  });
}
//获取当前用户可用盒子列表
export async function deleteBox(params) {
  return request({
    url: `${REQUEST_DOMAIN_WORK_BENCH}/box/user/${params.box_type_id}`,
    method: 'DELETE',
    params
  });
}


//获取文章列表
export async function getArticleList(params) {
  return request({
    url: `${REQUEST_DOMAIN_ARTICLE}/articles`,
    method: 'GET',
    params,
    headers: {
      appid: WE_APP_ID(params['appType']),
    }
  }, {isNotLoading: true});
}
//获取文章内容
export async function getArticleDetail(params) {
  return request({
    url: `${REQUEST_DOMAIN_ARTICLE}/article/${params.id}`,
    method: 'GET',
    params:{
      ...params,
      openid: '0',
    },
    headers: {
      appid: WE_APP_ID(params['appType']),
    }
  },{isNotLoading: true});
}
//更新阅读量
export async function updateViewCounter(data) {
  return request({
    url: `${REQUEST_DOMAIN_ARTICLE}/viewcounter`,
    method: 'PUT',
    data: {
      ...data,
      openid: '0',
    },
    headers: {
      appid: WE_APP_ID(data['appType']),
    },
  }, {isNotLoading: true});
}





