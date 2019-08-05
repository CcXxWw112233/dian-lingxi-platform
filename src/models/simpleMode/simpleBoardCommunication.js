import { routerRedux } from 'dva/router';
import { getFileList, getBoardFileList} from '@/services/technological/file'
import { projectDetailInfo } from '@/services/technological/prjectDetail'
import { MESSAGE_DURATION_TIME } from "../../globalset/js/constant";
import { isApiResponseOk } from '../../utils/handleResponseData'
import { getModelSelectState } from '@/models/utils'
import {
    checkIsHasPermission, checkIsHasPermissionInBoard, getSubfixName,
    setBoardIdStorage
} from "@/utils/businessFunction";
import { message } from 'antd'
export default {
    namespace: 'simpleBoardCommunication',
    state: {
        boardFileTreeData: [],
        boardFolderTreeData: []
    },
    subscriptions: {
      
    },
    effects: {

    },
    reducers: {
        updateDatas(state, action) {
            return {
                ...state, ...action.payload
            }
        }
    },
}