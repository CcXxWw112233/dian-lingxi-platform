
import { isApiResponseOk } from '../../../utils/handleResponseData'
import { message } from 'antd'
import { currentNounPlanFilterName } from "../../../utils/businessFunction";
import { MESSAGE_DURATION_TIME, FILES } from "../../../globalset/js/constant";
import { getSubfixName } from '../../../utils/businessFunction'
import {
  fileInfoByUrl, fileConvertPdfAlsoUpdateVersion
} from '../../../services/technological/file'

let board_id = null
let appsSelectKey = null
let card_id = null

export default {
  namespace: 'publicFileDetailModal',
  state: {
    currentPreviewFileVisible: false, // 控制该弹窗的显示隐藏
    currentInitFileId: '', // 这个是用来保存一个当前点击时初始化的ID, 可以有也可以没有, 只是作为一个标记
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
      })
    },
  },
  effects: {
    // 获取文件详情
    * fileInfoByUrl({payload}, { select, call, put }) {
      const { id } = payload
      let res = yield call(fileInfoByUrl, { id })
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            currentPreviewFileData: res.data.base_info, // 当前文件弹框的数据
            filePreviewIsUsable: res.data.preview_info.is_usable,
            filePreviewUrl: res.data.preview_info.url, // 图片的url地址
            filePreviewIsRealImage: res.data.preview_info.is_real_image, // 是否是图片
            currentPreviewFileName: res.data.base_info.file_name, // 更新当前的文件名称
            filePreviewCurrentVersionList: res.data.version_list, // 保存一个版本信息
          }
        })
        yield put({
          type: 'updateBreadcrumbList',
          payload: {
            file_id: res.data.base_info.id,
          }
        })
      }
    },
    // 更新面包屑路径
    * updateBreadcrumbList({ payload }, { select, call, put }) {
      const { file_id } = payload
      let res = yield call(fileInfoByUrl, {id: file_id})
      if (isApiResponseOk(res)) {
        let arr = []
        let target_path = res.data.target_path
        //递归添加路径
        const digui = (name, data) => {
          if(data[name]) {
            arr.push({file_name: data.folder_name, file_id: data.id, type: '1'})
            digui(name, data[name])
          }else if(data['parent_id'] == '0'){
            arr.push({file_name: '根目录', file_id: data.id, type: '1'})
          }
        }
        digui('parent_folder', target_path)
        const newbreadcrumbList = arr.reverse()
        newbreadcrumbList.push({file_name: res.data.base_info.file_name, file_id: res.data.base_info.id, type: '2', folder_id: res.data.base_info.folder_id})
        yield put({
          type: 'updateDatas',
          payload: {
            breadcrumbList: newbreadcrumbList
          }
        })
      }
    },
  },
  reducers: {
    updateDatas(state, action) {
      return {
        ...state, ...action.payload
      }
    }
  }
}