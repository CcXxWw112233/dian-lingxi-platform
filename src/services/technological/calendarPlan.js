import { REQUEST_DOMAIN_BOARD } from '../../globalset/js/constant'
import { isApiResponseOk } from '../../utils/handleResponseData'
import request from '../../utils/requestAxios'

/**
 * 获取日历安排的查询列表
 * @param {{board_ids: string}} params 传入所选的项目列表，逗号分割，如果选择了所有项目，传全部项目id
 */
export const getCalendarQueryParam = async params => {
  const res = await request({
    url: `${REQUEST_DOMAIN_BOARD}/board/calendar/query_condition`,
    method: 'GET',
    params
  })
  if (isApiResponseOk(res)) {
    return res
  }
  return Promise.reject(res)
}

/**
 * 获取日历数据
 * @param {{board_ids: string[],  year: string | number, month: ?string | number,template_content_ids: ?string[] ,name: ?string, items: ?object }} data 查询条件
 * @params board_ids 选择的项目列表
 * @params year 年份
 * @params month 月份
 * @params template_content_ids 选中的模板列表
 * @params name 查询的名称
 * @params items 头部查询的条件 map对象 例：{[id]: [查询条件1, 查询条件2]}
 * @returns {Promise}
 */
export const fetchCalendarData = async data => {
  const res = await request({
    url: `${REQUEST_DOMAIN_BOARD}/board/calendar/list`,
    method: 'POST',
    data
  })
  if (isApiResponseOk(res)) {
    return res
  }
  return Promise.reject(res)
}
