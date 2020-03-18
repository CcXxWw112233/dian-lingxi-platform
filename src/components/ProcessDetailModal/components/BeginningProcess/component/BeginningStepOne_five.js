import React, { Component } from 'react'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { getSubfixName } from "@/utils/businessFunction";

export default class BeginningStepOne_five extends Component {

  judgeFileType(fileName) {
    let themeCode = ''
    const type = getSubfixName(fileName)
    switch (type) {
      case '.xls':
        themeCode = '&#xe65c;'
        break
      case '.png':
        themeCode = '&#xe69a;'
        break
      case '.xlsx':
        themeCode = '&#xe65c;'
        break
      case '.ppt':
        themeCode = '&#xe655;'
        break
      case '.pptx':
        themeCode = '&#xe650;'
        break
      case '.gif':
        themeCode = '&#xe657;'
        break
      case '.jpeg':
        themeCode = '&#xe659;'
        break
      case '.pdf':
        themeCode = '&#xe651;'
        break
      case '.docx':
        themeCode = '&#xe64a;'
        break
      case '.txt':
        themeCode = '&#xe654;'
        break
      case '.doc':
        themeCode = '&#xe64d;'
        break
      case '.jpg':
        themeCode = '&#xe653;'
        break
      case '.mp4':
        themeCode = '&#xe6e1;'
        break
      case '.mp3':
        themeCode = '&#xe6e2;'
        break
      case '.skp':
        themeCode = '&#xe6e8;'
        break
      case '.gz':
        themeCode = '&#xe6e7;'
        break
      case '.7z':
        themeCode = '&#xe6e6;'
        break
      case '.zip':
        themeCode = '&#xe6e5;'
        break
      case '.rar':
        themeCode = '&#xe6e4;'
        break
      case '.3dm':
        themeCode = '&#xe6e0;'
        break
      case '.ma':
        themeCode = '&#xe65f;'
        break
      case '.psd':
        themeCode = '&#xe65d;'
        break
      case '.obj':
        themeCode = '&#xe65b;'
        break
      case '.bmp':
        themeCode = '&#xe6ee;'
        break
      default:
        themeCode = '&#xe660;'
        break
    }
    return themeCode
  }

  getEllipsisFileName = (name) => {
    // wx6535e025f795dca9.o6zAJs5_pqZsbrr7sJng7qkxKKbM.ZhMftVUvAIJ9b5dcb721199c1b8f4f84b0954a80e589.png
    // let str = 'wx6535e025f795dca9.o6zAJs5_pqZsbrr7sJng7qkxKKbM.ZhMftVUvAIJ9b5dcb721199c1b8f4f84b0954a80e589.png'
    let str = name
    if (!name) return
    let arr = str.split('.')
    arr.splice(-1,1)
    arr.join('.')
    return arr
  }

  renderFileTypeArrayText = () => {
    const { itemValue } = this.props
    const { limit_file_type = [] } = itemValue
    const fileTypeArray = [...limit_file_type]
    let fileTypeArrayText = [] //文档类型转化中文
    for (let i = 0; i < fileTypeArray.length; i++) {
      if (fileTypeArray[i] === 'document') {
        fileTypeArrayText.push('文档')
      } else if (fileTypeArray[i] === 'image') {
        fileTypeArrayText.push('图像')
      } else if (fileTypeArray[i] === 'audio') {
        fileTypeArrayText.push('音频')
      } else if (fileTypeArray[i] === 'video') {
        fileTypeArrayText.push('视频')
      }
    }
    return fileTypeArrayText.join('、')
  }

  renderFileList = () => {
    let file_name = '资料收集详细要求求.doc'
    return (
      <div className={indexStyles.file_item}>
        <div style={{display: 'flex', alignItems: 'center', flex: '1'}}>
          <span className={`${globalStyles.authTheme} ${indexStyles.file_theme_code}`}>&#xe64d;</span>
          <span className={indexStyles.file_name}><span style={{maxWidth: '874px', display: 'inline-block', overflow: 'hidden',  whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{this.getEllipsisFileName(file_name)}</span>{getSubfixName(file_name)}</span>
        </div>
        <div style={{flexShrink: 0}}>
          <span className={indexStyles.del_name}>删除</span>
        </div>
      </div>
    )
  }

  render() {
    const { itemValue } = this.props
    const { title, limit_file_num, limit_file_type, limit_file_size, is_required } = itemValue
    return (
      <div className={indexStyles.text_form}>
        <p>{title}:&nbsp;&nbsp;{is_required == '1' && <span style={{ color: '#F5222D' }}>*</span>}</p>
        <div className={indexStyles.upload_static}>
          <span style={{ color: '#1890FF', fontSize: '28px', marginTop: '-6px' }} className={`${globalStyles.authTheme}`}>&#xe692;</span>
          <div style={{ flex: 1, marginLeft: '12px' }}>
            <div className={indexStyles.file_drap_tips}>点击或拖拽文件到此开始上传</div>
            <div className={indexStyles.file_layout}>{limit_file_size == 0 ? `不限制大小` : `${limit_file_size}MB以内`}、{limit_file_num == 0 ? `不限制数量` : `最多${limit_file_num}个`}、 {this.renderFileTypeArrayText()}格式</div>
          </div>
        </div>
        {this.renderFileList()}
      </div>
    )
  }
}
