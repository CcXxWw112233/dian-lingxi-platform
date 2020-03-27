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

// ----------------------- 流程模板接口 -------------------------

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
 * @param {Array} nodes 每一个节点的内容 ===> processEditDatas
 */
export async function saveProcessTemplate(data) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}${REQUEST_INTERGFACE_VERSIONN}/template`,
    method: 'POST',
    data
  })
}

/**
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
 * 保存编辑时流程模板信息
 * @param {String} board_id 项目ID
 * @param {String} description 描述内容
 * @param {String} is_retain 是否是直接启动(即是否保留) 1=保留 0=不保留(默认)
 * @param {String} name 流程名称
 * @param {Array} nodes 每一个节点的内容 ===> processEditDatas
 * @param {String} template_no 模板编号
 */
export async function saveEditProcessTemplete(data) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}${REQUEST_INTERGFACE_VERSIONN}/template`,
    method: 'PUT',
    data
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

// ---------------- 流程实例接口 -------------------------

/**
 * 开始流程
 * @param {String} board_id 项目ID
 * @param {String} description 描述内容
 * @param {String} name 流程名称
 * @param {Array} nodes 每一个节点的内容 ===> processEditDatas
 * @param {String} flow_template_id 流程模板ID
 * @param {String} plan_start_time 时间戳 延时启动的时间值
 * @param {String} start_up_type 1=立即开始 2=预约开始时间 不传默认为立即开始
 */
export async function createProcess(data) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}${REQUEST_INTERGFACE_VERSIONN}/workflow`,
    method: 'POST',
    data
  })
}

/**
 * 获取流程实例信息
 * @param {String} id 流程实例ID
 */
export async function getProcessInfo(params) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}${REQUEST_INTERGFACE_VERSIONN}/workflow`,
    method: 'GET',
    params
  })
}

/**
 * 获取流程实例列表
 * @param {String} board_id 当前项目ID
 * @param {String} status 0=未开始, 1=进行中, 2=已中止, 3=已结束(完成)
 */
export async function getProcessListByType(params) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}${REQUEST_INTERGFACE_VERSIONN}/workflow/instances`,
    method: 'GET',
    params
  })
}

// --------------- 流程实例中节点完成交互 ----------------------

/**
 * 完成流程任务
 * @param {String} flow_instance_id 当前流程的ID 
 * @param {String} flow_node_instance_id 当前流程节点的ID 
 * @param {String} message 审批意见
 * @param {Array} form_values 提交表单的数据
 */
export async function fillFormComplete(data) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}${REQUEST_INTERGFACE_VERSIONN}/flow/task/complete`,
    method: 'PUT',
    data,
    headers: createHeaderContentDataByFlowInstantId(data.flow_instance_id),
  })
}

/**
 * 驳回
 * @param {String} flow_instance_id 当前流程的ID 
 * @param {String} flow_node_instance_id 当前流程节点的ID 
 * @param {String} message 驳回意见
 */
export async function rejectProcessTask(data) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}${REQUEST_INTERGFACE_VERSIONN}/flow/task/reject`,
    method: 'PUT',
    data,
    headers: createHeaderContentDataByFlowInstantId(data.flow_instance_id),
  })
}

/**
 * 中止流程
 * @param {String} id 对应的流程实例ID
 */
export async function workflowEnd(params) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}${REQUEST_INTERGFACE_VERSIONN}/workflow/end`,
    method: 'GET',
    params,
    headers: createHeaderContentDataByFlowInstantId(params.id)
  })
}

/**
 * 删除流程
 * @param {String} id 当前流程实例的ID
 */
export async function workflowDelete(params) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}${REQUEST_INTERGFACE_VERSIONN}/workflow`,
    method: 'DELETE',
    params,
    headers: createHeaderContentDataByFlowInstantId(params.id)
  })
}

/**
 * 重启流程实例
 */
export async function restartProcess(params) {
  return request({
    url: `${REQUEST_DOMAIN_FLOWS}${REQUEST_INTERGFACE_VERSIONN}/workflow/restart`,
    method: 'GET',
    params,
    headers: createHeaderContentDataByFlowInstantId(params.id)
  })
}