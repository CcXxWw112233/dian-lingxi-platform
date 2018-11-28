import request from '../../utils/requestAxios'
import {REQUEST_DOMAIN_BOARD, REQUEST_DOMAIN_WORK_BENCH, REQUEST_DOMAIN_ARTICLE, WE_APP_ID} from '../../globalset/js/constant'
import Cookies from 'js-cookie'

//我负责的任务
export async function getResponsibleTaskList(params) {
  return request({
    url: `${REQUEST_DOMAIN_WORK_BENCH}/card/responsible`,
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
    url: `${REQUEST_DOMAIN_WORK_BENCH}/file/uploading`,
    method: 'GET',
  });
}
//待我处理的流程
export async function getBackLogProcessList(params) {
  return request({
    url: `${REQUEST_DOMAIN_WORK_BENCH}/flow/backlog`,
    method: 'GET',
  });
}
//我参与的流程
export async function getJoinedProcessList(params) {
  return request({
    url: `${REQUEST_DOMAIN_WORK_BENCH}/flow/participation`,
    method: 'GET',
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
  }, {isNotLoading: false});
}
//获取文章内容
export async function getArticleDetail(params) {
  return request({
    url: `${REQUEST_DOMAIN_ARTICLE}/article/${params.id}`,
    method: 'GET',
    params,
    headers: {
      appid: WE_APP_ID(params['appType']),
    }
  });
}
//更新阅读量
export async function updateViewCounter(data) {
  return request({
    url: `${REQUEST_DOMAIN_ARTICLE}/viewcounter`,
    method: 'PUT',
    data,
    headers: {
      appid: WE_APP_ID(data['appType']),
    },
    data,
  });
}





