import React, { Component } from 'react'
import PublicDetailModal from '@/components/PublicDetailModal'
import MainContent from './MainContent'
import HeaderContent from './HeaderContent'
import { fileInfoByUrl, getFilePDFInfo } from '@/services/technological/file'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { FILES, MESSAGE_DURATION_TIME } from '../../globalset/js/constant'
import { connect } from 'dva'
import { message } from 'antd'
import { currentNounPlanFilterName, getOrgNameWithOrgIdFilter, checkIsHasPermissionInVisitControl, getSubfixName } from '@/utils/businessFunction.js'
import { compareACoupleOfObjects } from '@/utils/util'
import { withRouter } from 'react-router-dom'
import QueryString from 'querystring'
let board_id = null
let appsSelectKey = null
let file_id = null
let folder_id = null
@connect(mapStateToProps)
class FileDetailContent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      filePreviewCurrentFileId: props.filePreviewCurrentFileId, // 保存一份当前的文件ID
      isZoomPictureFullScreenMode: false, //图评全屏模式
      onlyReadingShareModalVisible: false, //只读分享model
      onlyReadingShareData: {},
      file_detail_modal_visible: props.file_detail_modal_visible
    }
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
      let file_type = getSubfixName(res.data.base_info.file_name)
      this.initStateDatas({ data: res.data })
      if (file_type == '.pdf') {
        await this.getFilePDFInfo({ id })
      }
    } else {
      message.warn(res.message, MESSAGE_DURATION_TIME)
    }
  }

  // 有关路由跳转获取详情
  getFilePreviewInfoByUrl = () => {
    const { location, history } = this.props
    if (location.pathname.indexOf('/technological/projectDetail') !== -1) {

      const param = QueryString.parse(location.search.replace('?', ''))
      board_id = param.board_id
      appsSelectKey = param.appsSelectKey
      file_id = param.file_id
      folder_id = param.folder_id
      this.updateStateDatas({filePreviewCurrentFileId: file_id})
      if (appsSelectKey == '4') {

        if (file_id) {
          this.setState({
            file_detail_modal_visible: true
          })
          this.delayUpdatePdfDatas({id:file_id})
        }
      }

    }
  }

  componentDidMount() {
    const { filePreviewCurrentFileId, fileType, file_detail_modal_visible, shouldDidMountUpdate } = this.props
    if (filePreviewCurrentFileId && file_detail_modal_visible && shouldDidMountUpdate) {
      if (fileType == '.pdf') {
        // this.getFilePDFInfo({ id: newFilePreviewCurrentFileId })
        this.delayUpdatePdfDatas({ id: filePreviewCurrentFileId })
        return
      }
      this.getCurrentFilePreviewData({ id: filePreviewCurrentFileId })
      // this.getFilePreviewInfoByUrl()
    }
  }

  componentWillReceiveProps(nextProps) {
    const { fileType, clientHeight = '' } = this.props
    const { filePreviewCurrentFileId: newFilePreviewCurrentFileId, clientHeight: newClientHeight, file_detail_modal_visible } = nextProps
    if (clientHeight != newClientHeight) return
    if (compareACoupleOfObjects(this.props, nextProps)) return
    // this.getCurrentFilePreviewData({ id: newFilePreviewCurrentFileId })
    if (file_detail_modal_visible) {
      if (fileType == '.pdf') {
        // this.getFilePDFInfo({ id: newFilePreviewCurrentFileId })
        this.delayUpdatePdfDatas({ id: newFilePreviewCurrentFileId })
        return
      }
      this.getCurrentFilePreviewData({ id: newFilePreviewCurrentFileId })
      // this.getFilePreviewInfoByUrl()
    }
  }

  onCancel = () => {
    const { is_petty_loading, is_large_loading } = this.state
    if (is_petty_loading || is_large_loading) {
      message.warn('正在进入圈评,请勿退出', MESSAGE_DURATION_TIME)
      return false
    }
    this.props.setPreviewFileModalVisibile && this.props.setPreviewFileModalVisibile()
    this.props.dispatch({
      type: 'publicFileDetailModal/updateDatas',
      payload: {
        filePreviewCurrentFileId: '',
				fileType: ''
      }
    })
  }

  // 更新该组件中的数据
  updateStateDatas = (datas) => {
    this.setState({ ...datas })
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

  render() {
    const { clientWidth, clientHeight, file_detail_modal_visible } = this.props
    const { filePreviewCurrentFileId, fileType } = this.state
    return (
      <div>
        <PublicDetailModal
          modalVisible={file_detail_modal_visible}
          onCancel={this.onCancel}
          mainContent={
            <MainContent
              clientWidth={clientWidth}
              clientHeight={clientHeight}
              {...this.state}
              delayUpdatePdfDatas={this.delayUpdatePdfDatas}
              getCurrentFilePreviewData={this.getCurrentFilePreviewData}
              updateStateDatas={this.updateStateDatas}
              filePreviewCurrentFileId={filePreviewCurrentFileId} fileType={fileType} />}
          isNotShowFileDetailContentRightVisible={true}
          headerContent={
            <HeaderContent
              delayUpdatePdfDatas={this.delayUpdatePdfDatas}
              getCurrentFilePreviewData={this.getCurrentFilePreviewData}
              updateStateDatas={this.updateStateDatas}
              {...this.state}
              filePreviewCurrentFileId={filePreviewCurrentFileId}
              fileType={fileType} />}
        />
      </div>
    )
  }
}

export default withRouter(FileDetailContent)

FileDetailContent.defaultProps = {
  filePreviewCurrentFileId: '', // 需要一个当前的文件ID, !!!
  fileType: '', // 当前文件的后缀名, !!!
  file_detail_modal_visible: false, // 设置文件详情弹窗是否显示, 默认为 false 不显示
  setPreviewFileModalVisibile: function () { }, // 设置文件详情弹窗是否显示
  users: [], // 用户列表
  handleFileDetailChange: function () { }, // 外部修改内部弹窗数据的回调
  updateParentFileList: function () { }, // 内部数据修改后用来更新外部数据的回调
  handleDeleteFileCard: function () { }, // 删除某条文件
}

function mapStateToProps({
  simplemode: {
    chatImVisiable = false
  }
}) {
  return {
    chatImVisiable
  }
}
