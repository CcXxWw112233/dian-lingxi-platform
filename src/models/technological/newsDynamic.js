import { getNewsDynamicList } from '../../services/technological/newsDynamic'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { message } from 'antd'
import { MESSAGE_DURATION_TIME } from "../../globalset/js/constant";
import { routerRedux } from "dva/router";
import { newsDynamicHandleTime, timestampToTime } from '../../utils/util'
import { selectNewsDynamicList,selectNewsDynamicListOriginal} from './select'

export default {
  namespace: 'newsDynamic',
  state: [
    {}
  ],
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
              newsDynamicList: [], //存放消息记录的数组
              newsDynamicListOriginal: [],
              isHasMore: true,//是否还可以查询更多
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
      let newsDynamicList = []//yield select(selectNewsDynamicList)
      let newsDynamicListOriginal = yield select(selectNewsDynamicListOriginal)
      if(isApiResponseOk(res)) {
        //将所得到的数据进行日期分类
        newsDynamicListOriginal.push(...res.data.list)
        const data = newsDynamicListOriginal//res.data.list
        let dateArray = []
        let newDataArray = []
        for(let i = 0; i < data.length; i++) {
          dateArray.push(timestampToTime(data[i].map['create_time']))
        }
        dateArray = Array.from(new Set(dateArray))
        for (let i = 0; i < dateArray.length; i++) {
          const obj = {
            date: dateArray[i],
            dataList: [],
          }
          for(let j = 0; j < data.length ; j++) {
            if(dateArray[i] === timestampToTime(data[j].map['create_time'])) {
              obj['dataList'].push(data[j])
            }
          }
          newDataArray.push(obj)
        }

        newsDynamicList.push(...newDataArray)
        // console.log(1,newsDynamicList)
        // for(let i = 0; i < newsDynamicList.length; i++){
        //   const dataList = newsDynamicList[i]['dataList']
        //   let t = 0
        //   for (let j = 0; j < dataList.length; j++) {
        //     if (dataList[j].map['type'] === '2') {
        //       if(dataList[j].map['activity_type_id'] === dataList[j + 1].map['activity_type_id']) {
        //         // console.log(j)
        //       }
        //     }
        //   }
        // }
        // console.log(2,newsDynamicList)
        yield put({
          type: 'updateDatas',
          payload: {
            newsDynamicList,//: res.data,
            newsDynamicListOriginal,
            next_id: res.data.next_id,
            isHasMore: res.data.list.length ? true: false
          }
        })
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

