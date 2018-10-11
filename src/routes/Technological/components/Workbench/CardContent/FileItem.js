import React from 'react'
import indexstyles from '../index.less'
import { Icon } from 'antd'
import globalStyles from '../../../../../globalset/css/globalClassName.less'

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
        themeCode = ''
        break
    }
    return themeCode
  }
  render() {
    const { itemValue = {} } = this.props
    const { is_realize } = itemValue
    return (
      <div className={indexstyles.fileItem}>
        <div>
          <i className={globalStyles.authTheme} style={{fontStyle: 'normal',fontSize: 20, color: '#1890FF', cursor: 'pointer' }} dangerouslySetInnerHTML={{__html: this.judgeFileType('ss.jpg')}}></i>
        </div>
        <div>奥斯陆电话卡警方很快就爱好疯狂电话卡<span style={{marginLeft: 6,color: '#8c8c8c', cursor: 'pointer'}}>#项目A</span></div>
        <div>
          2018-12-12 12:12
        </div>
      </div>
    )
  }
}
