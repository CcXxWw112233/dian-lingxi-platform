import { routerRedux } from 'dva/router';
import { getFileList } from '@/services/technological/file'
import { projectDetailInfo } from '@/services/technological/prjectDetail'
import { MESSAGE_DURATION_TIME } from "../../globalset/js/constant";
import { isApiResponseOk } from '../../utils/handleResponseData'
import { getModelSelectState } from '@/models/utils'
import { message } from 'antd'
export default {
    namespace: 'simpleWorkbenchbox',
    state: {
        boardListData: [],
        currentBoardDetail: undefined,
        boardFileListData: {},

    },
    subscriptions: {

    }
    ,
    effects: {
        * routingJump({ payload }, { call, put }) {
            const { route } = payload
            yield put(routerRedux.push(route));
        },
        * getFileList({ payload }, { call, put }) {
            const { folder_id, board_id } = payload;
            const res = yield call(getFileList, { folder_id, boardId: board_id });
            console.log("res", res);
            if (isApiResponseOk(res)) {
                yield put({
                    type: 'updateDatas',
                    payload: {
                        boardFileListData: res.data
                    }
                });
            } else {
                message.warn(res.message, MESSAGE_DURATION_TIME)
            }
        },
        * getBoardDetail({ payload }, { call, put }) {
            //debugger
            const { id } = payload;
            const res = yield call(projectDetailInfo, id);
            if (isApiResponseOk(res)) {
                yield put({
                    type: 'updateDatas',
                    payload: {
                        currentBoardDetail: res.data
                    }
                });
            } else {
                message.warn(res.message, MESSAGE_DURATION_TIME)
            }
        },

        * loadBoardFileInitData({ payload }, { call, put }) {
            console.log("初始化数据");
            const { id } = payload;
            yield put({
                type: 'projectDetailFile/initialget',
                payload: {
                    id: id
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