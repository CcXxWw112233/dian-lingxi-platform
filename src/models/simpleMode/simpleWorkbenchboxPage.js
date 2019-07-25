import { routerRedux } from 'dva/router';
import { getUserBoxs, getAllBoxs, boxSet, boxCancel } from '@/services/technological/simplemode'
import { MESSAGE_DURATION_TIME } from "../../globalset/js/constant";
import { isApiResponseOk } from '../../utils/handleResponseData'
import { getModelSelectState } from '@/models/utils'
import { message } from 'antd'
export default {
    namespace: 'simpleWorkbenchboxPage',
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
                let { data: myWorkbenchBoxList } = res;
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
        * getAllBoxs({ payload }, { call, put }) {
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
        * myboxSet({ payload }, { call, put, select }) {
            const { id } = payload;
            let res = yield call(boxSet, payload);

            if (isApiResponseOk(res)) {
                //我的盒子列表
                let myWorkbenchBoxList = yield select(getModelSelectState("simplemode", "myWorkbenchBoxList")) || [];
                //所有的盒子列表
                let workbenchBoxList = yield select(getModelSelectState("simplemode", "workbenchBoxList")) || [];
                let newMyboxArray = workbenchBoxList.filter(item => item.id == id);
                if (newMyboxArray.lenght > 0) {
                    myWorkbenchBoxList.push(newMyboxArray[0]);
                } else {
                    let newMybox = { id };
                    myWorkbenchBoxList.push(newMybox);
                }

                yield put({
                    type: 'simplemode/updateDatas',
                    payload: {
                        myWorkbenchBoxList: [...myWorkbenchBoxList]
                    }
                });
            } else {
                message.warn(res.message, MESSAGE_DURATION_TIME)
            }
        },
        * myboxCancel({ payload }, { call, put, select }) {
            const { id } = payload;
            let res = yield call(boxCancel, payload);

            if (isApiResponseOk(res)) {
                let myWorkbenchBoxList = yield select(getModelSelectState("simplemode", "myWorkbenchBoxList")) || [];
                yield put({
                    type: 'simplemode/updateDatas',
                    payload: {
                        myWorkbenchBoxList: myWorkbenchBoxList.filter(item => item.id !== id)
                    }
                });
            } else {
                message.warn(res.message, MESSAGE_DURATION_TIME)
            }
        }
    },
    reducers: {
        updateDatas(state, action) {
            console.log("888888", action.payload);
            return {
                ...state, ...action.payload
            }
        }
    },
}