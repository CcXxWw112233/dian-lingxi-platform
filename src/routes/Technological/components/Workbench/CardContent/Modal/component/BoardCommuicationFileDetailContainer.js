import React, { Component } from 'react'
import MainContent from '@/components/FileDetailModal/MainContent.js'
import HeaderContent from '@/components/FileDetailModal/HeaderContent.js'
import Header from './Header'
import DetailContent from './DetailContent'
import { connect } from 'dva'
import { compareACoupleOfObjects } from '@/utils/util'
import { fileInfoByUrl, getFilePDFInfo } from '@/services/technological/file'
import { isApiResponseOk } from '@/utils/handleResponseData'
import { FILES, MESSAGE_DURATION_TIME } from '@/globalset/js/constant'
import { currentNounPlanFilterName, getOrgNameWithOrgIdFilter, checkIsHasPermissionInVisitControl, getSubfixName } from '@/utils/businessFunction.js'
import { message } from 'antd'

// @connect(mapStateToProps)
@connect()
export default class BoardCommuicationFileDetailContainer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      filePreviewCurrentFileId: props.filePreviewCurrentFileId,
      fileType: props.fileType
    }
  }

  onCancel = () => {
    const { is_petty_loading, is_large_loading } = this.state
    if (is_petty_loading || is_large_loading) {
      message.warn('正在进入圈评,请勿退出', MESSAGE_DURATION_TIME)
      return false
    }
    this.props.dispatch({
      type: 'publicFileDetailModal/updateDatas',
      payload: {
        filePreviewCurrentFileId: '',
        fileType: '',
        isInOpenFile: false
      }
    })
    this.props.hideUpdatedFileDetail && this.props.hideUpdatedFileDetail()
  }

  initStateDatas = ({ data }) => {
    this.setState({
      filePreviewCurrentResourceId: data.base_info.file_resource_id, // 需要保存源文件ID
      currentPreviewFileData: data.base_info, // 当前文件的详情内容
      filePreviewIsUsable: data.preview_info.is_usable,
      filePreviewUrl: data.preview_info.url, // 文件路径
      filePreviewIsRealImage: data.preview_info.is_real_image, // 是否是真的图片
      currentPreviewFileName: data.base_info.file_name, // 当前文件的名称
      fileType: getSubfixName(data.base_info.file_name), // 文件的后缀名
      targetFilePath: data.target_path, // 当前文件路径
      filePreviewCurrentVersionList: data.version_list, // 文件的版本列表
      filePreviewCurrentVersionId: data.version_list.length ? data.version_list[0]['version_id'] : '', // 保存一个当前版本ID
    })
  }

  delayUpdatePdfDatas = async ({ id }) => {
    let res = await fileInfoByUrl({ id })
    if (isApiResponseOk(res)) {
      this.initStateDatas({ data: res.data })
      await this.getFilePDFInfo({ id })
    } else {
      message.warn(res.message, MESSAGE_DURATION_TIME)
    }
  }

  // PDF文件预览的特殊处理
  getFilePDFInfo = ({ id }) => {
    const { currentPreviewFileData = {} } = this.state
    getFilePDFInfo({ id }).then(res => {
      if (isApiResponseOk(res)) {
        this.updateStateDatas({
          filePreviewIsUsable: true,
          filePreviewUrl: res.data.edit_url,
          pdfDownLoadSrc: res.data.download_annotation_url,
          filePreviewIsRealImage: false,
          currentPreviewFileData: { ...currentPreviewFileData, id: id }
        })
      } else {
        message.warn(res.message)
      }
    })
  }

  // 更新详情数据
  getCurrentFilePreviewData = ({ id }) => {
    fileInfoByUrl({ id }).then(res => {// 获取详情的接口
      if (isApiResponseOk(res)) {
        this.initStateDatas({ data: res.data })
      } else {
        message.warn(res.message)
      }
    })
  }

  // 更新该组件中的数据
  updateStateDatas = (datas) => {
    this.setState({ ...datas })
  }

  componentDidMount() {
    const { filePreviewCurrentFileId, fileType, file_detail_modal_visible } = this.props
    if (filePreviewCurrentFileId && file_detail_modal_visible) {
      if (fileType == '.pdf') {
        this.delayUpdatePdfDatas({ id: filePreviewCurrentFileId })
        return
      }
      this.getCurrentFilePreviewData({ id: filePreviewCurrentFileId })
    }
  }

  componentWillReceiveProps(nextProps) {
    const { filePreviewCurrentFileId: newFilePreviewCurrentFileId, fileType } = nextProps
    // 初始化数据
    if (compareACoupleOfObjects(this.props, nextProps)) return
    if (fileType == '.pdf') {
      this.delayUpdatePdfDatas({ id: newFilePreviewCurrentFileId })
      return
    }
    this.getCurrentFilePreviewData({ id: newFilePreviewCurrentFileId })
  }

  render() {
    const { componentHeight, componentWidth } = this.props
    const { filePreviewCurrentFileId, fileType } = this.state
    return (
      <div>
        <Header headerContent={
          <HeaderContent
            {...this.props} {...this.state} delayUpdatePdfDatas={this.delayUpdatePdfDatas}
            getCurrentFilePreviewData={this.getCurrentFilePreviewData}
            updateStateDatas={this.updateStateDatas}
            filePreviewCurrentFileId={filePreviewCurrentFileId}
            fileType={fileType}
          />
        } {...this.props} onCancle={this.onCancle} />
        <DetailContent mainContent={
          <MainContent {...this.props} {...this.state}
            delayUpdatePdfDatas={this.delayUpdatePdfDatas}
            getCurrentFilePreviewData={this.getCurrentFilePreviewData}
            updateStateDatas={this.updateStateDatas}
            filePreviewCurrentFileId={filePreviewCurrentFileId} fileType={fileType}
          />
        } {...this.props} />
      </div>
    )
  }
}

// function mapStateToProps({
//   publicFileDetailModal: {
//     filePreviewCurrentFileId,
//     fileType
//   }
// }) {
//   return {
//     filePreviewCurrentFileId,
//     fileType
//   }
// }


