import { routerRedux } from 'dva/router';
import { getUserBoxs, getAllBoxs, boxSet, boxCancel } from '@/services/technological/simplemode'
import { MESSAGE_DURATION_TIME } from "../../globalset/js/constant";
import { isApiResponseOk } from '../../utils/handleResponseData'
import { message } from 'antd'
export default {
    namespace: 'simplemode',
    state: {
        simpleHeaderVisiable: true,
        myWorkbenchBoxsVisiable: true,
        wallpaperSelectVisiable: true,
        workbenchBoxSelectVisiable: false,
        createNewBoardVisiable: false,
        setWapperCenter: false,
        wallpaperSelectModalVisiable: false,
        chatImVisiable: false,
        workbenchBoxContentWapperModalStyle: { width: '100%' },
        myWorkbenchBoxList: [], //我的盒子列表
        workbenchBoxList: [], //所有可以选择的盒子列表
        init: true
    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(async (location) => {
                if (location.pathname.indexOf('/technological/simplemode') !== -1) {
                    const initData = async () => {
                        await Promise.all([
                            await dispatch({
                                type: 'getProjectList',
                                payload: {}
                            }),
                            // dispatch({
                            //   type: 'getBoxUsableList',
                            //   payload: {}
                            // })
                        ])
                    }
                    initData()
                }
            });
        }
    }
    ,
    effects: {
        * routingJump({ payload }, { call, put }) {
            const { route } = payload
            yield put(routerRedux.push(route));
        },
        * getMyBoxs({ payload }, { call, put }) {
            let res = yield call(getUserBoxs, {});
          
            if (isApiResponseOk(res)) {
                let { data: workbenchBoxList } = res;
                yield put({
                    type: 'updateDatas',
                    payload: {
                        myWorkbenchBoxList: myWorkbenchBoxList
                    }
                })
            } else {
                message.warn(res.message, MESSAGE_DURATION_TIME)
            }
           
            
        },
        * getAllBoxs({ payload }, { call, put }){
            let res = yield call(getAllBoxs, {});
            if (isApiResponseOk(res)) {
                let { data: workbenchBoxList } = res;
                yield put({
                    type: 'updateDatas',
                    payload: {
                        workbenchBoxList: workbenchBoxList
                    }
                })
            } else {
                message.warn(res.message, MESSAGE_DURATION_TIME)
            }
        },
        * myboxSet({ payload }, { call, put }) {
            let res = yield call(boxSet, payload);
            if (isApiResponseOk(res)) {
            
            } else {
                message.warn(res.message, MESSAGE_DURATION_TIME)
            }
        },
        * myboxCancel({ payload }, { call, put }) {
            let res = yield call(boxCancel, payload);
            if (isApiResponseOk(res)) {
            
            } else {
                message.warn(res.message, MESSAGE_DURATION_TIME)
            }
        }
    },
    reducers: {
        updateDatas(state, action) {

            return {
                ...state, ...action.payload
            }
        }
    },
}