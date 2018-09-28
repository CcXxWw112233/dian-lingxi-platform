//文件列表包括文件夹
import {REQUEST_DOMAIN_FLOWS} from "../../globalset/js/constant";
import request from "../../utils/requestAxios";

//获取流程模板列表
export async function getProcessTemplateList(params) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}/template`,
    method: 'GET',
    params,
  });
}
//保存模板
export async function saveProcessTemplate(data) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}/template`,
    method: 'POST',
    data,
  });
}


//根据模板id查询模板信息
export async function getTemplateInfo(id) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}/template/${id}`,
    method: 'GET',
  });
}

//获取流程列表
export async function getProcessList(params) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}/workflow`,
    method: 'GET',
    params,
  });
}

//创建流程
export async function createProcess(data) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}/workflow`,
    method: 'POST',
    data,
  });
}

//完成流程任务
export async function completeProcessTask(data) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}/workflow`,
    method: 'PUT',
    data,
  });
}
//获取流程信息
export async function getProcessInfo(id) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}/workflow/${id}`,
    method: 'GET',
  });
}

//表单设值并完成这个表单的任务
export async function fillFormComplete(data) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}/workflow/node/form`,
    method: 'POST',
    data,
  });
}
//流程文件上传
export async function processFileUpload(data) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}/workflow/node/upload`,
    method: 'POST',
    data,
  });
}
