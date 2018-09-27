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

//获取流程信息
export async function getProcessDetailInfo(params) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}/file`,
    method: 'GET',
    params,
  });
}
