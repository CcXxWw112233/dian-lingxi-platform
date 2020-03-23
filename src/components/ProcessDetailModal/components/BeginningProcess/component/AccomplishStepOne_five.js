import React, { Component } from 'react'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { getSubfixName } from "@/utils/businessFunction";

export default class AccomplishStepOne_five extends Component {

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
          <span className={indexStyles.down_name}>下载</span>
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