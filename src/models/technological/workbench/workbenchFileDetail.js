import { isApiResponseOk } from '../../../utils/handleResponseData'
import { message } from 'antd'
import {MESSAGE_DURATION_TIME, TASKS, PROJECTS, MEMBERS} from "../../../globalset/js/constant";
import { routerRedux } from "dva/router";
import {getFileCommitPoints, getPreviewFileCommits, addFileCommit, deleteCommit, getFileList, filePreview, fileCopy, fileDownload, fileRemove, fileMove, fileUpload, fileVersionist, recycleBinList, deleteFile, restoreFile, getFolderList, addNewFolder, updateFolder, } from '../../../services/technological/file'
import Cookies from "js-cookie";
import { workbench_selectFilePreviewCommitPointNumber } from './selects'
//状态说明：
//ProjectInfoDisplay ： 是否显示项目信息，第一次进来默认，以后点击显示隐藏

// appsSelectKey 项目详情里面应用的app标志
export default {
  namespace: 'workbenchFileDetail',
  state: [{
  }],
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/technological/workbench') {
          const initialData = () => {
            dispatch({
              type: 'updateDatas',
              payload: {
                seeFileInput: 'file', //看文件的入口
                currentParrentDirectoryId: '', //当前预览文件的文件夹id
                board_id: '',
                filePreviewIsUsable: true, //文件是否可以预览标记
                filePreviewUrl: '', //预览文件url
                filePreviewCurrentId: '', //当前预览的文件resource_id
                filePreviewCurrentFileId: '', //当前预览的文件id
                filePreviewCurrentVersionId: '', //当前预览文件版本id
                filePreviewCurrentVersionList: [], //预览文件的版本列表
                filePreviewCurrentVersionKey: 0, //预览文件选中的key
                filePreviewCommits: [], //文件评论列表
                filePreviewPointNumCommits: [], //文件评论列表某个点的评论列表
                filePreviewCommitPoints: [], //文件图评点列表
                filePreviewCommitType: '0', //新增评论 1 回复圈点评论
                filePreviewCommitPointNumber: '', //评论当前的点
                filePreviewIsRealImage: true, //当前预览的图片是否真正图片
              }
            })
          }
          initialData()
        }

      })
    },
  },
  effects: {
    * filePreview({ payload }, { select, call, put }) {
      let res = yield call(filePreview, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            filePreviewIsUsable: res.data.isUsable,
            filePreviewUrl: res.data.url,
            filePreviewIsRealImage: res.data.isRealImage,
          }
        })
        const { file_id } = payload
        yield put({
          type: 'getPreviewFileCommits',
          payload: {
            id: file_id
          }
        })
        yield put({
          type: 'getFileCommitPoints',
          payload: {
            id: file_id
          }
        })

      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },

    * fileDownload({ payload }, { select, call, put }) {
      function openWin(url) {
        var element1 = document.createElement("a");
        element1.href= url;
        element1.id = 'openWin'
        document.querySelector('body').appendChild(element1)
        document.getElementById("openWin").click();//点击事件
        document.getElementById("openWin").parentNode.removeChild(document.getElementById("openWin"))
      }
      let res = yield call(fileDownload, payload)
      if(isApiResponseOk(res)) {
        const data = res.data
        if(data && data.length) {
          for (let val of data ) {
            // window.open(val)
            openWin(val)
          }
        }
      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    },
    * fileVersionist({ payload }, { select, call, put }) {
      let res = yield call(fileVersionist, payload)
      const { isNeedPreviewFile } = payload //是否需要重新读取文档
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            filePreviewCurrentVersionList: res.data,
          }
        })
        if(isNeedPreviewFile) {
          yield put({
            type: 'filePreview',
            payload: {
              id: res.data[0].file_resource_id,
              file_id: res.data[0].file_id
            }
          })
        }
      }else{

      }
    },
    * getPreviewFileCommits({ payload }, { select, call, put }) {
      const filePreviewCommitPointNumber = yield select(workbench_selectFilePreviewCommitPointNumber)
      const { type } = payload
      let name = type != 'point' ? 'filePreviewCommits':'filePreviewPointNumCommits'
      let res = yield call(getPreviewFileCommits, {...payload, point_number: type == 'point'?filePreviewCommitPointNumber: ''})

      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            [name]: res.data,
          }
        })
      }else{

      }
    },
    * getFileCommitPoints({ payload }, { select, call, put }) {
      let res = yield call(getFileCommitPoints, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            filePreviewCommitPoints: res.data,
          }
        })
      }else{

      }
    },
    * addFileCommit({ payload }, { select, call, put }) {
      let res = yield call(addFileCommit, payload)
      const { file_id, type, filePreviewCommitType = '0' } = payload
      //filePreviewCommitType 0 新增 1 回复
      if(isApiResponseOk(res)) {
        const flag = res.data.flag

        yield put({
          type: 'updateDatas',
          payload: {
            filePreviewCommitPointNumber: flag
          }
        })

        if(type == '1') {
          yield put({
            type: 'getPreviewFileCommits',
            payload: {
              id: file_id,
              type: 'point',
              point_number: flag
            }
          })
        }

        yield put({
          type: 'getPreviewFileCommits',
          payload: {
            id: file_id,
          }
        })

        yield put({
          type: 'getFileCommitPoints',
          payload: {
            id: file_id
          }
        })

      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)

      }
    },
    * deleteCommit({ payload }, { select, call, put }) {
      let res = yield call(deleteCommit, payload)
      const filePreviewCommitPointNumber = yield select(workbench_selectFilePreviewCommitPointNumber)
      const { file_id, type, point_number } = payload
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getPreviewFileCommits',
          payload: {
            id: file_id,
          }
        })

        if(type === '1') {
          yield put({
            type: 'getPreviewFileCommits',
            payload: {
              id: file_id,
              type: 'point',
              point_number: filePreviewCommitPointNumber
            }
          })
        }

        yield put({
          type: 'getFileCommitPoints',
          payload: {
            id: file_id
          }
        })

      }else{
        message.warn(res.message, MESSAGE_DURATION_TIME)

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
