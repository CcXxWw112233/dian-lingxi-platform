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

// 获取高层文章的数据
export async function getHighRiseArticles(params) {
    return request({
        url: `${REQUEST_COMMON}/articles/top_leader`,
        method: "GET",
        params,
    })
}

// 获取权威文章的数据
export async function getAuthorityArticles(params) {
    return request({
        url: `${REQUEST_COMMON}/articles/authority`,
        method: "GET",
        params,
    })
}

// 获取资料库的数据
export async function getDataBase(params) {
    return request({
        url: `${REQUEST_COMMON}/articles/store`,
        method: "GET",
        params,
    })
}