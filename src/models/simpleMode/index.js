import { routerRedux } from 'dva/router';
import { getUserBoxs,getAllBoxs} from '@/services/technological/simplemode'

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
        myWorkbenchBoxList: [],//我的盒子列表
        workbenchBoxList:[],//所有可以选择的盒子列表
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
        * getBoxs({ payload }, { call, put }) {
            const myWorkbenchBoxList = yield call(getUserBoxs, {});
            const workbenchBoxList = yield call(getAllBoxs, {});
            put({
                type: 'updateDatas',
                payload: {
                    myWorkbenchBoxList: myWorkbenchBoxList,
                    workbenchBoxList: workbenchBoxList
                }
            })
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