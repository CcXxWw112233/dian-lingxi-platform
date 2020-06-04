import { getGanttBoardsFiles, getGanttData, getGttMilestoneList, getContentFiterBoardTree, getContentFiterUserTree, getHoliday } from '../../../services/technological/gantt'
import { getProjectList, getProjectUserList } from '../../../services/technological/workbench'
import { isApiResponseOk } from '../../../utils/handleResponseData'
import { message } from 'antd'
import { MESSAGE_DURATION_TIME } from "../../../globalset/js/constant";
import { routerRedux } from "dva/router";
import queryString from 'query-string';
import { getDateInfo } from "../../../routes/Technological/components/Gantt/getDate";
import {
  workbench_projectTabCurrentSelectedProject,
  workbench_start_date,
  workbench_end_date,
  workbench_list_group,
  workbench_group_rows,
  workbench_ceiHeight,
  workbench_ceilWidth,
  workbench_date_arr_one_level
} from './selects'
import { createMilestone } from "../../../services/technological/prjectDetail";
import { getGlobalData } from '../../../utils/businessFunction';
import { task_item_height, ceil_height, ceil_height_fold, ganttIsFold, group_rows_fold, task_item_height_fold, test_card_item, mock_gantt_data, ganttIsOutlineView, mock_outline_tree, ceil_width, ceil_width_year } from '../../../routes/Technological/components/Gantt/constants';
import { getModelSelectDatasState } from '../../utils'
import { getProjectGoupList } from '../../../services/technological/task';
import { handleChangeBoardViewScrollTop, setGantTimeSpan } from '../../../routes/Technological/components/Gantt/ganttBusiness';
import { jsonArrayCompareSort, transformTimestamp, isSamDay } from '../../../utils/util';
import gantt_effect from './gantt_effect'
let dispatches = null
const visual_add_item = {
  "id": "",
  "name": "",
  "tree_type": "0",
  "is_expand": false,
  "parent_expand": true,
  "add_id": 'add_milestone', //0表示创建里程碑，其他地创建add_id归纳到父级id
  "children": [],
  "editing": false,
  "due_time": '',
  "start_time": ''
}
const getDigit = (timestamp) => {
  if (!timestamp) {
    return 0
  }
  let new_timestamp = timestamp.toString()
  if (new_timestamp.length == 10) {
    new_timestamp = Number(new_timestamp) * 1000
  } else {
    new_timestamp = Number(new_timestamp)
  }
  return new_timestamp
}
export default {
  namespace: 'gantt',
  state: {
    datas: {
      ...gantt_effect.state,
      gantt_view_mode: 'month', //week / month /year
      gold_date_arr: [], //所需要的日期数据
      date_arr_one_level: [], //所有日期数据扁平成一级数组
      start_date: {}, //日期最开始的那一天
      end_date: {}, //日期最后那一天
      create_start_time: '', //创建任务开始时间
      create_end_time: '', //创建任务截至时间
      list_group: [], //分组列表
      ceilWidth: ceil_width, //单元格的宽度
      ceiHeight: ceil_height, //单元格高度 40 + 12的外边距
      date_total: 0, //总天数
      group_rows: [2, 2, 2], //每一个分组默认行数 [7, 7, 7]
      group_list_area: [], //分组高度区域 [组一行数 * ceiHeight，组二行数 * ceiHeight]
      group_list_area_section_height: [], //分组高度区域总高度 [组一行数 * ceiHeight，(组一行数 + 组二行数) * ceiHeight， ...]
      isDragging: false, //甘特图是否在拖拽中
      target_scrollLeft: 0, //总体滚动条向左滑动位置
      target_scrollTop: 0, //总体滚动条偏离顶部滑动位置
      target_scrollTop_board_storage: 0, //缓存查看项目视图下，滚动条的位置高度
      current_list_group_id: '0', //当前选中的分组id
      milestoneMap: {},//[], //里程碑列表{time1: [], time2: []}

      about_apps_boards: [], //带app的项目列表
      about_group_boards: [], //带分组的项目列表
      about_user_boards: [], //带用户的项目列表

      gantt_board_id: '0', //"1192342431761305600",//, //甘特图查看的项目id
      gantt_board_list_id: '0', //项目分组的操作id
      group_view_type: '1', //分组视图1项目， 2成员, 4大纲, 5项目分组再分组成成员
      group_view_filter_boards: [], //内容过滤项目id 列表
      group_view_filter_users: [], //内容过滤职员id 列表
      group_view_boards_tree: [], //内容过滤项目分组树
      group_view_users_tree: [], //内容过滤成员分组树
      holiday_list: [], //日历列表（包含节假日农历）
      get_gantt_data_loading: false, //是否在请求甘特图数据状态
      get_gantt_data_loading_other: false, //为其它操作想要阻断页面做loading(应用于难以解决的切换显示延迟)
      get_gantt_data_loaded: false,
      is_show_board_file_area: '0', //显示文件区域 0默认不显示 1滑入 2滑出
      boards_flies: [], //带根目录文件列表的项目列表
      show_board_fold: false, //是否显示项目汇总视图
      folder_seeing_board_id: '0', //查看文件夹所属的项目id

      is_new_board: false, //是否刚刚创建的新项目
      outline_hover_obj: {}, //大纲视图下，hover的任务条所属id
      outline_tree: [], //大纲树
      outline_tree_round: [], //大纲树每一级平铺开来
      panel_outline_create_card_params: {}, //大纲视图下，面板拖拽创建任务通过弹窗创建才需要这个参数
      boardTemplateShow: 0,
      startPlanType: 0,
      // outline_current_oprate_add_id: '', //大纲视图下面板拖拽创建任务所属add_id
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      dispatches = dispatch
      // history.listen((location) => {
      //   if (location.pathname.indexOf('/technological') != -1) {
      //     dispatch({
      //       type: 'updateDatas',
      //       payload: {
      //         list_group: [],
      //         group_rows: [3, 3, 3], // [5, 5, 5]
      //       }
      //     })
      //   } else {
      //   }
      // })
    },
  },
  effects: {
    ...gantt_effect.effects, //其它定义的事件，模块分出去
    * returnContentFilterFinalParams({ payload }, { select, call, put }) { //返回内容过滤输出成的请求参数 { key: value}
      const group_view_filter_boards = yield select(getModelSelectDatasState('gantt', 'group_view_filter_boards'))
      const group_view_filter_users = yield select(getModelSelectDatasState('gantt', 'group_view_filter_users'))
      const group_view_boards_tree = yield select(getModelSelectDatasState('gantt', 'group_view_boards_tree'))
      const group_view_users_tree = yield select(getModelSelectDatasState('gantt', 'group_view_users_tree'))

      //内容过滤处理
      const setContentFilterParams = () => {
        let query_board_ids = []
        let query_user_ids = []

        //  项目id处理
        for (let val of group_view_filter_boards) {
          if (val.indexOf('board_org_') != -1) { //项目组织id
            const org_board_list = group_view_boards_tree.find(item => item.value == val).children
            const org_board_id_list = org_board_list.map(item => item.value.replace('board_', ''))
            query_board_ids = [].concat(query_board_ids, org_board_id_list)
          } else { //项目id
            const board_id = val.replace('board_', '')
            query_board_ids.push(board_id)
          }
        }

        // 用户id处理
        for (let val of group_view_filter_users) {
          if (val.indexOf('user_org_') != -1) { //用户组织id
            // 遍历得到了分组
            const org_groups = group_view_users_tree.find(item => item.value == val).children //得到组织的用户分组
            const org_groups_users = org_groups.map(item => item.children) //得到一个二维数组，组为一维，用户列表为二维
            const org_users = org_groups_users.reduce(function (a, b) { return a.concat(b) }); //该组织下所有分组用户铺开一维数组
            const org_user_ids = org_users.map(item => item.value.replace('user_', '').split('_')[2])
            query_user_ids = [].concat(query_user_ids, org_user_ids)

          } else if (val.indexOf('user_group_') != -1) { //分组id
            const org_groupr_id_arr = val.replace('user_group_', '').split('_')
            const group_org_id = org_groupr_id_arr[0]
            const group_id = org_groupr_id_arr[1]

            const org_groups = group_view_users_tree.find(item => item.value == `user_org_${group_org_id}`).children //得到组织对应分组列表
            const org_users = org_groups.find(item => item.value == `user_group_${group_org_id}_${group_id}`).children //得到对应分组
            const org_user_ids = org_users.map(item => item.value.replace('user_', '').split('_')[2])
            query_user_ids = [].concat(query_user_ids, org_user_ids)

          } else {//用户id
            // const user_id = val.replace('user_','')
            const user_id = val.replace('user_', '').split('_')[2]
            query_user_ids.push(user_id)
          }
        }
        // 去重
        query_board_ids = Array.from(new Set(query_board_ids))
        query_user_ids = Array.from(new Set(query_user_ids))
        return {
          query_board_ids,
          query_user_ids,
        }
      }
      return {
        ...setContentFilterParams()
      }
    },
    * getGanttData({ payload }, { select, call, put }) {
      const { not_set_loading } = payload //not_set_loading是否需要设置loading状态
      // 参数处理
      const start_date = yield select(workbench_start_date)
      const end_date = yield select(workbench_end_date)
      const group_view_type = yield select(getModelSelectDatasState('gantt', 'group_view_type'))
      const gantt_board_id = yield select(getModelSelectDatasState('gantt', 'gantt_board_id'))
      const gantt_board_list_id = yield select(getModelSelectDatasState('gantt', 'gantt_board_list_id'))
      //内容过滤处理
      const Aa = yield put({
        type: 'returnContentFilterFinalParams',
      })
      const get_content_filter_params = () => new Promise(resolve => {
        resolve(Aa.then())
      })
      // 内容过滤处理end
      const content_filter_params = yield call(get_content_filter_params) || {}
      // console.log('ssssssssss', {
      //   group_view_filter_boards,
      //   group_view_filter_users,
      //   ...setContentFilterParams()
      // })

      let params = {
        chart_type: group_view_type
      }
      if (!ganttIsOutlineView({ group_view_type })) {
        params = {
          start_time: start_date['timestamp'],
          end_time: end_date['timestamp'],
          chart_type: group_view_type,//group_view_type,
          ...content_filter_params,
        }
      }

      if (gantt_board_id != '0' && gantt_board_id) {
        params.board_id = gantt_board_id
        if (group_view_type == '5') { //分组点击
          params.list_id = gantt_board_list_id
        }
      }

      const timer = setTimeout(() => {
        dispatches({
          type: 'updateDatas',
          payload: {
            get_gantt_data_loading: not_set_loading ? false : true,
          }
        })
      }, 2000)
      yield put({
        type: 'updateDatas',
        payload: {
          get_gantt_data_loaded: false,
        }
      })
      // 查询文件列表
      yield put({
        type: 'getGanttBoardsFiles',
        payload: {
          query_board_ids: content_filter_params.query_board_ids,
          board_id: gantt_board_id == '0' ? '' : gantt_board_id
        }
      })
      yield put({
        type: 'getGttMilestoneList',
        payload: {
        }
      })
      yield put({
        type: 'getCardRelys',
        payload: {
        }
      })

      const res = yield call(getGanttData, params)
      clearTimeout(timer)
      yield put({
        type: 'updateDatas',
        payload: {
          get_gantt_data_loading: false,
          get_gantt_data_loaded: true,
          folder_seeing_board_id: '0'
        }
      })
      // console.log('sssss', {res})
      if (isApiResponseOk(res)) {
        let data = res.data
        if (!ganttIsOutlineView({ group_view_type })) { //非大纲视图
          yield put({
            type: 'handleListGroup',
            payload: {
              data: data//res.data
            }
          })
          yield put({
            type: 'updateDatas',
            payload: {
              outline_tree: [],
              outline_tree_round: []
            }
          })
        } else {
          yield put({
            type: 'handleOutLineTreeData',
            payload: {
              data: res.data
            }
          })
        }

      } else {

      }
    },
    // 转化处理大纲视图数据
    * handleOutLineTreeData({ payload }, { select, call, put }) {
      const { data = [] } = payload
      console.log("handleOutLineTreeData", data);
      const start_date = yield select(workbench_start_date)
      const end_date = yield select(workbench_end_date)
      const ceilWidth = yield select(workbench_ceilWidth)
      const date_arr_one_level = yield select(workbench_date_arr_one_level)
      const gantt_view_mode = yield select(getModelSelectDatasState('gantt', 'gantt_view_mode'))

      let new_outline_tree = [...data]
      const tree_arr_1 = data.filter(item => item.tree_type == '1')//.sort(jsonArrayCompareSort('due_time', transformTimestamp)) //里程碑截止时间由近及远
      const tree_arr_2 = data.filter(item => item.tree_type != '1')//.sort(jsonArrayCompareSort('start_time', transformTimestamp))
      new_outline_tree = [].concat(tree_arr_1, tree_arr_2)//先把里程碑排进去，再排没有归属的任务

      const filnaly_outline_tree = new_outline_tree.map(item => {
        let new_item = { ...item, parent_expand: true }
        const { tree_type, children = [], is_expand } = item
        let new_item_children = [...item.children].filter(item => item.id || (item.add_id && item.editing)) //一般项和正在编辑的输入框占位
        let child_expand_length = 0 //第一级父节点下所有子孙元素展开的总长
        const added = new_item_children.find(item => item.tree_type == '0') //表示是否已经添加过虚拟节点
        if ((tree_type == '1' || tree_type == '2') && !added) { //是里程碑或者一级任务,并且没有添加过
          // new_item_children.push({ ...visual_add_item, add_id: item.id }) //添加虚拟节点
        }

        // 时间跨度设置
        const due_time = getDigit(item['due_time'])
        const start_time = getDigit(item['start_time']) || due_time //如果没有开始时间，那就取截止时间当天
        // new_item.is_has_start_time = !!getDigit(item['start_time'])
        let is_has_start_time = false
        if (!!getDigit(item['start_time']) && (due_time != start_time)) { //具有开始时间并且开始时间不等于截止时间,因为有可能 开始时间是截止时间赋值的
          is_has_start_time = true
        }
        new_item.is_has_start_time = is_has_start_time
        new_item.is_has_end_time = !!getDigit(item['due_time'])
        let time_span = item['time_span']
        new_item.due_time = due_time
        new_item.start_time = start_time
        time_span = setGantTimeSpan({ time_span, start_time, due_time, start_date, end_date })
        new_item.time_span = time_span

        new_item_children = new_item_children.map(item2 => {
          let new_item2 = { ...item2, parent_expand: is_expand, parent_type: tree_type, parent_id: item.id }
          const tree_type2 = item2.tree_type
          const children2 = (item2.children || []).filter(item => item.id || (item.add_id && item.editing))
          let new_item_children2 = [...children2]
          const is_expand2 = item2.is_expand

          // 时间跨度设置
          const due_time2 = getDigit(item2['due_time'])
          const start_time2 = getDigit(item2['start_time']) || due_time2 //如果没有开始时间，那就取截止时间当天
          // new_item2.is_has_start_time = !!getDigit(item2['start_time'])
          let is_has_start_time2 = false
          if (!!getDigit(item2['start_time']) && (due_time2 != start_time2)) { //具有开始时间并且开始时间不等于截止时间,因为有可能 开始时间是截止时间赋值的
            is_has_start_time2 = true
          }
          new_item2.is_has_start_time = is_has_start_time2
          new_item2.is_has_end_time = !!getDigit(item2['due_time'])
          let time_span2 = item2['time_span']
          new_item2.due_time = due_time2
          new_item2.start_time = start_time2
          time_span2 = setGantTimeSpan({ time_span: time_span2, start_time: start_time2, due_time: due_time2, start_date, end_date })
          new_item2.time_span = time_span2

          if (is_expand) {
            child_expand_length += 1
          }
          const added2 = new_item_children2.find(item => item.tree_type == '0') //表示是否已经添加过虚拟节点
          if ((tree_type2 == '1' || tree_type2 == '2') && !added2) { //是里程碑或者一级任务
            // new_item_children2.push({ ...visual_add_item, add_id: item2.id }) //添加虚拟节点
          }
          if (tree_type == '1') { //父元素是里程碑类型
            new_item2.parent_milestone_id = item.id
          }
          if (tree_type == '1') { //如果第一级是里程碑才有第三级
            new_item_children2 = new_item_children2.map(item3 => {
              let new_item3 = { ...item3, parent_expand: new_item2.parent_expand && new_item2.is_expand, parent_type: tree_type2, parent_id: item2.id }
              if (is_expand && is_expand2) {
                child_expand_length += 1
              }
              // 时间跨度设置
              const due_time3 = getDigit(item3['due_time'])
              const start_time3 = getDigit(item3['start_time']) || due_time3 //如果没有开始时间，那就取截止时间当天
              // new_item3.is_has_start_time = !!getDigit(item3['start_time'])
              let is_has_start_time3 = false
              if (!!getDigit(item3['start_time']) && (due_time3 != start_time3)) { //具有开始时间并且开始时间不等于截止时间,因为有可能 开始时间是截止时间赋值的
                is_has_start_time3 = true
              }
              new_item3.is_has_start_time = is_has_start_time3
              new_item3.is_has_end_time = !!getDigit(item3['due_time'])

              let time_span3 = item3['time_span']
              new_item3.due_time = due_time3
              new_item3.start_time = start_time3
              time_span3 = setGantTimeSpan({ time_span: time_span3, start_time: start_time3, due_time: due_time3, start_date, end_date })
              new_item3.time_span = time_span3
              if (tree_type2 == '2') {
                new_item3.parent_card_id = item2.id
              }
              return new_item3
            })
          } else {
            new_item2.parent_card_id = item.id
            new_item_children2 = undefined
          }
          new_item2.children = new_item_children2
          return new_item2
        })
        new_item.expand_length = child_expand_length + 1 //子孙节点展开的长度加上自身
        new_item.children = new_item_children
        return new_item
      })

      //console.log('filnaly_outline_tree', filnaly_outline_tree)
      yield put({
        type: 'updateDatas',
        payload: {
          outline_tree: filnaly_outline_tree
        }
      })

      // 将数据平铺
      let arr = []
      const recusion = (obj) => { //将树递归平铺成一级
        arr.push(obj)
        if (!obj.children) {
          return
        } else {
          if (obj.children.length) {
            for (let val of obj.children) {
              recusion(val)
            }
          }
        }
      }
      for (let val of filnaly_outline_tree) {
        recusion(val)
      }
      arr = arr.filter(item => item.parent_expand)
      arr.push({ ...visual_add_item }) //默认有个新建里程碑，占位
      arr = arr.map((item, key) => {
        let new_item = {}
        const { tree_type, children = [], child_card_status = {} } = item //  里程碑/任务/子任务/虚拟占位 1/2/3/4
        const cal_left_field = tree_type == '1' ? 'due_time' : 'start_time' //计算起始位置的字段
        item.top = key * ceil_height
        const due_time = getDigit(item['due_time'])
        const start_time = getDigit(item['start_time']) || due_time //如果没有开始时间，那就取截止时间当天

        let time_span = item['time_span']
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
                const date_no = new Date(item['start_time']).getDate() //所属该月几号
                const max_width = (all_date_length - date_length - date_no) * ceilWidth //剩余最大可放长度
                new_item.left = (date_length + date_no - 1) * ceilWidth
                new_item.width = Math.min.apply(Math, [max_width, (time_span || 1) * ceilWidth]) //取最小可放的
                time_belong_area = true
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
      yield put({
        type: 'updateDatas',
        payload: {
          outline_tree_round: arr
        }
      })
      // console.log('filnaly_outline_tree', filnaly_outline_tree)
      // console.log('filnaly_outline_tree2', arr)
      // console.log('filnaly_outline_tree1', filnaly_outline_tree[0].expand_length)
      // console.log('filnaly_outline_tree2', filnaly_outline_tree[1].expand_length)

    },

    * handleListGroup({ payload }, { select, call, put }) {
      const { data, not_set_scroll_top } = payload
      let list_group = []
      const start_date = yield select(workbench_start_date)
      const end_date = yield select(workbench_end_date)
      const group_view_type = yield select(getModelSelectDatasState('gantt', 'group_view_type'))
      const gantt_board_id = yield select(getModelSelectDatasState('gantt', 'gantt_board_id'))
      const show_board_fold = yield select(getModelSelectDatasState('gantt', 'show_board_fold'))

      for (let val of data) {
        const list_group_item = {
          ...val,
          list_name: val['lane_name'],
          list_id: val['lane_id'],
          list_data: [],
          list_no_time_data: val['lane_data']['card_no_times'] || []
        }
        if (val['lane_data']['cards']) {
          for (let val_1 of val['lane_data']['cards']) {
            const due_time = getDigit(val_1['due_time'])
            const start_time = getDigit(val_1['start_time']) || due_time //如果没有开始时间，那就取截止时间当天
            const create_time = getDigit(val_1['create_time'])
            let time_span = val_1['time_span']
            if (!time_span) {
              time_span = (!due_time || !start_time) ? 1 : (Math.floor((due_time - start_time) / (24 * 3600 * 1000))) + 1 //正常区间内
              if (due_time > end_date.timestamp && start_time > start_date.timestamp) { //右区间
                time_span = (Math.floor((end_date.timestamp - start_time) / (24 * 3600 * 1000))) + 1
              } else if (start_time < start_date.timestamp && due_time < end_date.timestamp) { //左区间
                time_span = (Math.floor((due_time - start_date.timestamp) / (24 * 3600 * 1000))) + 1
              } else if (due_time > end_date.timestamp && start_time < start_date.timestamp) { //超过左右区间
                time_span = (Math.floor((end_date.timestamp - start_date.timestamp) / (24 * 3600 * 1000))) + 1
              }
              // console.log('sssssss', val_1.name, time_span)
              // time_span = time_span > date_arr_one_level.length?  date_arr_one_level.length: time_span
            }
            let list_data_item = {
              ...val_1,
              start_time,
              end_time: due_time || getDateInfo(start_time).timestampEnd,
              create_time,
              time_span,
              is_has_start_time: !!getDigit(val_1['start_time']),
              is_has_end_time: !!getDigit(val_1['due_time'])
            }
            list_group_item.list_data.push(list_data_item)
          }
        }
        if (ganttIsFold({ gantt_board_id, group_view_type, show_board_fold })) { //全项目视图下，收缩，取特定某一条做基准，再进行时间汇总
          const start_time_arr = list_group_item.list_data.map(item => item.start_time) //取视窗任务的最开始时间
          const due_time_arr = list_group_item.list_data.map(item => item.end_time) //取视窗任务的最后截止时间
          const { lane_start_time, lane_end_time } = list_group_item

          const due_time = Math.max.call(null, getDigit(lane_end_time), Math.max.apply(null, due_time_arr)) //与后台返回值计算取最大作为结束
          const start_time = Math.min.call(null, getDigit(lane_start_time), Math.min.apply(null, start_time_arr)) || Math.min.apply(null, start_time_arr) || due_time //与后台返回值计算取最小作为开始
          // console.log('sssss',
          //   getDigit(lane_start_time),
          //   Math.min.apply(null, start_time_arr),
          //   Math.min.call(null, getDigit(lane_start_time), Math.min.apply(null, start_time_arr)))
          let time_span = (!due_time || !start_time) ? 1 : (Math.floor((due_time - start_time) / (24 * 3600 * 1000))) + 1 //正常区间内
          if (due_time > end_date.timestamp && start_time > start_date.timestamp) { //右区间
            time_span = (Math.floor((end_date.timestamp - start_time) / (24 * 3600 * 1000))) + 1
          } else if (start_time < start_date.timestamp && due_time < end_date.timestamp) { //左区间
            time_span = (Math.floor((due_time - start_date.timestamp) / (24 * 3600 * 1000))) + 1
          } else if (due_time > end_date.timestamp && start_time < start_date.timestamp) { //超过左右区间
            time_span = (Math.floor((end_date.timestamp - start_date.timestamp) / (24 * 3600 * 1000))) + 1
          }
          list_group_item.board_fold_data = {
            ...val,
            end_time: due_time,
            start_time,
            time_span,
          }
        }

        list_group.push(list_group_item)
      }
      yield put({
        type: 'updateDatas',
        payload: {
          list_group,
          ceiHeight: ganttIsFold({ gantt_board_id, group_view_type, show_board_fold }) ? ceil_height_fold : ceil_height
        }
      })
      yield put({
        type: 'setListGroup',
        payload: {
          not_set_scroll_top
        }
      })
    },
    * setListGroup({ payload }, { select, call, put }) {
      const { not_set_scroll_top } = payload
      //根据所获得的分组数据转换所需要的数据
      // const { datas: { list_group = [], group_rows = [], ceiHeight, ceilWidth, date_arr_one_level = [] } } = this.props.model
      let list_group = yield select(workbench_list_group)
      list_group = JSON.parse(JSON.stringify(list_group))
      const group_rows = yield select(workbench_group_rows)
      const ceiHeight = yield select(workbench_ceiHeight)
      const ceilWidth = yield select(workbench_ceilWidth)
      const date_arr_one_level = yield select(workbench_date_arr_one_level)
      const group_view_type = yield select(getModelSelectDatasState('gantt', 'group_view_type'))
      const gantt_board_id = yield select(getModelSelectDatasState('gantt', 'gantt_board_id'))
      const show_board_fold = yield select(getModelSelectDatasState('gantt', 'show_board_fold'))
      const gantt_view_mode = yield select(getModelSelectDatasState('gantt', 'gantt_view_mode'))

      const group_list_area = [] //分组高度区域

      //设置分组区域高度, 并为每一个任务新增一条
      for (let i = 0; i < list_group.length; i++) {
        let list_data = list_group[i]['list_data']

        if (!ganttIsOutlineView({ group_view_type })) { //在非大纲视图下才会有排序
          list_data = list_data.sort((a, b) => {
            return a.start_time - b.start_time
          })
        }

        const length = 5 //list_data.length < 5 ? 5 : (list_data.length + 1)
        const group_height = length * ceiHeight
        group_list_area[i] = group_height
        group_rows[i] = length

        //设置纵坐标
        //根据历史分组统计纵坐标累加
        let after_group_height = 0
        for (let k = 0; k < i; k++) {
          after_group_height += group_list_area[k]
        }
        for (let j = 0; j < list_data.length; j++) { //设置每一个实例的位置
          const item = list_data[j]
          item.width = item.time_span * ceilWidth
          item.height = task_item_height

          //设置横坐标
          if (item['start_time'] < date_arr_one_level[0]['timestamp']) { //如果该任务的起始日期在当前查看面板日期之前，就从最左边开始摆放
            item.left = 0
          } else {
            for (let k = 0; k < date_arr_one_level.length; k++) {
              // if (isSamDay(item['start_time'], date_arr_one_level[k]['timestamp'])) { //是同一天
              //   item.left = k * ceilWidth
              //   break
              // }
              if (gantt_view_mode == 'month') { //月视图下遍历得到和开始时间对的上的日期
                if (isSamDay(item['start_time'], date_arr_one_level[k]['timestamp'])) { //是同一天
                  item.left = k * ceilWidth
                  break
                }
              } else if (gantt_view_mode == 'year') { //年视图下遍历时间，如果时间戳在某个月的区间内，定位到该位置
                if (item['start_time'] < date_arr_one_level[k]['timestampEnd'] && item['start_time'] >= date_arr_one_level[k]['timestamp']) {
                  // 该月之前每个月的天数+这一条的日期 = 所在的位置索引（需要再乘以单位长度才是真实位置）
                  const date_length = date_arr_one_level.slice(0, k < 1 ? 1 : k).map(item => item.last_date).reduce((total, num) => total + num) //该月之前所有日期长度之和
                  const date_no = new Date(item['start_time']).getDate() //所属该月几号
                  item.left = (date_length + date_no - 1) * ceilWidth
                  break
                }
              } else {

              }

            }
          }

          item.top = after_group_height + j * ceiHeight

          // --------------------时间高度排序start
          if (!ganttIsOutlineView({ group_view_type })) { // 大纲视图不需要插入排序
            // {满足在时间区间外的，定义before_start_time_arr先记录符合项。
            // 该比较项和之前项存在交集，将交集项存入top_arr
            // 筛选before_start_time_arr，如果top_arr中含有top与某一遍历项相等，则过滤。最终高度取剩余的第一项
            let before_start_time_arr = []
            let top_arr = []
            let all_top = []
            for (let k = 0; k < j; k++) {
              all_top.push(list_data[k].top)
              if (item.start_time > list_data[k].end_time) {
                before_start_time_arr.push(list_data[k])
              }
              if (item.start_time <= list_data[k].end_time) {
                top_arr.push(list_data[k])
              }
            }
            before_start_time_arr = before_start_time_arr.filter(item => {
              let flag = true
              for (let val of top_arr) {
                if (item.top == val.top) {
                  flag = false
                  break
                }
              }
              return flag && item
            })

            all_top = Array.from(new Set(all_top)).sort((a, b) => a - b)
            const all_top_max = Math.max.apply(null, all_top) == -Infinity ? after_group_height : Math.max.apply(null, all_top)

            if (before_start_time_arr[0]) {
              item.top = before_start_time_arr[0].top
            } else {
              if (item.top > all_top_max) {
                item.top = all_top_max + ceiHeight
              }
            }
          }
          // --------------------时间高度排序end
          list_group[i]['list_data'][j] = item
        }
        const list_height_arr = list_group[i]['list_data'].map(item => item.top)
        const list_group_item_height = Math.max.apply(null, list_height_arr) + 2 * ceiHeight - after_group_height

        group_rows[i] = (list_group_item_height / ceiHeight) < 2 ? 2 : list_group_item_height / ceiHeight // 原来是3，现在是2
        if (list_group[i].list_id == '0' && group_view_type == '1' && gantt_board_id != '0') { //默认分组要设置得很高
          group_rows[i] = group_rows[i] + 30
        }
        // 设置项目汇总的top和left,width
        if (ganttIsFold({ gantt_board_id, group_view_type, show_board_fold })) { // 全项目视图下，为收缩状态
          group_rows[i] = group_rows_fold
          list_group[i].board_fold_data.width = list_group[i].board_fold_data.time_span * ceilWidth
          list_group[i].board_fold_data.top = after_group_height + (ceil_height_fold * group_rows_fold - task_item_height_fold) / 2 //上下居中 (96-24)/2
          for (let k = 0; k < date_arr_one_level.length; k++) {
            // if (isSamDay(list_group[i].board_fold_data['start_time'], date_arr_one_level[k]['timestamp'])) { //是同一天
            //   list_group[i].board_fold_data.left = k * ceilWidth
            //   break
            // }
            if (gantt_view_mode == 'month') { //月视图下遍历得到和开始时间对的上的日期
              if (isSamDay(list_group[i].board_fold_data['start_time'], date_arr_one_level[k]['timestamp'])) { //是同一天
                list_group[i].board_fold_data.left = k * ceilWidth
                break
              }
            } else if (gantt_view_mode == 'year') { //年视图下遍历时间，如果时间戳在某个月的区间内，定位到该位置
              if (list_group[i].board_fold_data['start_time'] < date_arr_one_level[k]['timestampEnd'] && list_group[i].board_fold_data['start_time'] >= date_arr_one_level[k]['timestamp']) {
                // 该月之前每个月的天数+这一条的日期 = 所在的位置索引（需要再乘以单位长度才是真实位置）
                const date_length = date_arr_one_level.slice(0, k < 1 ? 1 : k).map(item => item.last_date).reduce((total, num) => total + num) //该月之前所有日期长度之和
                const date_no = new Date(list_group[i].board_fold_data['start_time']).getDate() //所属该月几号
                list_group[i].board_fold_data.left = (date_length + date_no - 1) * ceilWidth
                break
              }
            } else {

            }
          }
        }

        group_list_area[i] = group_rows[i] * ceiHeight
      }

      const group_list_area_section_height = group_list_area.map((item, index) => {
        const list_arr = group_list_area.slice(0, index + 1)
        let height = 0
        for (let val of list_arr) {
          height += val
        }
        return height
      })
      // console.log('sssss', 's3', group_list_area_section_height)
      yield put({
        type: 'updateDatas',
        payload: {
          group_list_area,
          group_rows,
          list_group,
          group_list_area_section_height
        }
      })
      // 设置滚动条的高度位置
      if (!not_set_scroll_top) {
        const group_view_type = yield select(getModelSelectDatasState('gantt', 'group_view_type'))
        const gantt_board_id = yield select(getModelSelectDatasState('gantt', 'gantt_board_id'))
        const target_scrollTop_board_storage = yield select(getModelSelectDatasState('gantt', 'target_scrollTop_board_storage'))
        handleChangeBoardViewScrollTop({ group_view_type, gantt_board_id, target_scrollTop_board_storage })
      }
    },
    * createMilestone({ payload }, { select, call, put }) { //
      const res = yield call(createMilestone, payload)
      if (isApiResponseOk(res)) {
        const { board_id } = payload
        yield put({
          type: 'getGttMilestoneList',
          payload: {
            id: board_id
          }
        })
        message.success('创建成功')
      } else {
        message.error(res.message)
      }
    },
    * getGttMilestoneList({ payload }, { select, call, put }) { //

      const Aa = yield put({
        type: 'returnContentFilterFinalParams',
      })
      const get_content_filter_params = () => new Promise(resolve => {
        resolve(Aa.then())
      })
      const content_filter_params = yield call(get_content_filter_params) || {}
      // console.log('ssssssssss', { content_filter_params })

      const { query_board_ids = [] } = content_filter_params
      const gantt_board_id = yield select(getModelSelectDatasState('gantt', 'gantt_board_id'))

      const start_date = yield select(workbench_start_date)
      const end_date = yield select(workbench_end_date)
      const params = {
        start_time: Number(start_date['timestamp']) / 1000,
        end_time: Number(end_date['timestamp']) / 1000,
        _organization_id: localStorage.getItem('OrganizationId'),
        query_board_ids,
      }
      if (gantt_board_id != '0') { //只有在确认项目对应的一个组织id,才能够进行操作
        params.board_id = gantt_board_id
      }

      const res = yield call(getGttMilestoneList, params)
      // debugger
      // console.log('sssssss', { milestoneMap: res.data })
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            milestoneMap: res.data
          }
        })
      } else {
        message.error(res.message)
      }
    },
    * getContentFiterBoardTree({ payload }, { select, call, put }) {
      const res = yield call(getContentFiterBoardTree, {})
      if (isApiResponseOk) {
        const data = res.data || []
        const treeData = data.map(item => {
          const { org_name, org_id, board_list = [] } = item
          let new_item = {
            title: org_name,
            value: `board_org_${org_id}`,
            key: `board_org_${org_id}`,
            children: []
          }
          const children = board_list.map(item_board => {
            const { board_name, board_id } = item_board
            const new_item_board = {
              title: board_name,
              value: `board_${board_id}`,
              key: `board_${board_id}`,
            }
            return new_item_board
          })
          new_item['children'] = children
          return new_item
        })
        yield put({
          type: 'updateDatas',
          payload: {
            group_view_boards_tree: treeData
          }
        })
      }
    },
    * getContentFiterUserTree({ payload }, { select, call, put }) {
      const res = yield call(getContentFiterUserTree, {})
      if (isApiResponseOk) {
        const data = res.data || []
        const treeData = data.map(item => {
          const { org_name, org_id, groups = [] } = item
          let new_item = {
            title: org_name,
            value: `user_org_${org_id}`,
            key: `user_org_${org_id}`,
            children: []
          }
          const children = groups.map(item_group => {
            const { name, id, members = [] } = item_group
            const new_item_group = {
              title: name,
              value: `user_group_${org_id}_${id}`,
              key: `user_group_${org_id}_${id}`,
              children: []
            }
            const members_children = members.map(item_group_member => {
              const { name, id } = item_group_member
              const new_item_group_member = {
                title: name,
                value: `user_${org_id}_${item_group['id']}_${id}`, //`user_${id}`,//`user_${org_id}_${item_group['id']}_${id}`,
                key: `user_${org_id}_${item_group['id']}_${id}`, //`user_${id}`,
              }

              return new_item_group_member
            })
            new_item_group['children'] = members_children
            return new_item_group
          })
          new_item['children'] = children
          return new_item
        })
        yield put({
          type: 'updateDatas',
          payload: {
            group_view_users_tree: treeData
          }
        })
      }
    },
    // 获取日历（农历节假日）
    * getHoliday({ payload }, { select, call, put }) {
      const start_date = yield select(workbench_start_date)
      const end_date = yield select(workbench_end_date)
      const params = {
        start_time: Number(start_date['timestamp']) / 1000,
        end_time: Number(end_date['timestamp']) / 1000,
      }
      const res = yield call(getHoliday, { ...params })
      // console.log('ssssss', res)
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            holiday_list: res.data,
          }
        })
      }
    },
    * getAboutAppsBoards({ payload }, { select, call, put }) {
      let res = yield call(getProjectList, payload)
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            about_apps_boards: res.data
          }
        })
      } else {

      }
    },
    * getAboutGroupBoards({ payload }, { select, call, put }) {
      let res = yield call(getProjectGoupList, payload)
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            about_group_boards: res.data
          }
        })
      } else {

      }
    },
    * getAboutUsersBoards({ payload }, { select, call, put }) {
      let res = yield call(getProjectUserList, payload)
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            about_user_boards: res.data
          }
        })
      } else {

      }
    },

    * getGanttBoardsFiles({ payload }, { select, call, put }) {
      const res = yield call(getGanttBoardsFiles, payload)
      // console.log('sssssssss', { boards_flies: res.data })
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            boards_flies: res.data
          }
        })
      } else {
        message.warn(res.message, MESSAGE_DURATION_TIME)
        if (res.code == 4041) {
          message.warn(res.message, MESSAGE_DURATION_TIME)
        }
      }
    }
  },

  reducers: {
    updateDatas(state, action) {
      return {
        ...state,
        datas: { ...state.datas, ...action.payload },
      }
    }
  },
}
// list_group: [
//   {
//     list_name: '分组一',
//     list_id: '111',
//     list_data: [
//       {
//         start_time: 1552233600000,
//         end_time: 1552838400000,
//         start_time_string: '2019/3/11',
//         end_time_sting: '2019/3/18',
//         time_span: 7,
//         create_time: 1,
//       }, {
//         start_time: 1552233600000,
//         end_time: 1552579200000,
//         start_time_string: '2019/3/11',
//         end_time_sting: '2019/3/15',
//         time_span: 4,
//         create_time: 1,
//       }, {
//         start_time: 1552320000000,
//         end_time: 1552838400000,
//         start_time_string: '2019/3/12',
//         end_time_sting: '2019/3/18',
//         time_span: 7,
//         create_time: 3,
//       }, {
//         start_time: 1552320000000,
//         end_time: 1552579200000,
//         start_time_string: '2019/3/12',
//         end_time_sting: '2019/3/15',
//         time_span: 4,
//         create_time: 1,
//       }, {
//         start_time: 1552924800000,
//         end_time: 1553184000000,
//         start_time_string: '2019/3/19',
//         end_time_sting: '2019/3/22',
//         time_span: 4,
//         create_time: 1,
//       }, {
//         start_time: 1552924800000,
//         end_time: 1553184000000,
//         start_time_string: '2019/3/19',
//         end_time_sting: '2019/3/22',
//         time_span: 4,
//         create_time: 1,
//       }, {
//         start_time: 1552924800000,
//         end_time: 1553184000000,
//         start_time_string: '2019/3/19',
//         end_time_sting: '2019/3/22',
//         time_span: 4,
//         create_time: 1,
//       }
//     ],
//     list_no_time_data: []
//   },
//   {
//     list_name: '分组二',
//     list_id: '222',
//     list_data: [
//       {
//         start_time: 1552233600000,
//         end_time: 1552838400000,
//         start_time_string: '2019/3/11',
//         end_time_sting: '2019/3/18',
//         time_span: 7,
//         create_time: 1,
//       }, {
//         start_time: 1552233600000,
//         end_time: 1552579200000,
//         start_time_string: '2019/3/11',
//         end_time_sting: '2019/3/15',
//         time_span: 4,
//         create_time: 2,
//       }, {
//         start_time: 1552320000000,
//         end_time: 1552838400000,
//         start_time_string: '2019/3/12',
//         end_time_sting: '2019/3/18',
//         time_span: 7,
//         create_time: 3,
//       }, {
//         start_time: 1552320000000,
//         end_time: 1552579200000,
//         start_time_string: '2019/3/12',
//         end_time_sting: '2019/3/15',
//         time_span: 4,
//         create_time: 4,
//       }
//     ],
//     list_no_time_data: []
//   },
//   {
//     list_name: '分组三',
//     list_id: '333',
//     list_data: [
//       {
//         start_time: 1552233600000,
//         end_time: 1552838400000,
//         start_time_string: '2019/3/11',
//         end_time_sting: '2019/3/18',
//         time_span: 7,
//         create_time: 1,
//       }, {
//         start_time: 1552233600000,
//         end_time: 1552579200000,
//         start_time_string: '2019/3/11',
//         end_time_sting: '2019/3/15',
//         time_span: 4,
//         create_time: 2,
//       }, {
//         start_time: 1552320000000,
//         end_time: 1552838400000,
//         start_time_string: '2019/3/12',
//         end_time_sting: '2019/3/18',
//         time_span: 7,
//         create_time: 3,
//       }, {
//         start_time: 1552320000000,
//         end_time: 1552579200000,
//         start_time_string: '2019/3/12',
//         end_time_sting: '2019/3/15',
//         time_span: 4,
//         create_time: 4,
//       }
//     ],
//     list_no_time_data: []
//   },
// ],
