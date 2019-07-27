import { getGanttData, getGttMilestoneList } from '../../../services/technological/gantt'
import { isApiResponseOk } from '../../../utils/handleResponseData'
import { message } from 'antd'
import { MESSAGE_DURATION_TIME } from "../../../globalset/js/constant";
import { routerRedux } from "dva/router";
import queryString from 'query-string';
import {isSamDay} from "../../../routes/Technological/components/Gantt/getDate";
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
import {createMilestone} from "../../../services/technological/prjectDetail";
import { getGlobalData } from '../../../utils/businessFunction';

export default {
  namespace: 'gantt',
  state: {
    datas: {
      gold_date_arr: [], //所需要的日期数据
      date_arr_one_level: [], //所有日期数据扁平成一级数组
      start_date: {}, //日期最开始的那一天
      end_date: {}, //日期最后那一天
      create_start_time: '', //创建任务开始时间
      create_end_time: '', //创建任务截至时间
      list_group: [], //分组列表
      ceilWidth: 44, //单元格的宽度
      ceiHeight: 24, //单元格高度
      date_total: 0, //总天数
      group_rows: [], //每一个分组默认行数 [7, 7, 7]
      group_list_area: [], //分组高度区域 [组一行数 * ceiHeight，组二行数 * ceiHeight]
      isDragging: false, //甘特图是否在拖拽中
      target_scrollLeft: 0, //总体滚动条向左滑动位置
      target_scrollTop: 0 ,//总体滚动条偏离顶部滑动位置
      current_list_group_id: '0', //当前选中的分组id
      milestoneMap: [], //里程碑列表
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname.indexOf('/technological') != -1) {
          dispatch({
            type: 'updateDatas',
            payload: {
              list_group: [],
              group_rows: [7, 7, 7],
            }
          })
        }else{
        }
      })
    },
  },
  effects: {
    * getGanttData({payload}, {select, call, put}){
      const { tab_board_id } = payload
      let projectTabCurrentSelectedProject = yield select(workbench_projectTabCurrentSelectedProject)

      if(tab_board_id) {
        projectTabCurrentSelectedProject = tab_board_id
      }
      const start_date = yield select(workbench_start_date)
      const end_date = yield select(workbench_end_date)
      const params = {
        start_time: start_date['timestamp'],
        end_time: end_date['timestamp'],
      }
      if(projectTabCurrentSelectedProject != '0' && projectTabCurrentSelectedProject) {
        params.board_id = projectTabCurrentSelectedProject
      }
      const res = yield call(getGanttData, params)
      if(isApiResponseOk(res)){
        yield put({
          type: 'handleListGroup',
          payload: {
            data: res.data
          }
        })
      }else {

      }
    },
    * handleListGroup({payload}, {select, call, put}){
      const { data } = payload
      let list_group = []
      const getDigit = (timestamp) => {
        if(!timestamp) {
          return 1
        }
        let new_timestamp = timestamp.toString()
        if(new_timestamp.length == 10) {
          new_timestamp = Number(new_timestamp) * 1000
        } else {
          new_timestamp = Number(new_timestamp)
        }
        return new_timestamp
      }
      for(let val of data) {
        const list_group_item = {
          ...val,
          list_name: val['lane_name'],
          list_id: val['lane_id'],
          list_data: [],
          list_no_time_data: val['lane_data']['card_no_time'] || []
        }
        for(let val_1 of val['lane_data']['card']) {
          const due_time = getDigit(val_1['due_time'])
          const start_time = getDigit(val_1['start_time'])
          const create_time = getDigit(val_1['create_time'])
          let list_data_item = {
            ...val_1,
            start_time,
            end_time: due_time,
            create_time,
            time_span: (Math.floor((due_time - start_time) / (24 * 3600 * 1000))) + 1,
          }
          list_group_item.list_data.push(list_data_item)
        }
        list_group.push(list_group_item)
      }
      yield put({
        type: 'updateDatas',
        payload: {
          list_group
        }
      })
      yield put({
        type: 'setListGroup',
        payload: {
        }
      })
    },
    * setListGroup({payload}, {select, call, put}){

      //根据所获得的分组数据转换所需要的数据
      // const { datas: { list_group = [], group_rows = [], ceiHeight, ceilWidth, date_arr_one_level = [] } } = this.props.model
      const list_group = yield select(workbench_list_group)
      const group_rows = yield select(workbench_group_rows)
      const ceiHeight = yield select(workbench_ceiHeight)
      const ceilWidth = yield select(workbench_ceilWidth)
      const date_arr_one_level = yield select(workbench_date_arr_one_level)

      const group_list_area = [] //分组高度区域

      //设置分组区域高度, 并为每一个任务新增一条
      for (let i = 0; i < list_group.length; i ++ ) {
        const list_data = list_group[i]['list_data']
        // const length = (list_data.length || 1) + 1
        const length = list_data.length < 5 ? 5 : (list_data.length + 1)
        const group_height = length * ceiHeight
        group_list_area[i] = group_height
        group_rows[i] = length
        for(let j = 0; j < list_data.length; j++) { //设置每一个实例的位置
          const item = list_data[j]
          item.width = item.time_span * ceilWidth
          item.height = 20
          //设置横坐标
          for(let k = 0; k < date_arr_one_level.length; k ++) {
            if(isSamDay (item['start_time'], date_arr_one_level[k]['timestamp'] )) { //是同一天
              item.left = k * ceilWidth
              break
            }
          }

          //设置纵坐标
          //根据历史分组统计纵坐标累加
          let after_group_height = 0
          for(let k = 0; k < i; k ++ ) {
            after_group_height += group_list_area[k]
          }
          item.top = after_group_height + j * ceiHeight

          list_group[i]['list_data'][j] = item
        }
      }

      yield put({
        type: 'updateDatas',
        payload: {
          group_list_area,
          group_rows,
          list_group
        }
      })
    },
    * createMilestone({ payload }, { select, call, put }) { //
      const res = yield call(createMilestone, payload)
      if(isApiResponseOk(res)) {
        const { board_id } = payload
        yield put({
          type: 'getGttMilestoneList',
          payload: {
            id: board_id
          }
        })
        message.success(res.message)
      }else{
        message.error(res.message)
      }
    },
    * getGttMilestoneList({ payload }, { select, call, put }) { //

      const { tab_board_id } = payload
      let projectTabCurrentSelectedProject = yield select(workbench_projectTabCurrentSelectedProject)
      const start_date = yield select(workbench_start_date)
      const end_date = yield select(workbench_end_date)
      if(tab_board_id) {
        projectTabCurrentSelectedProject = tab_board_id
      }
      const params = {
        board_id: projectTabCurrentSelectedProject,
        start_time: start_date['timestamp'],
        end_time: end_date['timestamp'],
      }

      if(getGlobalData('aboutBoardOrganizationId') == '0') { //只有在确认项目对应的一个组织id,才能够进行操作
        return
      }

      const res = yield call(getGttMilestoneList, params)
      // debugger
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            milestoneMap: res.data
          }
        })
      }else{
        message.error(res.message)
      }
    },

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
