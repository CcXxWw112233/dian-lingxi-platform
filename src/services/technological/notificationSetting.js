// 通知设置的接口
import request from '@/utils/requestAxios'
import { REQUEST_DOMAIN, REQUEST_INTERGFACE_VERSIONN } from '@/globalset/js/constant'

// 获取通知设置默认的列表页
export async function getNoticeSettingList(params) {
  return request({
      url: `${REQUEST_DOMAIN}/notice_setting/list`,
      method: "GET",
      params,
  })
}

// 获取通知设置用户的默认列表
export async function getUsersNoticeSettingList(params) {
  return request({
    url: `${REQUEST_DOMAIN}/notice_setting/`,
    method: "GET",
    params
  })
}