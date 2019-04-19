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
      list_group: [], //分组列表
      ceilWidth: 44, //单元格的宽度
      ceiHeight: 24, //单元格高度
      date_total: 0, //总天数
      group_rows: [7, 7, 7], //每一个分组默认行数
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname.indexOf('/technological') != -1) {
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
