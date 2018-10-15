import { getNewsDynamicList } from '../../services/technological/newsDynamic'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { message } from 'antd'
import { MESSAGE_DURATION_TIME } from "../../globalset/js/constant";
import { routerRedux } from "dva/router";

export default {
  namespace: 'newsDynamic',
  state: [],
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        // message.destroy()
        if (location.pathname === '/technological/newsDynamic') {
          // console.log(1)
          dispatch({
            type: 'updateDatas',
            payload:{
              isFirstEntry: false, //是否第一次进来
            }
          })
          dispatch({
            type: 'getNewsDynamicList',
            payload:{}
          })
        }else{
          // console.log(2)
        }
      })
    },
  },
  effects: {
    * getNewsDynamicList({ payload }, { select, call, put }) { //获取评论列表
      const { next_id } = payload
      let res = yield call(getNewsDynamicList, next_id)
      if(isApiResponseOk(res)) {
      }else{
      }
    },
    * routingJump({ payload }, { call, put }) {
      const { route } = payload
      yield put(routerRedux.push(route));
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
};

