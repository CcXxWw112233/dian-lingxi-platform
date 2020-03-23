import {REQUEST_DOMAIN_FLOWS, CONTENT_DATA_TYPE_FLOW, REQUEST_INTERGFACE_VERSIONN} from "../../globalset/js/constant";
import request from "../../utils/requestAxios";

const createHeaderContentDataByFlowInstantId = (flowInstantId) => {
  if (flowInstantId) {
    return {
      BaseInfo: {
        contentDataType: CONTENT_DATA_TYPE_FLOW,
        contentDataId: flowInstantId
      }
    }
  } else {
    return {}
  }
}

/**
 * 获取流程模板列表
 * @param {String} board_id 项目ID 
 * @param {String} id 项目ID 
 */
export async function getProcessTemplateList(params) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}${REQUEST_INTERGFACE_VERSIONN}/template/list`,
    method: 'GET',
    params,
  });
}

/**
 * 新建流程模板 （保存流程模板）
 * @param {String} board_id 项目ID
 * @param {String} description 描述内容
 * @param {String} is_retain 是否是直接启动(即是否保留) 1=保留 0=不保留(默认)
 * @param {String} name 流程名称
 * @param {Array} nodes 每一个节点的内容 ===> 转成JSON格式
 */
export async function saveProcessTemplate(data) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}${REQUEST_INTERGFACE_VERSIONN}/template`,
    method: 'POST',
    data
  })
}

/**
 * 1241936924281802752
 * 获取模板信息
 * @param {String} id 当前保存模板的ID
 */
export async function getTemplateInfo(params) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}${REQUEST_INTERGFACE_VERSIONN}/template`,
    method: 'GET',
    params
  })
}

/**
 * 删除流程模板
 * @param {String} id 模板ID
 */
export async function deleteProcessTemplete(params) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}${REQUEST_INTERGFACE_VERSIONN}/template`,
    method: 'DELETE',
    params
  })
}