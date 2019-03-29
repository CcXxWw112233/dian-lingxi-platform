import React from 'react'
import indexstyles from '../index.less'
import { Icon } from 'antd'
import globalStyles from '../../../../../globalset/css/globalClassName.less'
import {stopPropagation, timestampToTimeNormal} from '../../../../../utils/util'
import Cookies from 'js-cookie'
import {
  checkIsHasPermission, checkIsHasPermissionInBoard, getSubfixName, openPDF,
  setStorage
} from "../../../../../utils/businessFunction";
import {message} from "antd/lib/index";
import {
  MESSAGE_DURATION_TIME, NOT_HAS_PERMISION_COMFIRN, ORG_TEAM_BOARD_QUERY, PROJECT_FILES_FILE_EDIT,
  PROJECT_FILES_FILE_INTERVIEW
} from "../../../../../globalset/js/constant";

export default class FileItem extends React.Component {
  judgeFileType(fileName) {
    let themeCode = ''
    const type = fileName.substr(fileName.lastIndexOf(".")).toLowerCase()
    switch (type) {
      case '.xls':
        themeCode = '&#xe6d5;'
        break
      case '.png':
        themeCode = '&#xe6d4;'
        break
      case '.xlsx':
        themeCode = '&#xe6d3;'
        break
      case '.ppt':
        themeCode = '&#xe6d2;'
        break
      case '.gif':
        themeCode = '&#xe6d1;'
        break
      case '.jpeg':
        themeCode = '&#xe6d0;'
        break
      case '.pdf':
        themeCode = '&#xe6cf;'
        break
      case '.docx':
        themeCode = '&#xe6ce;'
        break
      case 'txt':
        themeCode = '&#xe6cd;'
        break
      case '.doc':
        themeCode = '&#xe6cc;'
        break
      case '.jpg':
        themeCode = '&#xe6cb;'
        break
      default:
        themeCode = '&#xe6c6;'
        break
    }
    return themeCode
  }
  gotoBoardDetail({id, board_id }, e) {
    stopPropagation(e)
    setStorage('board_id', board_id)
    if(!checkIsHasPermission(ORG_TEAM_BOARD_QUERY)){
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    this.props.routingJump(`/technological/projectDetail?board_id=${board_id}&appsSelectKey=4&file_id=${id}`)
  }
  previewFile(data, e) {
    const { board_id, board_name, file_name, create_time, file_resource_id, file_id, id, folder_id } = data

    setStorage('board_id', board_id)
    if(!checkIsHasPermissionInBoard(PROJECT_FILES_FILE_INTERVIEW)){
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }

    if(getSubfixName(file_name) == '.pdf' && checkIsHasPermissionInBoard(PROJECT_FILES_FILE_EDIT)) {
      openPDF({id: id})
      return false
    }

    this.props.setPreviewFileModalVisibile()
    this.props.updateFileDatas({
      seeFileInput: 'file',
      board_id,
      filePreviewCurrentId: file_resource_id,
      currentParrentDirectoryId: folder_id,
      filePreviewCurrentFileId: id,
      filePreviewCurrentVersionId: file_id
    })
    this.props.filePreview({id: file_resource_id, file_id: id})
    this.props.fileVersionist({
      version_id: file_id,
      isNeedPreviewFile: false,
    })
    this.props.updatePublicDatas({ board_id })
    this.props.getBoardMembers({id: board_id})
  }
  render() {
    const { itemValue = {} } = this.props
    const { board_id, board_name, file_name, create_time, file_resource_id, file_id, id } = itemValue

    return (
      <div className={indexstyles.fileItem} onClick={this.previewFile.bind(this, {...itemValue})}>
        <div>
          <i className={globalStyles.authTheme} style={{fontStyle: 'normal', fontSize: 20, color: '#1890FF', cursor: 'pointer' }} dangerouslySetInnerHTML={{__html: this.judgeFileType(file_name)}}></i>
        </div>
        <div><span className={indexstyles.hoverUnderline}>{file_name}</span><span style={{marginLeft: 6, color: '#8c8c8c', cursor: 'pointer'}} onClick={this.gotoBoardDetail.bind(this, {id, board_id})}>#{board_name}</span></div>
        <div>
          {timestampToTimeNormal(create_time, '/', true) }
        </div>
      </div>
    )
  }
}
