import request from '../../utils/requestAxios'
import {REQUEST_DOMAIN_BOARD, REQUEST_DOMAIN_WORK_BENCH} from '../../globalset/js/constant'
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





