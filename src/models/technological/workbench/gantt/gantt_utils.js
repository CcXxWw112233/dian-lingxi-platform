import { setGantTimeSpan } from '../../../../routes/Technological/components/Gantt/ganttBusiness'
import { getDigit, transformTimestamp } from '../../../../utils/util'

function getLeafCountTree(data = {}) {
    if(!data.children) return 1
    if (data.children.length == 0) {
        return 1;
    } else {
        let leafCount = 1;
        for (var i = 0; i < data.children.length; i++) {
            const { parent_expand } = data.children[i]
            if (parent_expand) {
                leafCount = leafCount + getLeafCountTree(data.children[i]);
            } else {

            }
        }
        return leafCount;
    }
}

export function recusionItem(tree, { parent_expand, parent_type, parent_id, parent_milestone_id, parent_card_id, parent_ids = [] }, { start_date, end_date }) {
    return tree.map(item => {
        let new_item = { ...item, parent_expand, }
        let { tree_type, children = [], is_expand, id } = item
        let new_item_children = [...children].filter(item => item.id || (item.add_id && item.editing)) //一般项和正在编辑的输入框占位
        // let child_expand_length = 0 //第一级父节点下所有子孙元素展开的总长
        let added = new_item_children.find(item => item.tree_type == '0') //表示是否已经添加过虚拟节点
        if ((tree_type == '1' || tree_type == '2') && !added) { //是里程碑或者一级任务,并且没有添加过
            // new_item_children.push({ ...visual_add_item, add_id: item.id }) //添加虚拟节点
        }
        // 时间跨度设置
        let due_time = getDigit(item['due_time'])
        let start_time = getDigit(item['start_time']) || due_time //如果没有开始时间，那就取截止时间当天
        // new_item.is_has_start_time = !!getDigit(item['start_time'])
        let is_has_start_time = false
        if (!!getDigit(item['start_time']) && (due_time != start_time)) { //具有开始时间并且开始时间不等于截止时间,因为有可能 开始时间是截止时间赋值的
            is_has_start_time = true
        }
        new_item.is_has_start_time = is_has_start_time
        new_item.is_has_end_time = !!getDigit(item['due_time'])
        let time_span = item['time_span'] || item['plan_time_span']
        new_item.due_time = due_time
        new_item.start_time = start_time
        if (tree_type == '1') { //里程碑的周期（时间跨度）,根据一级任务计算
            let child_time_arr_start = children.map(item => transformTimestamp(item.start_time) || 0).filter(item => item)
            let child_time_arr_due = children.map(item => transformTimestamp(item.due_time) || 0).filter(item => item)
            let child_time_arr = [].concat(child_time_arr_due, child_time_arr_start) ////全部时间的集合， [0]防止math.max 。minw
            time_span = setGantTimeSpan({
                time_span: '0',
                start_time: transformTimestamp(Math.min.apply(null, child_time_arr)) == Infinity ? '' : transformTimestamp(Math.min.apply(null, child_time_arr)),
                due_time: transformTimestamp(due_time) || (transformTimestamp(Math.max.apply(null, child_time_arr)) == -Infinity ? '' : transformTimestamp(Math.max.apply(null, child_time_arr))),
                start_date,
                end_date
            })
        } else { //其它类型就根据开始截至时间计算
            time_span = setGantTimeSpan({ time_span, start_time, due_time, start_date, end_date })
        }
        new_item.time_span = time_span
        new_item.parent_ids = [].concat(parent_ids, [parent_id]).filter(item => !!item)
        new_item.parent_id = parent_id
        new_item.parent_type = parent_type
        if (parent_type == '1') {
            new_item.parent_milestone_id = parent_milestone_id
        } else if (parent_type == '2') {
            new_item.parent_card_id = parent_card_id
        }

        if (new_item_children.length) {
            new_item.children = recusionItem(
                new_item_children,
                {
                    parent_type: tree_type,
                    parent_expand: is_expand,
                    parent_id: id,
                    parent_milestone_id: id,
                    parent_card_id: id,
                    parent_ids: new_item.parent_ids
                }, { start_date, end_date }
            )
        }
        if (tree_type == '1') {
            new_item.expand_length = getLeafCountTree(new_item)
        }
        return new_item
    })

}
