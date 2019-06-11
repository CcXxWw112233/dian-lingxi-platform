import request from '../../utils/requestAxios'

// 获取顶部 tabs 的 json 数据
export async function getHeaderTabs(params) {
    return request({
        url: "/json/top.json",
        method: "GET",
        params
    })
}