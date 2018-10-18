import { getNewsDynamicList, addCardNewComment } from '../../services/technological/newsDynamic'
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
            console.log(e.newValue)
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
          console.log(1)
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
          console.log(2)
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
        //-------------2018.10.18修改合并相邻相近任务
        let newsDynamicListTransform = JSON.parse(JSON.stringify(newsDynamicList));//[...newsDynamicList]
        //将相邻且activity_type_id相同而且type等于固定类型的归为一条
        const  removeEmptyArrayEle = (arr) => {
          for(var i = 0; i < arr.length; i++) {
            if(arr[i] == undefined) {
              arr.splice(i,1);
              i = i - 1; // i - 1 ,因为空元素在数组下标 2 位置，删除空之后，后面的元素要向前补位，
              // 这样才能真正去掉空元素,觉得这句可以删掉的连续为空试试，然后思考其中逻辑
            }
          }
          return arr;
        };
        for(let i = 0; i < newsDynamicListTransform.length; i++){
          const dataList = newsDynamicListTransform[i]['dataList']
          newsDynamicListTransform[i]['newDataList'] = []
          let isNearKeyTypeTwo = [] //与key相近的值是否有 activity_type_id相同而且type等于固定类型的归为一条,任务
          let isNearKeyTypeThree = []//与key相近的值是否有 activity_type_id相同而且type等于固定类型的归为一条,评论
          dataList.map((value, key) => {
            if(isNearKeyTypeTwo.indexOf(key) !== -1) {
              return false
            }
            if(value.map['type'] === '2') { //处理任务
              let TypeArrayList = []
              for (let j = key; j < dataList.length - 1; j++) {
                if(dataList[j].map['type'] === '2' && dataList[j].map['activity_type_id'] === dataList[j + 1].map['activity_type_id'] || ( dataList[j].map['type'] === '2' && j > 0 && dataList[j].map['activity_type_id'] === dataList[j - 1].map['activity_type_id'])) {
                  isNearKeyTypeTwo.push(j)
                  TypeArrayList.push(dataList[j])
                }else {
                  break
                }
              }
              newsDynamicListTransform[i]['newDataList'][key] = { type: '2',TypeArrayList }
            }else if(value.map['type'] === '3'){ //处理评论
              let TypeArrayList = []
              for (let j = key; j < dataList.length - 1; j++) {
                if(dataList[j].map['type'] === '3' && dataList[j].map['activity_type_id'] === dataList[j + 1].map['activity_type_id'] || ( dataList[j].map['type'] === '3' && j > 0 && dataList[j].map['activity_type_id'] === dataList[j - 1].map['activity_type_id'])) {
                  isNearKeyTypeTwo.push(j)
                  TypeArrayList.push(dataList[j])
                }else {
                  break
                }
              }
              newsDynamicListTransform[i]['newDataList'][key] = { type: '3',TypeArrayList }
            }else {
              newsDynamicListTransform[i]['newDataList'][key] = { type: value.map['type'] ,TypeArrayList: [dataList[key]] }
            }
          })
          //已经合并的任务存在了，但是未合并的单条任务没有存进来，需要手动添加
          for(let k = 0; k < newsDynamicListTransform[i]['newDataList'].length; k++) {
            const newDataList = newsDynamicListTransform[i]['newDataList'][k]
            if(newDataList && newDataList['type'] === '2' && !newDataList['TypeArrayList'].length) {
              newDataList['TypeArrayList'] = [newsDynamicListTransform[i]['dataList'][k]]
            }else if(newDataList && newDataList['type'] === '3' && !newDataList['TypeArrayList'].length){
              newDataList['TypeArrayList'] = [newsDynamicListTransform[i]['dataList'][k]]
            }
          }
          newsDynamicListTransform[i]['newDataList'] = removeEmptyArrayEle(newsDynamicListTransform[i]['newDataList']) //去除空数组
        }
        //-------------2018.10.18修改合并相邻相近任务结束
        console.log(2,newsDynamicListTransform)
        yield put({
          type: 'updateDatas',
          payload: {
            newsDynamicList: newsDynamicListTransform,//: newsDynamicList,
            newsDynamicListOriginal,
            next_id: res.data.next_id,
            isHasMore: res.data.list.length ? true: false
          }
        })
      }else{
      }
    },
    * addCardNewComment({ payload }, { select, call, put }) { //
      const { card_id, comment, parentKey, childrenKey } = payload
      let res = yield call(addCardNewComment, { card_id, comment })
      if(isApiResponseOk(res)) {
        // 将评论的内容添加到前面
        const newsDynamicList = yield select(selectNewsDynamicList)
        let newItem = JSON.parse(JSON.stringify(newsDynamicList[parentKey]['newDataList'][childrenKey]['TypeArrayList'][0]))
        const { user_name, full_name,mobile,email, avatar } = JSON.parse(Cookies.get('userInfo'))
        newItem['user_name'] = full_name || mobile || email
        newItem['avatar'] = avatar
        newItem['cardComment']['text'] = comment
        newsDynamicList[parentKey]['newDataList'][childrenKey]['TypeArrayList'].unshift(newItem)
        // console.log(res)
        yield put({
          type: 'updateDatas',
          payLoad: {
            newsDynamicList
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

