import request from '../../utils/requestAxios'
import { REQUEST_DOMAIN_BOARD } from '../../globalset/js/constant'
import { isApiResponseOk } from '../../utils/handleResponseData'

/** 获取一级里程碑列表
 * @param {{board_id: string}} data 需要的参数 项目id
 * @returns {Promise}
 */
export const milestoneList = async data => {
  return await request({
    url: `${REQUEST_DOMAIN_BOARD}/milestone/list`,
    method: 'GET',
    params: data
  }).then(res => {
    if (isApiResponseOk(res)) {
      return res
    }
    return Promise.reject(res)
  })
}

/** 获取控制节点列表
 * @param {{board_id:string, items: null | string[]}} data 请求参数 项目id和搜索条件
 */
export const overallControllData = async data => {
  return await request({
    url: `${REQUEST_DOMAIN_BOARD}/board/overall_control/list`,
    method: 'POST',
    data
  }).then(res => {
    if (isApiResponseOk(res)) {
      return res
    }
    return Promise.reject(res)
  })
}
