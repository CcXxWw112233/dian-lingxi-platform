import React, { Component } from 'react'
import globalStyles from '@/globalset/css/globalClassName.less'
import headerStyles from './HeaderContent.less'
import { FILES } from '../../globalset/js/constant'
import { currentNounPlanFilterName, getOrgNameWithOrgIdFilter, checkIsHasPermissionInVisitControl, getSubfixName } from '@/utils/businessFunction.js'
import FileDetailBreadCrumbFileNav from './component/FileDetailBreadCrumbFileNav'
import HeaderContentRightMenu from './HeaderContentRightMenu'
import { fileInfoByUrl, getFilePDFInfo } from '@/services/technological/file'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { connect } from 'dva'
@connect()
export default class HeaderContent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      filePreviewCurrentFileId: props.filePreviewCurrentFileId
    }
  }

  // 更新该组件中的数据
  updateStateDatas = (datas) => {
    this.setState({...datas})
  }

  getCurrentFilePreviewData = ({id}) => {
    fileInfoByUrl({id}).then(res => {// 获取详情的接口
      if (isApiResponseOk(res)) {
        this.setState({
          currentPreviewFileData: res.data.base_info, // 当前文件的详情内容
          filePreviewIsUsable: res.data.preview_info.is_usable,
          filePreviewUrl: res.data.preview_info.url, // 文件路径
          filePreviewIsRealImage: res.data.preview_info.is_real_image, // 是否是真的图片
          currentPreviewFileName: res.data.base_info.file_name, // 当前文件的名称
          fileType: getSubfixName(res.data.base_info.file_name), // 文件的后缀名
          targetFilePath: res.data.target_path, // 当前文件路径
          filePreviewCurrentVersionList: res.data.version_list, // 文件的版本列表
        })
      } else {
        message.wan(res.message)
      }
    })
  }

  getFilePDFInfo = ({id}) => {
    const { currentPreviewFileData = {} } = this.state
    getFilePDFInfo({id}).then(res => {
      if (isApiResponseOk(res)) {
        this.updateStateDatas({
          filePreviewIsUsable: true,
          filePreviewUrl: res.data.edit_url,
          pdfDownLoadSrc: res.data.download_annotation_url,
          filePreviewIsRealImage: false,
          currentPreviewFileData: { ...currentPreviewFileData, id: id }
        })
      } else {
        message.wan(res.message)
      }
    })
  }

  componentDidMount() {
    const { filePreviewCurrentFileId, fileType } = this.props
    if (!filePreviewCurrentFileId) return
    this.getCurrentFilePreviewData({id:filePreviewCurrentFileId})
    if (fileType == '.pdf') {
      this.getFilePDFInfo({id:filePreviewCurrentFileId})
    }
  }

  render() {
    return (
      <div className={headerStyles.headerWrapper}>
        {/* 这里是头部左边 S */}
        <div className={headerStyles.header_left}>
          {/* 这里是头部图标样式 */}
          <div className={headerStyles.header_icon}>
            <span>
              <i className={`${globalStyles.authTheme} ${headerStyles.title_icon}`}>&#xe691;</i>
            </span>
            <span style={{fontSize: '14px'}}>
              {currentNounPlanFilterName(FILES)}
            </span>
          </div>
          {/* 这里是面包屑路径 */}
          <div>
            <FileDetailBreadCrumbFileNav 
              {...this.state} updateStateDatas={this.updateStateDatas}/></div>
        </div>
        {/* 这里是头部左边 E */}
        {/* 这里是头部右边 S */}
        <div className={headerStyles.header_right}>
          <HeaderContentRightMenu 
            {...this.state}
            filePreviewCurrentFileId={this.state.filePreviewCurrentFileId}
            updateStateDatas={this.updateStateDatas} 
            getFilePDFInfo={this.getFilePDFInfo}
            getCurrentFilePreviewData={this.getCurrentFilePreviewData}
          />
        </div>
        {/* 这里是头部右边 E */}
      </div>
    )
  }
}
