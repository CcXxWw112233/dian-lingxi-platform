import React, { Component } from 'react'
import globalStyles from '@/globalset/css/globalClassName.less'
import headerStyles from './HeaderContent.less'
import { FILES } from '../../globalset/js/constant'
import { currentNounPlanFilterName, getOrgNameWithOrgIdFilter, checkIsHasPermissionInVisitControl } from '@/utils/businessFunction.js'
import FileDetailBreadCrumbFileNav from './component/FileDetailBreadCrumbFileNav'
import HeaderContentRightMenu from './HeaderContentRightMenu'
import { fileInfoByUrl } from '@/services/technological/file'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { connect } from 'dva'
@connect()
export default class HeaderContent extends Component {

  constructor(props) {
    super(props)
    this.state = {

    }
  }
  updateDartas = (datas) => {
    this.setState({...datas})
  }
  getCurrentFilePreviewData = ({id}) => {
    fileInfoByUrl({id}).then(res => {
      if (isApiResponseOk(res)) {
        this.setState({
          currentPreviewFileData: res.data.base_info, // 当前文件的详情内容
          filePreviewIsUsable: res.data.preview_info.is_usable,
          filePreviewUrl: res.data.preview_info.url, // 文件路径
          filePreviewIsRealImage: res.data.preview_info.is_real_image, // 是否是真的图片
          currentPreviewFileName: res.data.base_info.file_name, // 当前文件的名称
          targetFilePath: res.data.target_path, // 当前文件路径
          filePreviewCurrentVersionList: res.data.version_list
        })
      }
    })
  }

  componentDidMount() {
    const { filePreviewCurrentFileId } = this.props
    if (!filePreviewCurrentFileId) return
    this.getCurrentFilePreviewData({id:filePreviewCurrentFileId})
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
              {...this.state}/></div>
        </div>
        {/* 这里是头部左边 E */}
        {/* 这里是头部右边 S */}
        <div className={headerStyles.header_right}>
          <HeaderContentRightMenu {...this.state}/>
        </div>
        {/* 这里是头部右边 E */}
      </div>
    )
  }
}
