// 临时的方法

// 针对会协宝软件推广
// 关闭某些功能的条件
const close_board_ids = ['1280036778618785792']
const noun_name = [{ target: '项目', to: '会议' }]
export const isForHuiXB = ({ board_id }) => {
    if (close_board_ids.includes(board_id)) {
        return true
    }
    return false
}

export const changeHXBNounName = ({ board_id, noun }) => {
    let new_noun = noun
    if (isForHuiXB({ board_id })) {
        const obj = noun_name.find(item => noun.indexOf(item.target) != -1) || {}
        const { target, to } = obj
        new_noun = new_noun.replace(target, to)
        return new_noun
    }
    return new_noun
}