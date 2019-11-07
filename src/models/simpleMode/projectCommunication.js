import { getCommunicationTreeListData, getProjectList, getOnlyThumbnailFileList } from '@/services/technological/projectCommunication';
// import { getProjectList } from '@/services/technological/workbench'
import { getFolderList } from '@/services/technological/file';
import { isApiResponseOk } from '@/utils/handleResponseData';
import { message } from 'antd';

export default {
    // 项目交流
    namespace: 'projectCommunication',
    state: {
        // count: 0,
        // boards_flies: [], //带根目录文件列表的项目列表
        currentBoardDetail: undefined, // 当前板块项目详情
        communicationProjectListData: [], // 项目交流-项目文件目录数据
        communicationSubFolderData: [], // 当前目录下树结构数据
        currentBoardId: '0', // 当前项目id
        onlyFileList: [], // 文件列表（只有文件）
        onlyFileTableLoading: false, // 文件列表table loading
    },
  
    subscriptions: {
      setup({ dispatch, history }) {
        history.listen((location) => {
            if (location.pathname.indexOf('/technological/simplemode') !== -1) {
            }
        });
      }
    },
  
    effects: {
      // *fetch({ payload }, { call, put }) {  // eslint-disable-line
      //   yield put({ type: 'save' });
      // },

      // * getCommunicationTreeList({ payload }, { select, call, put }) {
      //     // const res = yield call(getCommunicationTreeListData, payload);
      //     const res = yield call(getFolderList, payload);
      //     if (isApiResponseOk(res)) {
      //       yield put({
      //         type: 'updateDatas',
      //         payload: {
      //           // boards_flies: res.data,
      //           communicationProjectListData: res.data,
      //         }
      //       })
      //     } else {
    
      //     }
      // },

      // 获取文件-项目list
      * getProjectList({ payload }, { select, call, put }) {
        let res = yield call(getProjectList, payload)
        if (isApiResponseOk(res)) {
          yield put({
            type: 'updateDatas',
            payload: {
              communicationProjectListData: res.data
            }
          })
        } else {
  
        }
      },

      // 获取当前项目内的-所有文件
      * getFolderList({ payload }, { select, call, put }) {
          // const res = yield call(getCommunicationTreeListData, payload);
          const res = yield call(getFolderList, payload);
          if (isApiResponseOk(res)) {
            yield put({
              type: 'updateDatas',
              payload: {
                // boards_flies: res.data,
                communicationSubFolderData: res.data,
              }
            })
          } else {
    
          }
      },

      // 查询文件列表-（只有文件）
      * getOnlyFileList({ payload }, { select, call, put }) {
          yield put({
            type: 'updateDatas',
            payload: {
              // boards_flies: res.data,
              onlyFileTableLoading: true,
            }
          })
          const res = yield call(getOnlyThumbnailFileList, payload);
          if (isApiResponseOk(res)) {
            yield put({
              type: 'updateDatas',
              payload: {
                // boards_flies: res.data,
                onlyFileList: res.data,
                onlyFileTableLoading: false,
              }
            })
          } else {
    
          }
      },

    },
  
    reducers: {
      updateDatas(state, action) {
          return {
              ...state, ...action.payload
          }
      }
    //   add(state, action){
    //       const newState = {
    //         ...state,
    //         count: state.count +1
    //       };
    //       console.log('state', newState);
    //       return { ...newState, ...action.payload };
    //   },
    //   minus(state, action){
    //     const newState = {
    //         ...state,
    //         count: state.count -1
    //       };
    //       console.log('state', newState);
    //       return { ...newState, ...action.payload };
    //   },
    },
  
  };