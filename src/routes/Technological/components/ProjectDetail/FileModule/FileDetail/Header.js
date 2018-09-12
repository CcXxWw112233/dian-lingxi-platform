
import React from 'react'
import indexStyles from './index.less'
import { Table, Button, Menu, Dropdown, Icon, Input, Upload, message } from 'antd';
import FileDerailBreadCrumbFileNav from './FileDerailBreadCrumbFileNav'

export default class Header extends React.Component {
  state = {}
  closeFile() {
    this.props.updateDatas({isInOpenFile: false})
  }
  render() {
    const that = this
    const uploadProps = {
      name: 'file',
      action: '//jsonplaceholder.typicode.com/posts/',
      headers: {
        authorization: 'authorization-text',
      },
      onChange({ file, fileList, event }) {
        let loading = message.loading('正在上传...', 0)
        if (file.status === 'uploading') {
          that.setState({
            uploading: true
          })
        }
        if (file.status !== 'uploading') {
          setTimeout(loading,0);
        }
        if (file.status === 'done') {
          message.success(`上传成功。`);
        } else if (file.status === 'error') {
          message.error(`上传失败。`);
        }
      },
    };

    return (
      <div className={indexStyles.fileDetailHead}>
        <div className={indexStyles.fileDetailHeadLeft}>
          <FileDerailBreadCrumbFileNav {...this.props}/>
        </div>
        <div className={indexStyles.fileDetailHeadRight}>
          <Upload {...uploadProps} directory multiple showUploadList={false}>
            <Button style={{height: 24, marginLeft:14}}>
              <Icon type="upload" />更新版本
            </Button>
          </Upload>
          <Button style={{height: 24, marginLeft:14}} >
            <Icon type="download" />下载
          </Button>
          <Button style={{height: 24, marginLeft:14}} >
            <Icon type="star" />收藏
          </Button>
          <div style={{cursor: 'pointer'}}>
            <Icon type="ellipsis"  style={{fontSize:20,marginLeft:14}}/><Icon type="fullscreen" style={{fontSize:20,marginLeft:14}} theme="outlined" /> <Icon type="close" onClick={this.closeFile.bind(this)} style={{fontSize:20,marginLeft:16}}/>
          </div>
        </div>
      </div>
    )
  }
}
