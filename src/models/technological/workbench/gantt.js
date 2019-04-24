import { formSubmit, requestVerifyCode } from '../../../services/login'
import { isApiResponseOk } from '../../../utils/handleResponseData'
import { message } from 'antd'
import { MESSAGE_DURATION_TIME } from "../../../globalset/js/constant";
import { routerRedux } from "dva/router";
import queryString from 'query-string';
import modelExtend from 'dva-model-extend'
import technological from './index'

export default {
  namespace: 'gantt',
  state: {
    datas: {
      gold_date_arr: [], //所需要的日期数据
      date_arr_one_level: [], //所有日期数据扁平成一级数组
      start_date: {}, //日期最开始的那一天
      end_date: {}, //日期最后那一天
      list_group: [], //分组列表
      ceilWidth: 44, //单元格的宽度
      ceiHeight: 24, //单元格高度
      date_total: 0, //总天数
      group_rows: [], //每一个分组默认行数 [7, 7, 7]
      group_list_area: [], //分组高度区域 [组一行数 * ceiHeight，组二行数 * ceiHeight]
      isDragging: false, //甘特图是否在拖拽中
      target_scrollLeft: 0, //总体滚动条向左滑动位置
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname.indexOf('/technological') != -1) {
          dispatch({
            type: 'updateDatas',
            payload: {
              list_group: [
                {
                  list_name: '分组一',
                  list_id: '111',
                  list_data: [
                    {
                      start_time: 1552233600000,
                      end_time: 1552838400000,
                      start_time_string: '2019/3/11',
                      end_time_sting: '2019/3/18',
                      time_span: 7,
                      create_time: 1,
                    }, {
                      start_time: 1552233600000,
                      end_time: 1552579200000,
                      start_time_string: '2019/3/11',
                      end_time_sting: '2019/3/15',
                      time_span: 4,
                      create_time: 1,
                    }, {
                      start_time: 1552320000000,
                      end_time: 1552838400000,
                      start_time_string: '2019/3/12',
                      end_time_sting: '2019/3/18',
                      time_span: 7,
                      create_time: 3,
                    }, {
                      start_time: 1552320000000,
                      end_time: 1552579200000,
                      start_time_string: '2019/3/12',
                      end_time_sting: '2019/3/15',
                      time_span: 4,
                      create_time: 1,
                    }, {
                      start_time: 1552924800000,
                      end_time: 1553184000000,
                      start_time_string: '2019/3/19',
                      end_time_sting: '2019/3/22',
                      time_span: 4,
                      create_time: 1,
                    }, {
                      start_time: 1552924800000,
                      end_time: 1553184000000,
                      start_time_string: '2019/3/19',
                      end_time_sting: '2019/3/22',
                      time_span: 4,
                      create_time: 1,
                    }, {
                      start_time: 1552924800000,
                      end_time: 1553184000000,
                      start_time_string: '2019/3/19',
                      end_time_sting: '2019/3/22',
                      time_span: 4,
                      create_time: 1,
                    }
                  ],

                },
                {
                  list_name: '分组二',
                  list_id: '222',
                  list_data: [
                    {
                      start_time: 1552233600000,
                      end_time: 1552838400000,
                      start_time_string: '2019/3/11',
                      end_time_sting: '2019/3/18',
                      time_span: 7,
                      create_time: 1,
                    }, {
                      start_time: 1552233600000,
                      end_time: 1552579200000,
                      start_time_string: '2019/3/11',
                      end_time_sting: '2019/3/15',
                      time_span: 4,
                      create_time: 2,
                    }, {
                      start_time: 1552320000000,
                      end_time: 1552838400000,
                      start_time_string: '2019/3/12',
                      end_time_sting: '2019/3/18',
                      time_span: 7,
                      create_time: 3,
                    }, {
                      start_time: 1552320000000,
                      end_time: 1552579200000,
                      start_time_string: '2019/3/12',
                      end_time_sting: '2019/3/15',
                      time_span: 4,
                      create_time: 4,
                    }
                  ],

                },
                {
                  list_name: '分组三',
                  list_id: '333',
                  list_data: [
                    {
                      start_time: 1552233600000,
                      end_time: 1552838400000,
                      start_time_string: '2019/3/11',
                      end_time_sting: '2019/3/18',
                      time_span: 7,
                      create_time: 1,
                    }, {
                      start_time: 1552233600000,
                      end_time: 1552579200000,
                      start_time_string: '2019/3/11',
                      end_time_sting: '2019/3/15',
                      time_span: 4,
                      create_time: 2,
                    }, {
                      start_time: 1552320000000,
                      end_time: 1552838400000,
                      start_time_string: '2019/3/12',
                      end_time_sting: '2019/3/18',
                      time_span: 7,
                      create_time: 3,
                    }, {
                      start_time: 1552320000000,
                      end_time: 1552579200000,
                      start_time_string: '2019/3/12',
                      end_time_sting: '2019/3/15',
                      time_span: 4,
                      create_time: 4,
                    }
                  ],

                },
                {
                  list_name: '分组四',
                  list_id: '444',
                  list_data: [
                    {
                      start_time: 1552233600000,
                      end_time: 1552838400000,
                      start_time_string: '2019/3/11',
                      end_time_sting: '2019/3/18',
                      time_span: 7,
                      create_time: 1,
                    }, {
                      start_time: 1552233600000,
                      end_time: 1552579200000,
                      start_time_string: '2019/3/11',
                      end_time_sting: '2019/3/15',
                      time_span: 4,
                      create_time: 2,
                    }, {
                      start_time: 1552320000000,
                      end_time: 1552838400000,
                      start_time_string: '2019/3/12',
                      end_time_sting: '2019/3/18',
                      time_span: 7,
                      create_time: 3,
                    }, {
                      start_time: 1552320000000,
                      end_time: 1552579200000,
                      start_time_string: '2019/3/12',
                      end_time_sting: '2019/3/15',
                      time_span: 4,
                      create_time: 4,
                    }
                  ],

                }
              ],
              group_rows: [7, 7, 7],
            }
          })
        }else{
        }
      })
    },
  },
  effects: {
    * getDataByTimestamp({payload}, {select, call, put}){

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
