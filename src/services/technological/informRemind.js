// 通知提醒的请求接口
import request from '@/utils/requestAxios'
import { REQUEST_DOMAIN_ABOUT_PROJECT } from '@/globalset/js/constant'

/**
 * 获取事件列表
 * @param {String} rela_type 获取事件列表的类型 1: 任务 2: 日程 3: 节点 4: 文件
 */
export async function getTriggerList(rela_type) {
    return request({
        url: `${REQUEST_DOMAIN_ABOUT_PROJECT}/remind/trigger/list/${rela_type}`,
        method: "GET",
    })
}

/**
 * 获取事件的消息列表(是否存在历史记录)
 * @param {String} id 获取的是哪一个类型下的消息的ID
 */
export async function getTriggerHistory(id) {
    return request({
        url: `${REQUEST_DOMAIN_ABOUT_PROJECT}/remind/list/${id}`,
        method: "GET",
    })
}

/**
 * 设置提醒的接口
 * @param {Object} data 获取的字段信息
 */
export async function setRemindInformation(data) {
    return request({
        url: `${REQUEST_DOMAIN_ABOUT_PROJECT}/remind`,
        method: "POST",
        data,
    })
}