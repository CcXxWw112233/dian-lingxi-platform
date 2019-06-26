import request from '@/utils/requestAxios'
import { REQUEST_COMMON } from '@/globalset/js/constant'

// 获取热点 tabs 的数据
export async function getHotTabs(params) {
    // console.log(params, '---------------------')
    return request({
        url: `${REQUEST_COMMON}/common/hotspot`,
        method: "GET",
        params,
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

// 获取资料库详情的数据
export async function getDataBaseDetail(params) {
    return request({
        url: `${REQUEST_COMMON}/articles/store/detail`,
        method: "GET",
        params,
    })
}

// 获取地区的数据
export async function getAreas(params) {
    return request({
        url: `${REQUEST_COMMON}/common/areas`,
        method: "GET",
        params,
    })
}

// 顶部的全局搜索
export async function getHeaderSearch(params) {
    return request({
        url: `${REQUEST_COMMON}/articles/more`,
        method: "GET",
        params,
    })
}

// 获取全局文章的列表
export async function getCommonArticlesList(params) {
    return request({
        url: `${REQUEST_COMMON}/articles/more`,
        method: "GET",
        params,
    })
}