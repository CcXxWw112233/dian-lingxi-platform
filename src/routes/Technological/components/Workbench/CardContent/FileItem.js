import React from 'react'
import indexstyles from '../index.less'
import { Icon } from 'antd'
import globalStyles from '../../../../../globalset/css/globalClassName.less'
import {stopPropagation, timestampToTimeNormal} from '../../../../../utils/util'
import Cookies from 'js-cookie'

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
  gotoBoardDetail(board_id,e) {
    stopPropagation(e)
    Cookies.set('board_id', board_id,{expires: 30, path: ''})
    this.props.routingJump('/technological/projectDetail')
  }
  previewFile(file_resource_id,e) {
    this.props.setPreviewFileModalVisibile()
    this.props.filePreview({id: file_resource_id,})
  }
  render() {
    const { itemValue = {} } = this.props
    const { board_id, board_name, file_name,create_time,file_resource_id } = itemValue

    return (
      <div className={indexstyles.fileItem} onClick={this.previewFile.bind(this, file_resource_id)}>
        <div>
          <i className={globalStyles.authTheme} style={{fontStyle: 'normal',fontSize: 20, color: '#1890FF', cursor: 'pointer' }} dangerouslySetInnerHTML={{__html: this.judgeFileType(file_name)}}></i>
        </div>
        <div><span className={indexstyles.hoverUnderline}>{file_name}</span><span style={{marginLeft: 6,color: '#8c8c8c', cursor: 'pointer'}} onClick={this.gotoBoardDetail.bind(this, board_id)}>#{board_name}</span></div>
        <div>
          {timestampToTimeNormal(create_time, '/', true) }
        </div>
      </div>
    )
  }
}
