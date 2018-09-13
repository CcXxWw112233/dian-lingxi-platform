
import React from 'react'
import indexStyles from './index.less'
import { Table, Button, Menu, Dropdown, Icon, Input, Upload, message } from 'antd';
import FileDerailBreadCrumbFileNav from './FileDerailBreadCrumbFileNav'
import {REQUEST_DOMAIN_FILE} from "../../../../../../globalset/js/constant";
import Cookies from 'js-cookie'

export default class Header extends React.Component {
  state = {}
  closeFile() {
    const { datas: { breadcrumbList = [] } }= this.props.model
    breadcrumbList.splice(breadcrumbList.length - 1, 1)
    this.props.updateDatas({isInOpenFile: false})
  }
  zoomFrame() {
    const { datas: { isExpandFrame = false } }= this.props.model
    this.props.updateDatas({
      isExpandFrame: !isExpandFrame,
    })
  }
  render() {
    const that = this
    const { datas: { isExpandFrame = false, filePreviewCurrentId, filePreviewCurrentVersionId, currentParrentDirectoryId , projectDetailInfoData = {}} }= this.props.model //isExpandFrame缩放iframe标志
    const { board_id, } = projectDetailInfoData
    //文件上传
    const uploadProps = {
      name: 'file',
      withCredentials: true,
      action: `${REQUEST_DOMAIN_FILE}/file/upload`,
      data: {
        board_id,
        folder_id: currentParrentDirectoryId,
        type: '1',
        file_version_id: filePreviewCurrentVersionId,
        upload_type: '2'
      },
      headers: {
        Authorization: Cookies.get('Authorization'),
        refreshToken : Cookies.get('refreshToken'),
      },
      beforeUpload(e) {
        if(e.size == 0) {
          message.error(`不能上传空文件`)
          return false
        }
        let loading = message.loading('正在上传...', 0)
      },
      onChange({ file, fileList, event }) {
        if (file.status === 'uploading') {

        }else{
          // message.destroy()
        }
        if (file.status === 'done') {
          message.success(`上传成功。`);
          that.props.updateDatas({filePreviewCurrentVersionKey: 0})
          that.props.fileVersionist({version_id : filePreviewCurrentVersionId, isNeedPreviewFile: true})
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
          <Upload {...uploadProps}  showUploadList={false}>
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
            <Icon type="ellipsis"  style={{fontSize:20,marginLeft:14}}/>
            <Icon type={!isExpandFrame? 'fullscreen':'fullscreen-exit'} style={{fontSize:20,marginLeft:14}} theme="outlined" onClick={this.zoomFrame.bind(this)} />
            <Icon type="close" onClick={this.closeFile.bind(this)} style={{fontSize:20,marginLeft:16}}/>
          </div>
        </div>
      </div>
    )
  }
}
