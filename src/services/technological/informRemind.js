// 通知提醒的请求接口
import request from '@/utils/requestAxios'
import { REQUEST_DOMAIN_ABOUT_PROJECT } from '@/globalset/js/constant'

export async function getTriggerList(rela_type) {
    return request({
        url: `${REQUEST_DOMAIN_ABOUT_PROJECT}/remind/trigger/list/${rela_type}`,
        method: "GET",
    })
}