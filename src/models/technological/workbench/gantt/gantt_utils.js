import { setGantTimeSpan } from '../../../../routes/Technological/components/Gantt/ganttBusiness'
import { getDigit, transformTimestamp, isSamDay} from '../../../../utils/util'
import { task_item_height, ceil_height } from '../../../../routes/Technological/components/Gantt/constants';
import { getDateInfo } from "../../../../routes/Technological/components/Gantt/getDate";
function getLeafCountTree(data = {}) {
    if (!data.children) return 1
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

// 统一更新计算left width
export function formatItem(data, {ceilWidth, date_arr_one_level, gantt_view_mode, }){
  if(data && data.length){
    return data.map((item, key) => {
      let new_item = {}
      const { tree_type, children = [], child_card_status = {} } = item //  里程碑/任务/子任务/虚拟占位 1/2/3/4
      const cal_left_field = tree_type == '1' ? 'due_time' : 'start_time' //计算起始位置的字段
      item.top = key * ceil_height
      const due_time = getDigit(item['due_time'])
      const start_time = getDigit(item['start_time']) || due_time //如果没有开始时间，那就取截止时间当天

      let time_span = item['time_span'] || Number(item['plan_time_span'] || 0)
      // time_span = setGantTimeSpan({ time_span, start_time, due_time, start_date, end_date })
      // 获取子任务状态
      child_card_status.has_child = children.length ? '1' : '0'
      child_card_status.min_start_time = Math.min.apply(null, children.map(item => item.start_time)) || ''
      child_card_status.max_due_time = Math.max.apply(null, children.map(item => item.due_time)) || ''
      new_item = {
        ...item,
        start_time,
        end_time: due_time || getDateInfo(start_time).timestampEnd,
        time_span,
        width: time_span * ceilWidth,
        height: task_item_height,
        child_card_status
      }
      let time_belong_area = false
      let date_arr_one_level_length = date_arr_one_level.length
      if (
        (
          tree_type == '1' && (
            getDigit(new_item['due_time']) < getDigit(date_arr_one_level[0]['timestamp']) ||
            getDigit(new_item['due_time']) > getDigit(date_arr_one_level[date_arr_one_level_length - 1]['timestamp'])
          )
        ) || //里程碑只需考虑截止在区间外
        (
          tree_type == '2' && ( //任务在可视区域左右区间外
            (getDigit(new_item['due_time']) < getDigit(date_arr_one_level[0]['timestamp'])) &&
            (getDigit(start_time) < getDigit(date_arr_one_level[0]['timestamp']))
          ) ||
          getDigit(new_item['start_time']) > getDigit(date_arr_one_level[date_arr_one_level_length - 1]['timestamp'])
        )
      ) { //如果该任务的起始日期在当前查看面板日期之前，就从最左边开始摆放
        // new_item.left = -500
        new_item.width = 0
        new_item.left = 0
      } else {
        for (let k = 0; k < date_arr_one_level_length; k++) {
          // if (isSamDay(new_item[cal_left_field], date_arr_one_level[k]['timestamp'])) { //是同一天
          //   const max_width = (date_arr_one_level_length - k) * ceilWidth //剩余最大可放长度
          //   new_item.left = k * ceilWidth
          //   new_item.width = Math.min.apply(Math, [max_width, (time_span || 1) * ceilWidth]) //取最小可放的
          //   time_belong_area = true
          //   break
          // }
          if (gantt_view_mode == 'month') { //月视图下遍历得到和开始时间对的上的日期
            if (isSamDay(new_item[cal_left_field], date_arr_one_level[k]['timestamp'])) { //是同一天
              const max_width = (date_arr_one_level_length - k) * ceilWidth //剩余最大可放长度
              new_item.left = k * ceilWidth
              new_item.width = Math.min.apply(Math, [max_width, (time_span || 1) * ceilWidth]) //取最小可放的
              time_belong_area = true
              break
            }
          } else if (gantt_view_mode == 'year') { //年视图下遍历时间，如果时间戳在某个月的区间内，定位到该位置
            if (new_item[cal_left_field] <= date_arr_one_level[k]['timestampEnd'] && new_item[cal_left_field] >= date_arr_one_level[k]['timestamp']) {
              // 该月之前每个月的天数+这一条的日期 = 所在的位置索引（需要再乘以单位长度才是真实位置）
              const all_date_length = date_arr_one_level.slice().map(item => item.last_date).reduce((total, num) => total + num) //该月之前所有日期长度之和
              const date_length = date_arr_one_level.slice(0, k < 1 ? 1 : k).map(item => item.last_date).reduce((total, num) => total + num) //该月之前所有日期长度之和
              const date_no = new Date(item[cal_left_field]).getDate() //所属该月几号
              const max_width = (all_date_length - date_length - date_no) * ceilWidth //剩余最大可放长度
              new_item.left = (date_length + date_no - 1) * ceilWidth
              new_item.width = Math.min.apply(Math, [max_width, (time_span || 1) * ceilWidth]) //取最小可放的
              time_belong_area = true
              break
            }
          } else if (gantt_view_mode == 'week') {
            if (new_item[cal_left_field] <= date_arr_one_level[k]['timestampEnd'] && new_item[cal_left_field] >= date_arr_one_level[k]['timestamp']) {
              const date_day = new Date(new_item[cal_left_field]).getDay() //周几
              new_item.left = ((k + (date_day == 0 ? 1 : 0)) * 7 + date_day - 1) * ceilWidth
              new_item.width = (time_span || 1) * ceilWidth
              break
            }
          } else {

          }
        }
        // if (!time_belong_area) {//如果在当前视图右期间外
        //   new_item.width = 0
        //   new_item.time_span = 0
        //   new_item.left = 0
        // }
      }
      return new_item
    })
  }
  return [];
}
