import React, { Component } from 'react'
import MainContent from '@/components/FileDetailModal/MainContent.js'
import HeaderContent from '../../../../../../../components/FileDetailModal/HeaderContent.js'
import Header from './Header'
import DetailContent from './DetailContent'
import { connect } from 'dva'
import DEvent, { FILEDELETE } from '../../../../../../../utils/event'
import { compareACoupleOfObjects } from '@/utils/util'
import { fileInfoByUrl, getFilePDFInfo } from '@/services/technological/file'
import { isApiResponseOk } from '@/utils/handleResponseData'
import {
  FILES,
  MESSAGE_DURATION_TIME,
  PROJECT_FILES_FILE_UPDATE
} from '@/globalset/js/constant'
import {
  currentNounPlanFilterName,
  getOrgNameWithOrgIdFilter,
  checkIsHasPermissionInBoard,
  checkIsHasPermissionInVisitControl,
  getSubfixName
} from '@/utils/businessFunction.js'
import { message } from 'antd'
// import { Im, lx_utils } from 'lingxi-im'
const lx_utils = undefined
const Im = undefined
@connect(mapStateToProps)
export default class BoardCommuicationFileDetailContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filePreviewCurrentFileId: props.filePreviewCurrentFileId,
      fileType: props.fileType,
      fileFileUrl: ''
    }
    DEvent.addEventListener(FILEDELETE, this.onCancel)
  }

  // 获取所有版本列表的IDS
  getEveryVersionListIds = () => {
    const { filePreviewCurrentVersionList = [] } = this.state
    let Ids = []
    let new_filePreviewCurrentVersionList = [...filePreviewCurrentVersionList]
    new_filePreviewCurrentVersionList.map(item => {
      Ids.push(item.id)
    })
    return Ids
  }

  // 获取当前预览文件的版本ID
  getCurrentFilePreviewVersionId = () => {
    const {
      filePreviewCurrentVersionList = [],
      filePreviewCurrentFileId
    } = this.state
    let versionId = ''
    let new_filePreviewCurrentVersionList = [...filePreviewCurrentVersionList]
    new_filePreviewCurrentVersionList.map(item => {
      if (item.id == filePreviewCurrentFileId) {
        versionId = item.version_id
      }
    })
    return versionId
  }

  onCancel = () => {
    const { is_petty_loading, is_large_loading } = this.state
    if (is_petty_loading || is_large_loading) {
      message.warn('正在进入圈评,请勿退出', MESSAGE_DURATION_TIME)
      return false
    }
    // this.props.setPreviewFileModalVisibile && this.props.setPreviewFileModalVisibile()
    let all_version_list_Ids = this.getEveryVersionListIds()
    let currentPreviewFileVersionId = this.getCurrentFilePreviewVersionId()
    lx_utils &&
      lx_utils.setCommentData(
        currentPreviewFileVersionId ||
          (all_version_list_Ids &&
            all_version_list_Ids.length &&
            all_version_list_Ids) ||
          this.props.filePreviewCurrentFileId ||
          null
      )
    let workbenchBoxContentWapperModalStyle = { width: '100%' }
    this.props.dispatch({
      type: 'simplemode/updateDatas',
      payload: {
        chatImVisiable: false,
        workbenchBoxContentWapperModalStyle: workbenchBoxContentWapperModalStyle
      }
    })
    this.props.hideUpdatedFileDetail && this.props.hideUpdatedFileDetail()
  }

  initStateDatas = ({ data }) => {
    return new Promise(resolve => {
      this.setState(
        {
          filePreviewCurrentResourceId: data.base_info.file_resource_id, // 需要保存源文件ID
          currentPreviewFileData: data.base_info, // 当前文件的详情内容
          filePreviewIsUsable: data.preview_info.is_usable,
          filePreviewSizeExceed: data.preview_info.preview_size_limit_exceeded, //文件大小是否超出预览范围
          filePreviewUrl: data.preview_info.url, // 文件路径
          fileFileUrl: data.preview_info.preview_url, //文件真实路径
          filePreviewIsRealImage: data.preview_info.is_real_image, // 是否是真的图片
          filePreviewCurrentName: data.base_info.file_name, // 当前文件的名称
          fileType: getSubfixName(data.base_info.file_name), // 文件的后缀名
          targetFilePath: data.target_path, // 当前文件路径
          filePreviewCurrentVersionList: data.version_list, // 文件的版本列表
          filePreviewCurrentVersionId: data.version_list.length
            ? data.version_list[0]['version_id']
            : '' // 保存一个当前版本ID
        },
        () => {
          resolve()
        }
      )
    })
  }

  linkImWithFile = data => {
    const { user_set = {} } = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : {}
    const { is_simple_model } = user_set
    if (!data) {
      lx_utils && lx_utils.setCommentData(null)
      return false
    }
    lx_utils && lx_utils.setCommentData({ ...data })
    if (is_simple_model == '1') {
      const width = document.body.scrollWidth
      let workbenchBoxContentWapperModalStyle = { width: width - 400 + 'px' }
      this.props.dispatch({
        type: 'simplemode/updateDatas',
        payload: {
          chatImVisiable: true,
          workbenchBoxContentWapperModalStyle: workbenchBoxContentWapperModalStyle
        }
      })
    }
  }

  delayUpdatePdfDatas = async ({ id, calback }) => {
    let res = await fileInfoByUrl({ id })
    let currentPreviewFileVersionId = this.getCurrentFilePreviewVersionId()
    if (isApiResponseOk(res)) {
      this.initStateDatas({ data: res.data })
      let flag = checkIsHasPermissionInVisitControl(
        'edit',
        res.data.base_info.privileges,
        res.data.base_info.is_privilege,
        [],
        checkIsHasPermissionInBoard(
          PROJECT_FILES_FILE_UPDATE,
          res.data.base_info.board_id
        )
      )
      // if (flag) {
      //   await this.getFilePDFInfo({ id, calback })
      // }
      // await this.getFilePDFInfo({ id })
      // this.linkImWithFile({name: res.data.base_info.file_name, type: 'file', board_id: res.data.base_info.board_id, id: res.data.base_info.id})
    } else {
      message.warn(res.message, MESSAGE_DURATION_TIME)
      setTimeout(() => {
        this.props.hideUpdatedFileDetail && this.props.hideUpdatedFileDetail()
        lx_utils &&
          lx_utils.setCommentData(currentPreviewFileVersionId || id || null)
      }, 200)
    }
  }

  // PDF文件预览的特殊处理
  getFilePDFInfo = ({ id, calback }) => {
    const { currentPreviewFileData = {} } = this.state
    let currentPreviewFileVersionId = this.getCurrentFilePreviewVersionId()
    getFilePDFInfo({ id }).then(res => {
      if (isApiResponseOk(res)) {
        this.updateStateDatas({
          filePreviewIsUsable: true,
          filePreviewUrl: res.data.edit_url,
          pdfDownLoadSrc: res.data.download_annotation_url,
          filePreviewIsRealImage: false,
          currentPreviewFileData: { ...currentPreviewFileData, id: id },
          isPdfLoaded: false,
          is_petty_loading: false,
          is_large_loading: false
        })
        if (calback && typeof calback == 'function') calback()
        // this.linkImWithFile({name: this.props.filePreviewCurrentName, type: 'file', board_id: this.props.board_id, id: this.props.filePreviewCurrentFileId, currentPreviewFileVersionId: currentPreviewFileVersionId})
      } else {
        message.warn(res.message)
        setTimeout(() => {
          this.props.hideUpdatedFileDetail && this.props.hideUpdatedFileDetail()
          lx_utils &&
            lx_utils.setCommentData(currentPreviewFileVersionId || id || null)
        }, 200)
      }
    })
  }

  // 更新详情数据
  getCurrentFilePreviewData = ({ id }) => {
    return new Promise((resolve, reject) => {
      fileInfoByUrl({ id }).then(res => {
        // 获取详情的接口
        if (isApiResponseOk(res)) {
          this.initStateDatas({ data: res.data }).then(_ => {
            resolve(res.data)
          })

          // this.linkImWithFile({name: res.data.base_info.file_name, type: 'file', board_id: res.data.base_info.board_id, id: res.data.base_info.id, currentPreviewFileVersionId: res.data.base_info.version_id})
        } else {
          reject(res)
          message.warn(res.message)
          let currentPreviewFileVersionId = this.getCurrentFilePreviewVersionId()
          setTimeout(() => {
            this.props.hideUpdatedFileDetail &&
              this.props.hideUpdatedFileDetail()
            lx_utils &&
              lx_utils.setCommentData(currentPreviewFileVersionId || id || null)
          }, 500)
        }
      })
    })
  }

  // 更新该组件中的数据
  updateStateDatas = datas => {
    this.setState({ ...datas })
  }

  componentDidMount() {
    const {
      filePreviewCurrentFileId,
      fileType,
      file_detail_modal_visible,
      filePreviewCurrentName,
      board_id
    } = this.props
    if (filePreviewCurrentFileId && file_detail_modal_visible) {
      if (fileType == '.pdf') {
        this.delayUpdatePdfDatas({ id: filePreviewCurrentFileId })
        // this.linkImWithFile({name: filePreviewCurrentName, type: 'file', board_id: board_id, id: filePreviewCurrentFileId})
        return
      }
      this.getCurrentFilePreviewData({ id: filePreviewCurrentFileId })
      let that = this
      // if (Im) {
      //   Im.on('fileCancel', function({ id }) {
      //     if (id == that.props.filePreviewCurrentFileId) {
      //       that.onCancel()
      //     }
      //   })
      // }
      // this.linkImWithFile({name: filePreviewCurrentName, type: 'file', board_id: board_id, id: filePreviewCurrentFileId})
    }
  }

  // 可以不用判断项目交流中打开了其他文件,关闭后文件评论还存在
  componentWillReceiveProps(nextProps) {
    const { isInOpenFile } = nextProps
    const { isInOpenFile: oldOpenFile } = this.props
    let that = this
    if (isInOpenFile == false && oldOpenFile == true) {
      let currentPreviewFileVersionId = this.getCurrentFilePreviewVersionId()
      this.props.hideUpdatedFileDetail && this.props.hideUpdatedFileDetail()
      let all_version_list_Ids = this.getEveryVersionListIds()
      lx_utils &&
        lx_utils.setCommentData(
          currentPreviewFileVersionId ||
            (all_version_list_Ids &&
              all_version_list_Ids.length &&
              all_version_list_Ids) ||
            null
        )
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'simplemode/updateDatas',
      payload: {
        chatImVisiable: false,
        workbenchBoxContentWapperModalStyle: { width: '100%' }
      }
    })
    DEvent.removeEventListener(FILEDELETE, this.onCancel)
  }

  render() {
    const { componentHeight, componentWidth } = this.props
    const { filePreviewCurrentFileId, fileType } = this.state
    return (
      <div>
        <Header
          headerContent={
            <HeaderContent
              {...this.props}
              {...this.state}
              delayUpdatePdfDatas={this.delayUpdatePdfDatas}
              getCurrentFilePreviewData={this.getCurrentFilePreviewData}
              updateStateDatas={this.updateStateDatas}
              filePreviewCurrentFileId={filePreviewCurrentFileId}
              fileType={fileType}
              onFullScreen={this.props.onFull}
              whetherUpdateFolderListData={
                this.props.whetherUpdateFolderListData
              }
            />
          }
          {...this.props}
          onCancel={this.onCancel}
        />
        <DetailContent
          mainContent={
            <MainContent
              linkImWithFile={this.linkImWithFile}
              {...this.props}
              {...this.state}
              delayUpdatePdfDatas={this.delayUpdatePdfDatas}
              getCurrentFilePreviewData={this.getCurrentFilePreviewData}
              updateStateDatas={this.updateStateDatas}
              filePreviewCurrentFileId={filePreviewCurrentFileId}
              fileType={fileType}
            />
          }
          {...this.props}
        />
      </div>
    )
  }
}

function mapStateToProps({
  publicFileDetailModal: {
    // filePreviewCurrentFileId,
    // fileType,
    isInOpenFile
  },
  technological: {
    datas: { userOrgPermissions, userBoardPermissions }
  }
}) {
  return {
    // filePreviewCurrentFileId,
    // fileType,
    isInOpenFile,
    userOrgPermissions,
    userBoardPermissions
  }
}
