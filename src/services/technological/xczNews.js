import request from '@/utils/requestAxios'
import { REQUEST_COMMON } from '@/globalset/js/constant'

// 获取顶部 tabs 的 json 数据
export async function getHeaderTabs(params) {
    return request({
        url: "/json/top.json",
        method: "GET",
        params
    })
}

// 获取热点 tabs 的数据
export async function getHotTabs(params) {
    // console.log(params, '---------------------')
    return request({
        url: `${REQUEST_COMMON}/common/hotspot`,
        method: "GET",
        params,
        headers: {appid:1111}
    })
}

// 获取热点文章的数据
export async function getHotArticles(params) {
    return request({
        url: `${REQUEST_COMMON}/articles/hotspot`,
        method: "GET",
        params,
    })
}