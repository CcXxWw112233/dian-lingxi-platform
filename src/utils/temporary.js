// 临时的方法

import { currentNounPlanFilterName } from "./businessFunction"
import { PROJECTS } from "../globalset/js/constant"

// 针对会协宝软件推广
// 关闭某些功能的条件
const close_board_ids = ['1280036778618785792', '1269516414180528128', '1280055420479737856']
const noun_name = [{ target: '项目', to: `${currentNounPlanFilterName(PROJECTS)}` }]
export const isForHuiXB = ({ board_id }) => {
    if (close_board_ids.includes(board_id)) {
        return true
    }
    return false
}

// 后台返回的功能盒子的方法
export const changeBoxFeatureName = ({ board_id, noun }) => {
    let new_noun = noun
    const obj = noun_name.find(item => noun.indexOf(item.target) != -1) || {}
    const { target, to } = obj
    new_noun = new_noun.replace(target, to)
    return new_noun
}
// 关闭功能的条件
export const closeFeature = ({ board_id }) => {
    if (isForHuiXB({ board_id })) {
        return true
    }
    return false
}