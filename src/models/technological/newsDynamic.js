import { getNewsDynamicList } from '../../services/technological/newsDynamic'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { message, notification } from 'antd'
import { MESSAGE_DURATION_TIME } from "../../globalset/js/constant";
import { routerRedux } from "dva/router";
import { newsDynamicHandleTime, timestampToTime } from '../../utils/util'
import { selectNewsDynamicList,selectNewsDynamicListOriginal} from './select'
import Cookies from 'js-cookie'


export default {
  namespace: 'newsDynamic',
  state: [
    {}
  ],
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        // message.destroy()
        //监听新消息setMessageItemEvent 公用函数
        const evenListentNewMessage = (e) => {
          if(!Cookies.get('updateNewMessageItem') || Cookies.get('updateNewMessageItem') === 'false' ) {
            dispatch({
              type: 'updateDatas',
              payload: {
                newMessageItem: e.newValue,
                isHasNewDynamic: true,
              },
            })
            Cookies.set('updateNewMessageItem', true,{expires: 30, path: ''})
          }
        }

        if (location.pathname === '/technological/newsDynamic') {
          // console.log(1)
          dispatch({
            type: 'updateDatas',
            payload:{
              isFirstEntry: false, //是否第一次进来
              newsDynamicList: [], //存放消息记录的数组
              newsDynamicListOriginal: [],
              isHasMore: true,//是否还可以查询更多
              isHasNewDynamic: false, //是否有新消息
            }
          })
          dispatch({
            type: 'getNewsDynamicList',
            payload:{}
          })

          //监听新消息setMessageItemEvent
          window.addEventListener('setMessageItemEvent',evenListentNewMessage,false);
          // window.addEventListener("setMessageItemEvent", function (e) {
          //   // console.log(e.newValue)
          //   // console.log(localStorage.getItem('newMessage'))
          //   // console.log(localStorage.getItem('newMessage') === e.newValue)
          //
          //   // if(localStorage.getItem('newMessage') === e.newValue){
          //   //   return false
          //   // }
          //   // 当前的消息已经更新， 避免重复更新
          //   if(!Cookies.get('updateNewMessageItem') || Cookies.get('updateNewMessageItem') === 'false' ) {
          //     dispatch({
          //       type: 'updateDatas',
          //       payload: {
          //         newMessageItem: e.newValue,
          //       },
          //     })
          //     console.log(e.newValue)
          //     Cookies.set('updateNewMessageItem', true,{expires: 30, path: ''})
          //   }
          // });
        }else{
          window.removeEventListener('setMessageItemEvent',evenListentNewMessage,false);
        }
      })
    },
  },
  effects: {
    * getNewsDynamicList({ payload }, { select, call, put }) { //获取评论列表
      const { next_id } = payload
      let res = yield call(getNewsDynamicList, next_id)
      if (next_id === '0') { //重新查询的情况,将存储的newsDynamicListOriginal设置为空，重新push
        yield put({
          type: 'updateDatas',
          payload: {
            newsDynamicListOriginal:[]
          }
        })
      }
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

