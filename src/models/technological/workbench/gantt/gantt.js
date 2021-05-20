import {
  getGanttBoardsFiles,
  getGanttData,
  getGttMilestoneList,
  getContentFiterBoardTree,
  getContentFiterUserTree,
  getHoliday,
  getGanttUserCustorm,
  getGroupScrollAdditionalData
} from '../../../../services/technological/gantt'
import {
  getProjectList,
  getProjectUserList
} from '../../../../services/technological/workbench'
import { isApiResponseOk } from '../../../../utils/handleResponseData'
import { message } from 'antd'
import {
  BOOLEAN_TRUE_CODE,
  MESSAGE_DURATION_TIME
} from '../../../../globalset/js/constant'
import { routerRedux } from 'dva/router'
import queryString from 'query-string'
import { getDateInfo } from '../../../../routes/Technological/components/Gantt/getDate'
import {
  workbench_projectTabCurrentSelectedProject,
  workbench_start_date,
  workbench_end_date,
  workbench_list_group,
  workbench_group_rows,
  workbench_ceiHeight,
  workbench_ceilWidth,
  workbench_date_arr_one_level
} from '../selects'
import { createMilestone } from '../../../../services/technological/prjectDetail'
import { getGlobalData } from '../../../../utils/businessFunction'
import {
  task_item_height,
  ceil_height,
  ceil_height_fold,
  ganttIsFold,
  group_rows_fold,
  task_item_height_fold,
  test_card_item,
  mock_gantt_data,
  ganttIsOutlineView,
  mock_outline_tree,
  ceil_width,
  ceil_width_year,
  one_group_row_total,
  ganttIsSingleBoardGroupView,
  date_area_height,
  hours_view_start_work_oclock,
  hours_view_due_work_oclock,
  ceil_width_hours,
  group_rows_fold_1,
  hole_movedown_height,
  milestone_base_height,
  getMilestoneBaseHeight,
  GANTT_IDS,
  extra_group_row
} from '../../../../routes/Technological/components/Gantt/constants'
import { getModelSelectDatasState } from '../../../utils'
import { getProjectGoupList } from '../../../../services/technological/task'
import {
  handleChangeBoardViewScrollTop,
  setGantTimeSpan,
  diffGanttTimeSpan,
  setHourViewCardTimeSpan,
  diffClientDefaultViewMode,
  diffClientDefaultCeilWidth
} from '../../../../routes/Technological/components/Gantt/ganttBusiness'
import {
  jsonArrayCompareSort,
  transformTimestamp,
  isSamDay,
  isSamHour
} from '../../../../utils/util'
import gantt_effect from './gantt_effect'
import { recusionItem } from './gantt_utils'
let dispatches = null
const visual_add_item = {
  id: '',
  name: '',
  tree_type: '0',
  is_expand: false,
  parent_expand: true,
  add_id: 'add_milestone', //0表示创建里程碑，其他地创建add_id归纳到父级id
  children: [],
  editing: false,
  due_time: '',
  start_time: ''
}
const getDigit = timestamp => {
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

/** 甘特图redux统一管理枚举 */
export const GANTTMODEL = {
  /** 命名空间 'gantt' */
  namespace: 'gantt',
  /**
   * 更新多个分组视图下的任务条列表
   * @param {{id: String, label_data: object[], name: String}[]} datas 需要更新的任务条数据列表
   * @param {String} id 更新的id，必填
   * @param {{label_id: String, label_name: String, label_color: String}[]} label_data 标签列表
   * @params ...
   */
  updateListGroup: 'updateListGroup',
  /** 更新大纲视图数据 */
  updateOutLineTree: 'updateOutLineTree'
}

export default {
  namespace: 'gantt',
  state: {
    datas: {
      ...gantt_effect.state,
      gantt_view_mode: diffClientDefaultViewMode('month'), //week / month /year/ hours /relative_time'周视图，月视图，年视图,'，原来月视图定义成 ‘天视图’， 年视图则是定义成 ‘月视图’
      gold_date_arr: [], //所需要的日期数据
      date_arr_one_level: [], //所有日期数据扁平成一级数组
      start_date: {}, //日期最开始的那一天
      end_date: {}, //日期最后那一天
      create_start_time: '', //创建任务开始时间
      create_end_time: '', //创建任务截至时间
      list_group: [], //分组列表
      ceilWidth: diffClientDefaultCeilWidth(ceil_width), //单元格的宽度
      ceiHeight: ceil_height, //单元格高度 40 + 12的外边距
      date_total: 0, //总天数
      group_rows: [
        one_group_row_total,
        one_group_row_total,
        one_group_row_total
      ], //每一个分组默认行数 [7, 7, 7]
      group_rows_lock: [0, 0, 0], //group_rows的锁，当 key对应的值为正整数时， 优先
      group_list_area: [], //分组高度区域 [组一行数 * ceiHeight，组二行数 * ceiHeight]
      group_list_area_section_height: [], //分组高度区域总高度 [组一行数 * ceiHeight，(组一行数 + 组二行数) * ceiHeight， ...]
      group_list_area_fold_section: [], // 控制分组是否折叠 [{list_id:'',is_group_folded: false}]
      isDragging: false, //甘特图是否在拖拽中
      target_scrollLeft: 0, //总体滚动条向左滑动位置
      target_scrollTop: 0, //总体滚动条偏离顶部滑动位置
      target_scrollTop_board_storage: 0, //缓存查看项目视图下，滚动条的位置高度
      current_list_group_id: '0', //当前选中的分组id
      belong_group_row: undefined, //创建任务时所在所属分组的第几行
      milestoneMap: {}, //[], //里程碑列表{time1: [], time2: []}

      about_apps_boards: [], //带app的项目列表
      about_group_boards: [], //带分组的项目列表
      about_user_boards: [], //带用户的项目列表

      gantt_board_id: '0', //"1192342431761305600",//, //甘特图查看的项目id
      gantt_board_list_id: '0', //项目分组的操作id
      group_view_type: '1', //分组视图1项目， 2成员, 4大纲, 5项目分组再分组成成员
      group_view_filter_boards: [], //内容过滤项目id 列表
      group_view_filter_users: [], //内容过滤职员id 列表
      single_select_user: { id: '', name: '' }, //成员视图下，点击成员
      group_view_boards_tree: [], //内容过滤项目分组树
      group_view_users_tree: [], //内容过滤成员分组树
      holiday_list: [], //日历列表（包含节假日农历）
      get_gantt_data_loading: false, //是否在请求甘特图数据状态
      get_gantt_data_loading_other: false, //为其它操作想要阻断页面做loading(应用于难以解决的切换显示延迟)
      get_gantt_data_loaded: false,
      get_milestone_loading: false, //获取里程碑接口状态
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

      selected_hide_term: false, // 表示是否选择隐藏项 true 表示是
      isDisplayContentIds: [], // 表示已经隐藏的content_ids
      outline_tree_filter_type: {
        //大纲过滤掉的选项, 1代表显示 0 代表隐藏
        is_show_due: BOOLEAN_TRUE_CODE,
        is_show_warning: BOOLEAN_TRUE_CODE,
        is_show_doing: BOOLEAN_TRUE_CODE,
        is_show_realize: BOOLEAN_TRUE_CODE,
        is_show_not_start: BOOLEAN_TRUE_CODE
      },
      outline_tree_original: [], // 大纲视图显示隐藏快照 数据源
      card_name_outside: false, //任务名称是否外置
      base_relative_time: '', //相对时间轴的基准时间

      group_folded_rely_card: [], // 表示分组折叠后 存在有依赖关系的任务
      gantt_card_date_no_section: {}, // 表示选中任务时对应显示日期内容
      group_not_allow_drag_area: [] //不可拖拽区域
    }
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
    }
  },
  effects: {
    ...gantt_effect.effects, //其它定义的事件，模块分出去
    *returnContentFilterFinalParams({ payload }, { select, call, put }) {
      //返回内容过滤输出成的请求参数 { key: value}
      try {
        const group_view_filter_boards = yield select(
          getModelSelectDatasState('gantt', 'group_view_filter_boards')
        )
        const group_view_filter_users = yield select(
          getModelSelectDatasState('gantt', 'group_view_filter_users')
        )
        const group_view_boards_tree = yield select(
          getModelSelectDatasState('gantt', 'group_view_boards_tree')
        )
        const group_view_users_tree = yield select(
          getModelSelectDatasState('gantt', 'group_view_users_tree')
        )
        const single_select_user = yield select(
          getModelSelectDatasState('gantt', 'single_select_user')
        )
        //内容过滤处理
        const setContentFilterParams = () => {
          let query_board_ids = []
          let query_user_ids = [single_select_user.id].filter(item => item)

          //  项目id处理
          for (let val of group_view_filter_boards) {
            if (val.indexOf('board_org_') != -1) {
              //项目组织id
              const org_board_list = group_view_boards_tree.find(
                item => item.value == val
              ).children
              const org_board_id_list = org_board_list.map(item =>
                item.value.replace('board_', '')
              )
              query_board_ids = [].concat(query_board_ids, org_board_id_list)
            } else {
              //项目id
              const board_id = val.replace('board_', '')
              query_board_ids.push(board_id)
            }
          }

          // 用户id处理
          for (let val of group_view_filter_users) {
            if (val.indexOf('user_org_') != -1) {
              //用户组织id
              // 遍历得到了分组
              const org_groups = group_view_users_tree.find(
                item => item.value == val
              ).children //得到组织的用户分组
              const org_groups_users = org_groups.map(item => item.children) //得到一个二维数组，组为一维，用户列表为二维
              const org_users = org_groups_users.reduce(function(a, b) {
                return a.concat(b)
              }) //该组织下所有分组用户铺开一维数组
              const org_user_ids = org_users.map(
                item => item.value.replace('user_', '').split('_')[2]
              )
              query_user_ids = [].concat(query_user_ids, org_user_ids)
            } else if (val.indexOf('user_group_') != -1) {
              //分组id
              const org_groupr_id_arr = val
                .replace('user_group_', '')
                .split('_')
              const group_org_id = org_groupr_id_arr[0]
              const group_id = org_groupr_id_arr[1]

              const org_groups = group_view_users_tree.find(
                item => item.value == `user_org_${group_org_id}`
              ).children //得到组织对应分组列表
              const org_users = org_groups.find(
                item => item.value == `user_group_${group_org_id}_${group_id}`
              ).children //得到对应分组
              const org_user_ids = org_users.map(
                item => item.value.replace('user_', '').split('_')[2]
              )
              query_user_ids = [].concat(query_user_ids, org_user_ids)
            } else {
              //用户id
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
            query_user_ids
          }
        }
        return {
          ...setContentFilterParams()
        }
      } catch (err) {
        console.log('ssss_err_-1', err)
      }
    },
    *getGanttData({ payload }, { select, call, put }) {
      try {
        let { not_set_loading, start_date, end_date } = payload //not_set_loading是否需要设置loading状态
        // 参数处理
        if (!start_date) {
          start_date = yield select(workbench_start_date)
        }
        if (!end_date) {
          end_date = yield select(workbench_end_date)
        }
        const group_view_type = yield select(
          getModelSelectDatasState('gantt', 'group_view_type')
        )
        const gantt_board_id = yield select(
          getModelSelectDatasState('gantt', 'gantt_board_id')
        )
        const gantt_board_list_id = yield select(
          getModelSelectDatasState('gantt', 'gantt_board_list_id')
        )
        //内容过滤处理
        const Aa = yield put({
          type: 'returnContentFilterFinalParams'
        })
        const get_content_filter_params = () =>
          new Promise(resolve => {
            resolve(Aa.then())
          })
        // 内容过滤处理end
        const content_filter_params = yield call(get_content_filter_params) ||
          {}
        // console.log('ssssssssss', {
        //   group_view_filter_boards,
        //   group_view_filter_users,
        //   ...setContentFilterParams()
        // })
        yield put({
          type: 'updateDatas',
          payload: {
            folder_seeing_board_id: '0',
            // 清空关于大纲视图显示隐藏数据
            selected_hide_term: false,
            outline_tree_original: [],
            milestoneMap: {}
          }
        })
        let params = {
          chart_type: group_view_type
        }
        if (!ganttIsOutlineView({ group_view_type })) {
          params = {
            start_time: start_date['timestamp'],
            end_time: end_date['timestamp'],
            chart_type: group_view_type, //group_view_type,
            ...content_filter_params
          }
        }

        if (gantt_board_id != '0' && gantt_board_id) {
          yield put({
            type: 'handleReadedBoard',
            payload: {
              board_id: gantt_board_id
            }
          })
          params.board_id = gantt_board_id
          if (group_view_type == '5') {
            //分组点击
            params.list_id = gantt_board_list_id
          }
        }

        const timer = setTimeout(() => {
          dispatches({
            type: 'updateDatas',
            payload: {
              get_gantt_data_loading: not_set_loading ? false : true
            }
          })
        }, 0)
        yield put({
          type: 'updateDatas',
          payload: {
            get_gantt_data_loaded: false
          }
        })

        const res = yield call(getGanttData, params)
        clearTimeout(timer)
        yield put({
          type: 'getCardRelys',
          payload: {}
        })
        // 查询文件列表
        yield put({
          type: 'getGanttBoardsFiles',
          payload: {
            query_board_ids: content_filter_params.query_board_ids,
            board_id: gantt_board_id == '0' ? '' : gantt_board_id
          }
        })
        // console.log('sssss', {res})
        if (isApiResponseOk(res)) {
          let data = res.data
          if (!ganttIsOutlineView({ group_view_type })) {
            //非大纲视图
            yield put({
              type: 'handleListGroup',
              payload: {
                data: data //res.data
              }
            })
            yield put({
              type: 'updateDatas',
              payload: {
                get_gantt_data_loading: false,
                get_gantt_data_loaded: true,
                outline_tree: [],
                outline_tree_round: [],
                group_rows_lock: []
              }
            })
          } else {
            // 先获取隐藏项
            const filterHidenRes = yield call(getGanttUserCustorm, {
              board_id: gantt_board_id
            })
            if (isApiResponseOk(filterHidenRes)) {
              yield put({
                type: 'updateDatas',
                payload: {
                  outline_tree_filter_type: {
                    is_show_due: filterHidenRes.data.is_show_due,
                    is_show_warning: filterHidenRes.data.is_show_warning,
                    is_show_doing: filterHidenRes.data.is_show_doing,
                    is_show_realize: filterHidenRes.data.is_show_realize,
                    is_show_not_start: filterHidenRes.data.is_show_not_start
                  },
                  get_gantt_data_loading: false,
                  get_gantt_data_loaded: true
                }
              })
            }
            yield put({
              type: 'handleOutLineTreeData',
              payload: {
                data: res.data,
                filter_display: true
              }
            })
          }
          yield put({
            type: 'getGttMilestoneList',
            payload: {}
          })
          return { code: '0' }
        } else {
          return { code: '1' }
        }
      } catch (err) {
        console.log('ssss_err_0', err)
      }
    },
    // 向左向右滚动时获取新增加的日期的数据
    *getGroupScrollAdditionalData({ payload }, { select, call, put }) {
      const { start_time, end_time } = payload
      const group_view_type = yield select(
        getModelSelectDatasState('gantt', 'group_view_type')
      )

      const board_id = yield select(
        getModelSelectDatasState('gantt', 'gantt_board_id')
      )

      const params = {
        start_time,
        end_time,
        chart_type: group_view_type
      }

      if (board_id != '0' && board_id) {
        params.board_id = board_id
      }
      const res = yield call(getGroupScrollAdditionalData, params)
      //需要将新获取的数据和原数据整合
      if (isApiResponseOk(res)) {
        const list_group = yield select(
          getModelSelectDatasState('gantt', 'list_group')
        )
        const res_data = res.data || []
        if (!res_data.length) {
          return {}
        }

        for (let val of list_group) {
          // 找到和当前原数据匹配的最新增加的数据
          const _data_item = res_data.find(item => item.lane_id == val.lane_id)
          if (!_data_item) {
            break
          }
          const { cards: _data_item_cards = [] } = _data_item.lane_data //当前分组新增的排期任务列表
          for (let cards_val of _data_item_cards) {
            //新加载出来的任务和原来的任务是否有重叠
            const aredy_has =
              val.lane_data.cards.findIndex(item => item.id == cards_val.id) !=
              -1
            // 如果原来没有存在
            if (!aredy_has) {
              val.lane_data.cards.unshift(cards_val)
            }
          }
        }

        yield put({
          type: 'handleListGroup',
          payload: {
            data: list_group
          }
        })
        yield put({
          type: 'updateDatas',
          payload: {
            milestoneMap: {}
          }
        })
        yield put({
          type: 'getGttMilestoneList',
          payload: {}
        })
      }

      return { code: '0' }
    },
    // 转化处理大纲视图数据
    *handleOutLineTreeData({ payload }, { select, call, put }) {
      // filter_display 为true时,将大纲视图中is_display为false的隐藏
      const { data = [], filter_display } = payload
      const start_date = yield select(workbench_start_date)
      const end_date = yield select(workbench_end_date)
      const ceilWidth = yield select(workbench_ceilWidth)
      const date_arr_one_level = yield select(workbench_date_arr_one_level)
      const gantt_view_mode = yield select(
        getModelSelectDatasState('gantt', 'gantt_view_mode')
      )
      const outline_tree_filter_type = yield select(
        getModelSelectDatasState('gantt', 'outline_tree_filter_type')
      )
      // 获取项目预警值
      const {
        board_set: { time_warning: board_eraly_waring }
      } = yield select(
        getModelSelectDatasState('projectDetail', 'projectDetailInfoData')
      )
      if (!date_arr_one_level.length) return
      const min_start_time = date_arr_one_level[0]?.timestamp //最早时间
      const max_due_time =
        date_arr_one_level[date_arr_one_level.length - 1]?.timestampEnd
      let new_outline_tree = [...data]
      // const tree_arr_1 = data.filter(item => item.tree_type == '1')//.sort(jsonArrayCompareSort('due_time', transformTimestamp)) //里程碑截止时间由近及远
      // const tree_arr_2 = data.filter(item => item.tree_type != '1')//.sort(jsonArrayCompareSort('start_time', transformTimestamp))
      // new_outline_tree = [].concat(tree_arr_1, tree_arr_2)//先把里程碑排进去，再排没有归属的任务
      let filnaly_outline_tree = recusionItem(
        new_outline_tree,
        { parent_expand: true },
        {
          start_date,
          end_date,
          filter_display,
          gantt_view_mode,
          min_start_time,
          max_due_time,
          outline_tree_filter_type,
          board_eraly_waring
        }
      )
      // console.log('filnaly_outline_tree_0', filnaly_outline_tree)
      yield put({
        type: 'updateDatas',
        payload: {
          outline_tree: filnaly_outline_tree
        }
      })

      // 将数据平铺
      let arr = []
      const recusion = obj => {
        //将树递归平铺成一级
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
      // console.log('filnaly_outline_tree_0_1', filnaly_outline_tree)

      arr = arr.filter(item => item.parent_expand)
      arr.push({ ...visual_add_item, add_id: 'add_milestone_out' }) //默认有个新建里程碑，占位
      arr = arr.map((item, key) => {
        let new_item = {}
        const { tree_type, children = [], child_card_status = {} } = item //  里程碑/任务/子任务/虚拟占位 1/2/3/4
        const cal_left_field = tree_type == '1' ? 'due_time' : 'start_time' //计算起始位置的字段
        item.top = key * ceil_height + 26
        const due_time = getDigit(item['due_time'])
        const start_time = getDigit(item['start_time']) || due_time //如果没有开始时间，那就取截止时间当天

        let time_span = item['time_span'] || Number(item['plan_time_span'])
        // time_span = setGantTimeSpan({ time_span, start_time, due_time, start_date, end_date })
        // 获取子任务状态
        child_card_status.has_child = children.length ? '1' : '0'
        child_card_status.min_start_time =
          Math.min.apply(
            null,
            children.map(item => item.start_time)
          ) || ''
        child_card_status.max_due_time =
          Math.max.apply(
            null,
            children.map(item => item.due_time)
          ) || ''
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
          (tree_type == '1' &&
            (getDigit(new_item['due_time']) <
              getDigit(date_arr_one_level[0]['timestamp']) ||
              getDigit(new_item['due_time']) >
                getDigit(
                  date_arr_one_level[date_arr_one_level_length - 1]['timestamp']
                ))) || //里程碑只需考虑截止在区间外
          (tree_type == '2' && //任务在可视区域左右区间外
            getDigit(new_item['due_time']) <
              getDigit(date_arr_one_level[0]['timestamp']) &&
            getDigit(start_time) <
              getDigit(date_arr_one_level[0]['timestamp'])) ||
          getDigit(new_item['start_time']) >
            getDigit(
              date_arr_one_level[date_arr_one_level_length - 1]['timestamp']
            )
        ) {
          //如果该任务的起始日期在当前查看面板日期之前，就从最左边开始摆放
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
            if (
              gantt_view_mode == 'month' ||
              gantt_view_mode == 'relative_time'
            ) {
              //月视图下遍历得到和开始时间对的上的日期
              if (
                isSamDay(
                  new_item[cal_left_field],
                  date_arr_one_level[k]['timestamp']
                )
              ) {
                //是同一天
                const max_width = (date_arr_one_level_length - k) * ceilWidth //剩余最大可放长度
                new_item.left = k * ceilWidth
                new_item.width = Math.min.apply(Math, [
                  max_width,
                  (time_span || 1) * ceilWidth
                ]) //取最小可放的
                //有截止时间的里程碑，溯源到开始时间位置
                if (new_item.min_leaf_card_time && new_item.left) {
                  // eslint-disable-next-line prettier/prettier
                  new_item.min_leaf_left = Math.max(
                    0,
                    new_item.left -
                      Math.floor(
                        (new_item[cal_left_field] -
                          new_item.min_leaf_card_time) /
                          (24 * 60 * 60 * 1000)
                      ) *
                        ceilWidth
                  )
                }
                time_belong_area = true
                break
              }
            } else if (gantt_view_mode == 'year') {
              //年视图下遍历时间，如果时间戳在某个月的区间内，定位到该位置
              if (
                new_item[cal_left_field] <=
                  date_arr_one_level[k]['timestampEnd'] &&
                new_item[cal_left_field] >= date_arr_one_level[k]['timestamp']
              ) {
                // 该月之前每个月的天数+这一条的日期 = 所在的位置索引（需要再乘以单位长度才是真实位置）
                const all_date_length = date_arr_one_level
                  .slice()
                  .map(item => item.last_date)
                  .reduce((total, num) => total + num) //该月之前所有日期长度之和
                const date_length = date_arr_one_level
                  .slice(0, k < 1 ? 1 : k)
                  .map(item => item.last_date)
                  .reduce((total, num) => total + num) //该月之前所有日期长度之和
                const date_no = new Date(item[cal_left_field]).getDate() //所属该月几号
                const max_width =
                  (all_date_length - date_length - date_no) * ceilWidth //剩余最大可放长度
                new_item.left = (date_length + date_no - 1) * ceilWidth
                new_item.width = Math.min.apply(Math, [
                  max_width,
                  (time_span || 1) * ceilWidth
                ]) //取最小可放的

                //有截止时间的里程碑，溯源到开始时间位置
                if (new_item.min_leaf_card_time && new_item.left) {
                  // eslint-disable-next-line prettier/prettier
                  new_item.min_leaf_left = Math.max(
                    0,
                    new_item.left -
                      Math.floor(
                        (new_item[cal_left_field] -
                          new_item.min_leaf_card_time) /
                          (24 * 60 * 60 * 1000)
                      ) *
                        ceilWidth
                  )
                }

                time_belong_area = true
                break
              }
            } else if (gantt_view_mode == 'week') {
              if (
                new_item[cal_left_field] <=
                  date_arr_one_level[k]['timestampEnd'] &&
                new_item[cal_left_field] >= date_arr_one_level[k]['timestamp']
              ) {
                const date_day = new Date(new_item[cal_left_field]).getDay() //周几
                new_item.left =
                  ((k + (date_day == 0 ? 1 : 0)) * 7 + date_day - 1) * ceilWidth
                new_item.width = (time_span || 1) * ceilWidth

                //有截止时间的里程碑，溯源到开始时间位置,
                if (new_item.min_leaf_card_time && new_item.left) {
                  // eslint-disable-next-line prettier/prettier
                  new_item.min_leaf_left = Math.max(
                    0,
                    new_item.left -
                      Math.floor(
                        (new_item[cal_left_field] -
                          new_item.min_leaf_card_time) /
                          (24 * 60 * 60 * 1000)
                      ) *
                        ceilWidth
                  )
                }
                break
              }
            } else if (gantt_view_mode == 'hours') {
              if (
                //如果重合
                isSamHour(
                  new_item[cal_left_field],
                  date_arr_one_level[k]['timestamp']
                )
              ) {
                new_item.left = k * ceilWidth
                if (new_item.min_leaf_card_time) {
                  //左边位置 = 右边位置 - 宽度
                  new_item.min_leaf_left =
                    new_item.left -
                    setHourViewCardTimeSpan(
                      new_item.min_leaf_card_time,
                      transformTimestamp(new_item[cal_left_field]),
                      min_start_time,
                      max_due_time
                    ) *
                      ceilWidth +
                    ceilWidth
                }

                break
              } else {
                //如果是在同一天，开始时间不在工作时间内
                if (
                  isSamDay(
                    new_item[cal_left_field],
                    date_arr_one_level[k]['timestamp']
                  )
                ) {
                  // 开始时间在工作时间之前
                  if (
                    new_item[cal_left_field] <
                      date_arr_one_level[k]['timestamp'] &&
                    date_arr_one_level[k]['date_no'] ==
                      hours_view_start_work_oclock
                  ) {
                    new_item.left = k * ceilWidth
                    if (new_item.min_leaf_card_time) {
                      //左边位置 = 右边位置 - 宽度
                      new_item.min_leaf_left =
                        new_item.left -
                        setHourViewCardTimeSpan(
                          new_item.min_leaf_card_time,
                          transformTimestamp(new_item[cal_left_field]),
                          min_start_time,
                          max_due_time
                        ) *
                          ceilWidth +
                        ceilWidth
                    }
                    break
                  } else if (
                    //开始时间在工作时间之后
                    new_item[cal_left_field] >
                      date_arr_one_level[k]['timestamp'] &&
                    date_arr_one_level[k]['date_no'] ==
                      hours_view_due_work_oclock - 1
                  ) {
                    if (new_item.tree_type == '2') {
                      new_item.left = (k + 1) * ceilWidth
                    } else {
                      new_item.left = k * ceilWidth
                    }
                    if (new_item.min_leaf_card_time) {
                      // eslint-disable-next-line prettier/prettier
                      new_item.min_leaf_left =
                        new_item.left -
                        setHourViewCardTimeSpan(
                          new_item.min_leaf_card_time,
                          transformTimestamp(new_item[cal_left_field]),
                          min_start_time,
                          max_due_time
                        ) *
                          ceilWidth +
                        ceilWidth
                    }
                    break
                  }
                }
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
      // console.log('filnaly_outline_tree1', filnaly_outline_tree)
      // console.log('filnaly_outline_tree2', arr)
      // console.log('filnaly_outline_tree1', filnaly_outline_tree[0].expand_length)
      // console.log('filnaly_outline_tree2', filnaly_outline_tree[1].expand_length)
      // 更新基线信息
      const active_baseline = yield select(
        getModelSelectDatasState('gantt', 'active_baseline')
      )
      yield put({
        type: 'getBaseLineInfo',
        payload: { ...active_baseline }
      })
    },
    *handleListGroup({ payload }, { select, call, put }) {
      try {
        const { data, not_set_scroll_top } = payload
        let list_group = []
        const start_date = yield select(workbench_start_date)
        const end_date = yield select(workbench_end_date)
        const group_view_type = yield select(
          getModelSelectDatasState('gantt', 'group_view_type')
        )
        const gantt_board_id = yield select(
          getModelSelectDatasState('gantt', 'gantt_board_id')
        )
        const show_board_fold = yield select(
          getModelSelectDatasState('gantt', 'show_board_fold')
        )
        const gantt_view_mode = yield select(
          getModelSelectDatasState('gantt', 'gantt_view_mode')
        )
        const date_arr_one_level = yield select(
          getModelSelectDatasState('gantt', 'date_arr_one_level')
        )
        const show_group_flod = yield select(
          getModelSelectDatasState('gantt', 'group_list_area_fold_section')
        )
        if (!date_arr_one_level.length) return
        const min_start_time = date_arr_one_level[0]?.timestamp //最早时间
        const max_due_time =
          date_arr_one_level[date_arr_one_level.length - 1]?.timestampEnd //最晚时间
        for (let val of data) {
          const list_group_item = {
            ...val,
            list_name: val['lane_name'],
            list_id: val['lane_id'],
            list_data: [],
            list_no_time_data: val['lane_data']['card_no_times'] || []
          }
          const group_folded = (
            show_group_flod.find(item => item.list_id == val['lane_id']) || {}
          ).is_group_folded
          if (val['lane_data']['cards']) {
            for (let val_1 of val['lane_data']['cards']) {
              const due_time = getDigit(val_1['due_time'])
              const start_time = getDigit(val_1['start_time']) || due_time //如果没有开始时间，那就取截止时间当天
              const create_time = getDigit(val_1['create_time'])
              let time_span = val_1['time_span']

              if (gantt_view_mode == 'hours') {
                time_span = setHourViewCardTimeSpan(
                  start_time,
                  due_time,
                  min_start_time,
                  max_due_time
                )
              } else {
                if (!time_span) {
                  time_span =
                    !due_time || !start_time
                      ? 1
                      : Math.floor(
                          (due_time - start_time) / (24 * 3600 * 1000)
                        ) + 1 //正常区间内
                  if (
                    due_time > end_date.timestamp &&
                    start_time > start_date.timestamp
                  ) {
                    //右区间
                    time_span =
                      Math.floor(
                        (end_date.timestamp - start_time) / (24 * 3600 * 1000)
                      ) + 1
                  } else if (
                    start_time < start_date.timestamp &&
                    due_time < end_date.timestamp
                  ) {
                    //左区间
                    time_span =
                      Math.floor(
                        (due_time - start_date.timestamp) / (24 * 3600 * 1000)
                      ) + 1
                  } else if (
                    due_time > end_date.timestamp &&
                    start_time < start_date.timestamp
                  ) {
                    //超过左右区间
                    time_span =
                      Math.floor(
                        (end_date.timestamp - start_date.timestamp) /
                          (24 * 3600 * 1000)
                      ) + 1
                  }
                  // console.log('sssssss', val_1.name, time_span)
                  // time_span = time_span > date_arr_one_level.length?  date_arr_one_level.length: time_span
                }
                time_span = diffGanttTimeSpan({
                  time_span,
                  start_time,
                  due_time
                })
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
          if (
            ganttIsFold({
              gantt_board_id,
              group_view_type,
              show_board_fold,
              gantt_view_mode,
              group_folded
            })
          ) {
            //全项目视图下，收缩，取特定某一条做基准，再进行时间汇总
            const start_time_arr = list_group_item.list_data.map(
              item => item.start_time
            ) //取视窗任务的最开始时间
            const due_time_arr = list_group_item.list_data.map(
              item => item.end_time
            ) //取视窗任务的最后截止时间
            const { lane_start_time, lane_end_time } = list_group_item
            const time_arr = []
              .concat(start_time_arr, due_time_arr, [
                getDigit(lane_end_time),
                getDigit(lane_start_time)
              ])
              .filter(item => item)
            const due_time = Math.max.apply(null, time_arr) //与后台返回值计算取最大作为结束
            const start_time = Math.min.apply(null, time_arr) //与后台返回值计算取最小作为开始
            // console.log('time_arrtime_arr', list_group_item.list_name, { time_arr, due_time, start_time })

            let time_span =
              !due_time || !start_time
                ? 1
                : Math.floor((due_time - start_time) / (24 * 3600 * 1000)) + 1 //正常区间内
            if (
              due_time > end_date.timestamp &&
              start_time > start_date.timestamp
            ) {
              //右区间
              time_span =
                Math.floor(
                  (end_date.timestamp - start_time) / (24 * 3600 * 1000)
                ) + 1
            } else if (
              start_time < start_date.timestamp &&
              due_time < end_date.timestamp
            ) {
              //左区间
              time_span =
                Math.floor(
                  (due_time - start_date.timestamp) / (24 * 3600 * 1000)
                ) + 1
            } else if (
              due_time > end_date.timestamp &&
              start_time < start_date.timestamp
            ) {
              //超过左右区间
              time_span =
                Math.floor(
                  (end_date.timestamp - start_date.timestamp) /
                    (24 * 3600 * 1000)
                ) + 1
            }
            // let lane_schedule_count = 0
            // let lane_overdue_count = 0
            // let lane_todo_count = 0
            // for (let val of list_group_item.lane_data.cards) {
            //   lane_schedule_count += 1
            //   const _new_due_time = transformTimestamp(val.due_time)
            //   if (val.is_realize != '1') { //未完成
            //     lane_todo_count += 1
            //     if (new Date().getTime() > _new_due_time) {//超时未完成
            //       lane_overdue_count += 1
            //     }

            //   }

            // }
            // list_group_item.lane_overdue_count = lane_overdue_count
            // list_group_item.lane_todo_count = lane_todo_count
            // list_group_item.lane_schedule_count = lane_schedule_count

            list_group_item.board_fold_data = {
              ...val,
              // lane_overdue_count,
              // lane_todo_count,
              // lane_schedule_count,
              end_time: due_time,
              start_time,
              time_span
            }
          }

          list_group.push(list_group_item)
        }
        yield put({
          type: 'updateDatas',
          payload: {
            ceiHeight: ganttIsFold({
              gantt_board_id,
              group_view_type,
              show_board_fold,
              gantt_view_mode
            })
              ? ceil_height_fold
              : ceil_height
          }
        })
        yield put({
          type: 'setListGroup',
          payload: {
            list_group,
            not_set_scroll_top
          }
        })
      } catch (err) {
        console.log('ssss_err_1', err)
      }
    },
    *setListGroup({ payload }, { select, call, put }) {
      try {
        let { not_set_scroll_top, list_group = [] } = payload
        //根据所获得的分组数据转换所需要的数据
        // const { datas: { list_group = [], group_rows = [], ceiHeight, ceilWidth, date_arr_one_level = [] } } = this.props.model
        // let list_group = yield select(workbench_list_group)
        list_group = JSON.parse(JSON.stringify(list_group))
        const group_rows = yield select(workbench_group_rows)
        const ceiHeight = yield select(workbench_ceiHeight)
        const ceilWidth = yield select(workbench_ceilWidth)
        const date_arr_one_level = yield select(workbench_date_arr_one_level)
        const group_view_type = yield select(
          getModelSelectDatasState('gantt', 'group_view_type')
        )
        const gantt_board_id = yield select(
          getModelSelectDatasState('gantt', 'gantt_board_id')
        )
        const show_board_fold = yield select(
          getModelSelectDatasState('gantt', 'show_board_fold')
        )
        const gantt_view_mode = yield select(
          getModelSelectDatasState('gantt', 'gantt_view_mode')
        )
        const group_rows_lock = yield select(
          getModelSelectDatasState('gantt', 'group_rows_lock')
        )
        const show_group_flod = yield select(
          getModelSelectDatasState('gantt', 'group_list_area_fold_section')
        )
        const group_list_area = [] //分组高度区域

        //设置分组区域高度, 并为每一个任务新增一条
        for (let i = 0; i < list_group.length; i++) {
          let list_data = list_group[i]['list_data']
          const group_folded = (
            show_group_flod.find(
              item => item.list_id == list_group[i].list_id
            ) || {}
          ).is_group_folded
          if (!ganttIsOutlineView({ group_view_type })) {
            //在非大纲视图下才会有排序
            list_data = list_data.sort((a, b) => {
              return a.start_time - b.start_time
            })
          }

          const lane_row_count = list_group[i].lane_row_count || 0 //项目分组下默认带的行高
          const length = Math.max(lane_row_count, one_group_row_total) //list_data.length < 5 ? 5 : (list_data.length + 1)
          const group_height = length * ceiHeight
          group_list_area[i] = group_height
          group_rows[i] = length

          //设置纵坐标
          //根据历史分组统计纵坐标累加
          let after_group_height = 0
          for (let k = 0; k < i; k++) {
            after_group_height += group_list_area[k]
          }
          for (let j = 0; j < list_data.length; j++) {
            //设置每一个实例的位置
            const item = list_data[j]
            item.width = item.time_span * ceilWidth
            item.height = task_item_height

            //设置横坐标
            if (item['start_time'] < date_arr_one_level[0]['timestamp']) {
              //如果该任务的起始日期在当前查看面板日期之前，就从最左边开始摆放
              item.left = 0
            } else {
              for (let k = 0; k < date_arr_one_level.length; k++) {
                // if (isSamDay(item['start_time'], date_arr_one_level[k]['timestamp'])) { //是同一天
                //   item.left = k * ceilWidth
                //   break
                // }
                if (
                  gantt_view_mode == 'month' ||
                  gantt_view_mode == 'relative_time'
                ) {
                  //月视图下遍历得到和开始时间对的上的日期
                  if (
                    isSamDay(
                      item['start_time'],
                      date_arr_one_level[k]['timestamp']
                    )
                  ) {
                    //是同一天
                    item.left = k * ceilWidth
                    break
                  }
                } else if (gantt_view_mode == 'year') {
                  //年视图下遍历时间，如果时间戳在某个月的区间内，定位到该位置
                  if (
                    item['start_time'] <
                      date_arr_one_level[k]['timestampEnd'] &&
                    item['start_time'] >= date_arr_one_level[k]['timestamp']
                  ) {
                    // 该月之前每个月的天数+这一条的日期 = 所在的位置索引（需要再乘以单位长度才是真实位置）
                    const date_length = date_arr_one_level
                      .slice(0, k < 1 ? 1 : k)
                      .map(item => item.last_date)
                      .reduce((total, num) => total + num) //该月之前所有日期长度之和
                    const date_no = new Date(item['start_time']).getDate() //所属该月几号
                    item.left = (date_length + date_no - 1) * ceilWidth
                    break
                  }
                } else if (gantt_view_mode == 'week') {
                  if (
                    item['start_time'] <
                      date_arr_one_level[k]['timestampEnd'] &&
                    item['start_time'] >= date_arr_one_level[k]['timestamp']
                  ) {
                    const date_day = new Date(item['start_time']).getDay() //周几
                    item.left =
                      ((k + (date_day == 0 ? 1 : 0)) * 7 + date_day - 1) *
                      ceilWidth
                    break
                  }
                } else if (gantt_view_mode == 'hours') {
                  if (
                    //如果重合
                    isSamHour(
                      item['start_time'],
                      date_arr_one_level[k]['timestamp']
                    )
                  ) {
                    item.left = k * ceilWidth
                    break
                  } else {
                    //如果是在同一天，开始时间不在工作时间内
                    if (
                      isSamDay(
                        item['start_time'],
                        date_arr_one_level[k]['timestamp']
                      )
                    ) {
                      // 开始时间在工作时间之前
                      if (
                        item['start_time'] <
                          date_arr_one_level[k]['timestamp'] &&
                        date_arr_one_level[k]['date_no'] ==
                          hours_view_start_work_oclock
                      ) {
                        item.left = k * ceilWidth
                        break
                      } else if (
                        //开始时间在工作时间之后
                        item['start_time'] >
                          date_arr_one_level[k]['timestamp'] &&
                        date_arr_one_level[k]['date_no'] ==
                          hours_view_due_work_oclock - 1 &&
                        !isSamDay(item['start_time'], item['due_time'])
                      ) {
                        item.left = (k + 1) * ceilWidth
                        break
                      }
                    }
                  }
                }
              }
            }

            item.top = after_group_height + j * ceiHeight
            // 在单项目分组下
            if (
              ganttIsSingleBoardGroupView({ group_view_type, gantt_board_id })
            ) {
              if (item.row) {
                item.top =
                  after_group_height +
                  (item.row - 1) * ceiHeight +
                  hole_movedown_height +
                  getMilestoneBaseHeight({ gantt_board_id, group_view_type })
              }
            } else {
              // --------------------时间高度排序start
              if (!ganttIsOutlineView({ group_view_type })) {
                // 大纲视图不需要插入排序
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
                const all_top_max =
                  Math.max.apply(null, all_top) == -Infinity
                    ? after_group_height
                    : Math.max.apply(null, all_top)

                if (before_start_time_arr[0]) {
                  item.top = before_start_time_arr[0].top
                } else {
                  if (item.top > all_top_max) {
                    item.top = all_top_max + ceiHeight
                  }
                }
              }
              // --------------------时间高度排序end
            }
            list_group[i]['list_data'][j] = item
          }
          const list_height_arr = list_group[i]['list_data'].map(
            item => item.top
          )
          const list_group_item_height =
            Math.max.apply(null, list_height_arr) +
            extra_group_row * ceiHeight -
            after_group_height

          group_rows[i] = Math.max(
            group_rows_lock[i] || 0,
            list_group_item_height / ceiHeight,
            one_group_row_total,
            lane_row_count
          ) //(list_group_item_height / ceiHeight) < one_group_row_total ? one_group_row_total : list_group_item_height / ceiHeight // 原来是3，现在是2
          if (
            list_group[i].list_id == '0' &&
            group_view_type == '1' &&
            gantt_board_id != '0'
          ) {
            //默认分组要设置得很高,自适应
            let before_group_row = 0
            const wapper_height = document.getElementById(
              'gantt_card_out_middle'
            ).clientHeight
            if (i != 0) {
              before_group_row = group_rows
                .slice(0, i)
                .reduce((total, current) => {
                  return total + current
                })
            }
            // console.log(
            //   'before_group_row',
            //   before_group_row,
            //   Math.floor(wapper_height / ceiHeight)
            // )
            const fix_row =
              Math.ceil(wapper_height / ceiHeight) - before_group_row //+ 2
            group_rows[i] =
              Math.max.apply(null, [length, fix_row, group_rows[i]]) - 1 //group_rows[i] +30
          }
          group_list_area[i] = group_rows[i] * ceiHeight
          // 设置项目汇总的top和left,width
          if (
            ganttIsFold({
              gantt_board_id,
              group_view_type,
              show_board_fold,
              gantt_view_mode,
              group_folded
            })
          ) {
            // 全项目视图下，为收缩状态
            group_rows[i] = group_folded ? group_rows_fold_1 : group_rows_fold
            if (
              list_group[i].list_id == '0' &&
              gantt_view_mode == 'year' &&
              group_view_type != '4'
            ) {
              group_rows[i] = group_rows_fold + 30
            }
            list_group[i].board_fold_data.width =
              list_group[i].board_fold_data.time_span * ceilWidth
            list_group[i].board_fold_data.top =
              after_group_height +
              (ceil_height_fold * group_rows_fold - task_item_height_fold) / 2 +
              getMilestoneBaseHeight({ gantt_board_id, group_view_type })
            //上下居中 (96-24)/2
            for (let k = 0; k < date_arr_one_level.length; k++) {
              // if (isSamDay(list_group[i].board_fold_data['start_time'], date_arr_one_level[k]['timestamp'])) { //是同一天
              //   list_group[i].board_fold_data.left = k * ceilWidth
              //   break
              // }
              if (
                gantt_view_mode == 'month' ||
                gantt_view_mode == 'relative_time'
              ) {
                //月视图下遍历得到和开始时间对的上的日期
                if (
                  isSamDay(
                    list_group[i].board_fold_data['start_time'],
                    date_arr_one_level[k]['timestamp']
                  )
                ) {
                  //是同一天
                  list_group[i].board_fold_data.left = k * ceilWidth
                  break
                }
              } else if (gantt_view_mode == 'year') {
                //年视图下遍历时间，如果时间戳在某个月的区间内，定位到该位置
                if (
                  list_group[i].board_fold_data['start_time'] <
                    date_arr_one_level[k]['timestampEnd'] &&
                  list_group[i].board_fold_data['start_time'] >=
                    date_arr_one_level[k]['timestamp']
                ) {
                  // 该月之前每个月的天数+这一条的日期 = 所在的位置索引（需要再乘以单位长度才是真实位置）
                  const date_length = date_arr_one_level
                    .slice(0, k < 1 ? 1 : k)
                    .map(item => item.last_date)
                    .reduce((total, num) => total + num) //该月之前所有日期长度之和
                  const date_no = new Date(
                    list_group[i].board_fold_data['start_time']
                  ).getDate() //所属该月几号
                  list_group[i].board_fold_data.left =
                    (date_length + date_no - 1) * ceilWidth
                  break
                }
              } else if (gantt_view_mode == 'week') {
                if (
                  list_group[i].board_fold_data['start_time'] <
                    date_arr_one_level[k]['timestampEnd'] &&
                  list_group[i].board_fold_data['start_time'] >=
                    date_arr_one_level[k]['timestamp']
                ) {
                  const date_day = new Date(
                    list_group[i].board_fold_data['start_time']
                  ).getDay() //周几
                  list_group[i].board_fold_data.left =
                    ((k + (date_day == 0 ? 1 : 0)) * 7 + date_day - 1) *
                    ceilWidth
                  break
                }
              }
            }
            // 分组的折叠高度需要窄一点
            group_list_area[i] = group_rows[i] * ceil_height_fold
          }
        }

        const group_list_area_section_height = group_list_area.map(
          (item, index) => {
            const list_arr = group_list_area.slice(0, index + 1)
            let height = 0
            for (let val of list_arr) {
              height += val
            }
            return height
          }
        )
        // 定义一个折叠分组的数据
        const group_list_area_fold_section = list_group.map(item => {
          return {
            list_id: item.list_id,
            is_group_folded: !!(
              show_group_flod.find(val => val.list_id == item.list_id) || {}
            ).is_group_folded
          }
        })
        const group_not_allow_drag_area = []
        for (let i = 0; i < group_list_area_section_height.length; i++) {
          let start_area =
            i == 0
              ? 0
              : group_list_area_section_height[i - 1] -
                0.5 * ceiHeight +
                getMilestoneBaseHeight({ gantt_board_id, group_view_type }) -
                3 //3没有实际意义
          let end_area =
            i == 0
              ? ceiHeight
              : group_list_area_section_height[i - 1] + ceiHeight
          if (group_list_area_fold_section[i].is_group_folded) {
            // end_area = start_area
            end_area = group_list_area_section_height[i]
          }
          end_area +=
            getMilestoneBaseHeight({ gantt_board_id, group_view_type }) - 3 //分组的原本结束高度，加上在头部加上的里程碑进度栏的高度，3没有实际意义
          group_not_allow_drag_area.push({
            start_area,
            end_area
          })
        }
        // console.log('sssss', 's3', group_list_area_section_height)
        yield put({
          type: 'updateDatas',
          payload: {
            group_list_area,
            group_rows,
            list_group,
            group_list_area_section_height,
            group_list_area_fold_section,
            group_not_allow_drag_area
          }
        })
        // yield put({
        //   type: 'getGttMilestoneList',
        //   payload: {}
        // })
        yield put({
          type: 'updateGroupFoldedRelyCard',
          payload: {
            fold_arr: group_list_area_fold_section
          }
        })
      } catch (err) {
        console.log('ssss_err_2', err)
      }
      // 设置滚动条的高度位置
      // if (!not_set_scroll_top) {
      //   const group_view_type = yield select(getModelSelectDatasState('gantt', 'group_view_type'))
      //   const gantt_board_id = yield select(getModelSelectDatasState('gantt', 'gantt_board_id'))
      //   const target_scrollTop_board_storage = yield select(getModelSelectDatasState('gantt', 'target_scrollTop_board_storage'))
      //   handleChangeBoardViewScrollTop({ group_view_type, gantt_board_id, target_scrollTop_board_storage })
      // }
    },
    *handleGroupHeight({ payload }, { select, call, put }) {
      //
      let { group_rows, group_rows_lock } = payload
      const ceiHeight = yield select(workbench_ceiHeight)
      if (!group_rows) {
        group_rows = yield select(
          getModelSelectDatasState('gantt', 'group_rows')
        )
      }
      if (!group_rows_lock) {
        group_rows_lock = yield select(
          getModelSelectDatasState('gantt', 'group_rows_lock')
        )
      }
      let group_rows_ = group_rows.map((value, key) => {
        return Math.max(value, group_rows_lock[key])
      })
      let group_list_area = group_rows_.map(value => {
        return value * ceiHeight
      })
      let group_list_area_section_height = group_list_area.map(
        (item, index) => {
          const list_arr = group_list_area.slice(0, index + 1)
          let height = 0
          for (let val of list_arr) {
            height += val
          }
          return height
        }
      )
      yield put({
        type: 'updateDatas',
        payload: {
          group_list_area,
          group_rows: group_rows_,
          group_list_area_section_height,
          group_rows_lock
        }
      })
    },

    *createMilestone({ payload }, { select, call, put }) {
      //
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
      return res || {}
    },
    *getGttMilestoneList({ payload }, { select, call, put }) {
      //
      yield put({
        type: 'updateDatas',
        payload: {
          get_milestone_loading: true,
          milestoneMap: {}
        }
      })
      const Aa = yield put({
        type: 'returnContentFilterFinalParams'
      })
      const get_content_filter_params = () =>
        new Promise(resolve => {
          resolve(Aa.then())
        })
      const content_filter_params = yield call(get_content_filter_params) || {}
      // console.log('ssssssssss', { content_filter_params })

      const { query_board_ids = [] } = content_filter_params
      const gantt_board_id = yield select(
        getModelSelectDatasState('gantt', 'gantt_board_id')
      )

      const start_date = yield select(workbench_start_date)
      const end_date = yield select(workbench_end_date)
      const params = {
        start_time: Number(start_date['timestamp']) / 1000,
        end_time: Number(end_date['timestamp']) / 1000,
        _organization_id: localStorage.getItem('OrganizationId'),
        query_board_ids
      }
      if (gantt_board_id != '0') {
        //只有在确认项目对应的一个组织id,才能够进行操作
        params.board_id = gantt_board_id
      }

      const res = yield call(getGttMilestoneList, params)
      if (isApiResponseOk(res)) {
        const gantt_board_id_next_ = yield select(
          getModelSelectDatasState('gantt', 'gantt_board_id')
        )
        if (gantt_board_id_next_ !== gantt_board_id) return //当请求接口反复快速调用，时间旅行后，如果两次请求的board_id对应不上，就阻止，防止重复调用
        let _data = JSON.parse(JSON.stringify(res.data))
        for (let key in _data) {
          const milestone_arr = _data[key]
          milestone_arr.map(item => {
            let new_item = item
            const { list_ids = [] } = item
            const list_ids_length = list_ids.length
            if (list_ids_length == 0) {
              // new_item.list_id = GANTT_IDS.UNGROUPED_ID
            } else if (list_ids_length == 1) {
              new_item.list_id = item.list_ids[0]
            } else {
              new_item.list_id = GANTT_IDS.OVERLAPPING_GROUP_ID
            }
            return new_item
          })
        }
        yield put({
          type: 'updateDatas',
          payload: {
            milestoneMap: _data
          }
        })
      } else {
        message.error(res.message)
      }
      yield put({
        type: 'updateDatas',
        payload: {
          get_milestone_loading: false
        }
      })
    },
    *getContentFiterBoardTree({ payload }, { select, call, put }) {
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
              key: `board_${board_id}`
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
    *getContentFiterUserTree({ payload }, { select, call, put }) {
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
                key: `user_${org_id}_${item_group['id']}_${id}` //`user_${id}`,
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
    *getHoliday({ payload }, { select, call, put }) {
      const start_date = yield select(workbench_start_date)
      const end_date = yield select(workbench_end_date)
      const params = {
        start_time: Number(start_date['timestamp']) / 1000,
        end_time: Number(end_date['timestamp']) / 1000
      }
      const res = yield call(getHoliday, { ...params })
      // console.log('ssssss', res)
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            holiday_list: res.data
          }
        })
      }
    },
    *getAboutAppsBoards({ payload }, { select, call, put }) {
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
    *getAboutGroupBoards({ payload }, { select, call, put }) {
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
    *getAboutUsersBoards({ payload }, { select, call, put }) {
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

    *getGanttBoardsFiles({ payload }, { select, call, put }) {
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
    },
    // 代表访问过这个项目
    *handleReadedBoard({ payload }, { select, call, put }) {
      const { board_id } = payload
      const projectList = yield select(
        getModelSelectDatasState('workbench', 'projectList')
      )
      if (!projectList) return
      const projectList_new = projectList.map(item => {
        if (board_id == item.board_id) {
          item.is_new = '0'
        }
        return item
      })
      yield put({
        type: 'workbench/updateDatas',
        payload: {
          projectList: projectList_new
        }
      })
    }
  },

  reducers: {
    updateDatas(state, action) {
      const { payload = {} } = action
      const { group_view_type } = payload
      // if (group_view_type) {
      //   //视图切换时，做滚动条位置
      //   const { datas = {} } = state
      //   const {
      //     gantt_board_id: old_gantt_board_id,
      //     target_scrollTop_board_storage
      //   } = datas
      //   const { gantt_board_id: new_gantt_board_id } = payload
      //   const params = {
      //     group_view_type,
      //     gantt_board_id: new_gantt_board_id || old_gantt_board_id,
      //     target_scrollTop_board_storage
      //   }
      //   handleChangeBoardViewScrollTop(params)
      // }
      return {
        ...state,
        datas: { ...state.datas, ...action.payload }
      }
    }
  }
}
