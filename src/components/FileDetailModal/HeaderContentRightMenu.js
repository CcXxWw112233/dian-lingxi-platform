import React, { Component } from 'react'
import headerStyles from './HeaderContent.less'
import VisitControl from '../../routes/Technological/components/VisitControl'
import InformRemind from '@/components/InformRemind'
import VersionSwitching from '@/components/VersionSwitching'
import { connect } from 'dva'
import { compareACoupleOfObjects } from '@/utils/util'
import { checkIsHasPermissionInBoard, getSubfixName, checkIsHasPermissionInVisitControl } from "@/utils/businessFunction";

@connect()
export default class HeaderContentRightMenu extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  // 这里是更新版本列表添加一个编辑的字段
  componentWillReceiveProps(nextProps) {
    const { filePreviewCurrentVersionList = [] } = nextProps
    if (!compareACoupleOfObjects(this.props, nextProps)) {
      let new_filePreviewCurrentVersionList = [...filePreviewCurrentVersionList]
      new_filePreviewCurrentVersionList = new_filePreviewCurrentVersionList.map(item => {
        let new_item = item
        new_item = { ...item, is_edit: false }
        return new_item
      })
  
      this.setState({
        new_filePreviewCurrentVersionList,
      })
    }
  }

  // 关于版本信息的事件 S

  //pdf文件和普通文件区别时做不同地处理预览
  // handleUploadPDForElesFilePreview = ({ file_name, id, file_resource_id }) => {
  //   if (getSubfixName(file_name) == '.pdf') {
  //     this.props.dispatch({
  //       type: 'workbenchFileDetail/getFilePDFInfo',
  //       payload: {
  //         id
  //       }
  //     })
  //   } else {
  //     this.props.filePreview({ id: file_resource_id, file_id: id })
  //   }
  //   this.props.dispatch({
  //     type: 'workbenchFileDetail/updateDatas',
  //     payload: {
  //       isExpandFrame: false
  //     }
  //   })
  // }


  // 每一个menu菜单的item选项的切换 即点击切换预览文件版本
  // handleVersionItem = (e) => {
  //   const { key } = e
  //   const { dispatch } = this.props
  //   const { new_filePreviewCurrentVersionList } = this.state
  //   // const { datas: { filePreviewCurrentVersionList = [] } } = this.props.model
  //   let temp_filePreviewCurrentVersionList = [...new_filePreviewCurrentVersionList]
  //   temp_filePreviewCurrentVersionList = temp_filePreviewCurrentVersionList.filter(item => {
  //     if (item.file_id == key) {
  //       return item
  //     }
  //   })
  //   // console.log(new_filePreviewCurrentVersionList, 'sssss')
  //   const { file_id, file_resource_id, file_name } = temp_filePreviewCurrentVersionList[0]
  //   this.handleUploadPDForElesFilePreview({ file_name, id: file_id, file_resource_id })
    
  //   dispatch({
  //     type: 'workbenchFileDetail/getFileType',
  //     payload: {
  //       file_id,
  //     }
  //   })
  // }
  
  // 关于版本信息的事件 E


  render() {
    const { currentPreviewFileData = {}, filePreviewCurrentFileId } = this.props
    const { new_filePreviewCurrentVersionList = [] } = this.state
    const { board_id } = currentPreviewFileData
    const params = {
      filePreviewCurrentFileId,
      new_filePreviewCurrentVersionList
    }

    return (
      <div className={headerStyles.header_rightMenuWrapper}>
        {/* 版本信息 */}
        <div className={headerStyles.margin_right10}>
          <VersionSwitching
            {...params} 
            is_show={true}
            // handleVersionItem={this.handleVersionItem}
            // getVersionItemMenuClick={this.getVersionItemMenuClick}
            // handleFileVersionDecription={this.handleFileVersionDecription}
            // handleFileVersionValue={this.handleFileVersionValue}
            // uploadProps={uploadProps}
          />
        </div>
        {/* 另存为 */}
        <div className={headerStyles.margin_right10}>

        </div>
        {/* 访问控制 */}
        {/* <div className={headerStyles.margin_right10}>
          <VisitControl />
        </div> */}
        {/* 通知提醒 */}
        {/* <div className={headerStyles.margin_right10}>
          <InformRemind />
        </div> */}
        {/* 全屏 */}
        <div>
          
        </div>
      </div>
    )
  }
}

