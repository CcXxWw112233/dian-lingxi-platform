import request from '../../utils/requestAxios'
import {REQUEST_DOMAIN, REQUEST_DOMAIN_BOARD, REQUEST_DOMAIN_WORK_BENCH, REQUEST_DOMAIN_ARTICLE, WE_APP_ID, REQUEST_DOMAIN_FLOWS, REQUEST_DOMAIN_TEAM_SHOW} from '../../globalset/js/constant'
import Cookies from 'js-cookie'

//获取工作台甘特图数据
export async function getGanttData(params) {
  return request({
    url: `${REQUEST_DOMAIN_WORK_BENCH}/gantt`,
    method: 'GET',
    params
  })
}

//获取节假日
export async function getHoliday(params) {
  return request({
    url: `${REQUEST_DOMAIN_WORK_BENCH}/gantt/calendar/holiday`,
    method: 'GET',
    params
  })
}







