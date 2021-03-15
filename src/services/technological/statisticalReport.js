// 统计报表相关接口
import request from '../../utils/requestAxios'
import {
  REQUEST_DOMAIN_WORK_BENCH,
  REQUEST_DOMAIN,
  REQUEST_DOMAIN_ARTICLE,
  REQUEST_DOMAIN_BOARD,
  REQUEST_INTERGFACE_VERSIONN
} from '../../globalset/js/constant'

// 工时统计
export function getReportCardWorktime() {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/report/card/worktime`,
    method: 'GET'
  })
}

// 任务数统计
export function getReportCardNumber() {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/report/card/number`,
    method: 'GET'
  })
}

// 项目状态
export function getReportBoardStatus(params) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/report/board/status`,
    method: 'GET',
    params: {
      ...params,
      _organization_id: localStorage.getItem('OrganizationId')
    }
  })
}

// 新增项目数
export function getReportBoardGrowth() {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/report/board/growth`,
    method: 'GET'
  })
}

// 获取项目预警状态等统计图表
export function getReportBoardWarnStatus(params) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/report/board/progress?board_id=${params.board_id}`,
    method: 'GET'
    // params
  })
}

// 获取进度统计二维码
export function getReportBoardCode(data) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/report/board/progress/qrcode?board_id=${data.board_id}`,
    method: 'POST',
    data: data
  })
}

// 获取漏斗图
export function getReportBoardFunnel(params) {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/report/board/milestone/funnel?board_ids=${params.board_ids}`,
    method: 'GET'
    // params
  })
}

/**
 * 获取项目统计数据
 */
export const getBoardStatistical = data => {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/report/board/statistic`,
    method: 'GET',
    params: data
  })
}

/**
 * 获取任务统计数据
 */
export const getTaskStatistical = data => {
  return request({
    url: `${REQUEST_DOMAIN_BOARD}/report/card/statistic`,
    method: 'GET',
    params: data
  })
}

/**
 * 生成报表二维码
 */
export const getChartQrcode = data => {
  return request({
    method: 'POST',
    url: `${REQUEST_DOMAIN_BOARD}/report/qrcode`,
    data
  })
}
