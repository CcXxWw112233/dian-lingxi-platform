
import React from 'react'
import indexStyles from './index.less'
import { Table, Button, Menu, Dropdown, Icon, Input, Upload, message } from 'antd';
import FileDerailBreadCrumbFileNav from './FileDerailBreadCrumbFileNav'
import {
  MESSAGE_DURATION_TIME,
  NOT_HAS_PERMISION_COMFIRN, PROJECT_FILES_FILE_DELETE, PROJECT_FILES_FILE_DOWNLOAD, PROJECT_FILES_FILE_EDIT,
  REQUEST_DOMAIN_FILE,PROJECT_FILES_FILE_UPDATE,
  UPLOAD_FILE_SIZE
} from "../../../../../../globalset/js/constant";
import Cookies from 'js-cookie'
import {checkIsHasPermissionInBoard} from "../../../../../../utils/businessFunction";


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
  fileDownload(filePreviewCurrentId) {
    if(!checkIsHasPermissionInBoard(PROJECT_FILES_FILE_DOWNLOAD)){
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    this.props.fileDownload({ids: filePreviewCurrentId})
  }
  //item操作
  operationMenuClick(data, e) {
    const { file_id, type } = data
    const { datas: { projectDetailInfoData= {},  breadcrumbList = [] } } = this.props.model
    const { board_id } = projectDetailInfoData
    const { key } = e
    switch (key) {
      case '1':
        break
      case '2':
        if(!checkIsHasPermissionInBoard(PROJECT_FILES_FILE_DOWNLOAD)){
          message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
          return false
        }
        this.props.fileDownload({ids: file_id})
        break
      case '3':
        if(!checkIsHasPermissionInBoard(PROJECT_FILES_FILE_EDIT)){
          message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
          return false
        }
        this.props.updateDatas({
          copyOrMove: '0',
          openMoveDirectoryType: '3',
          moveToDirectoryVisiblie: true,
        })
        break
      case '4':
        if(!checkIsHasPermissionInBoard(PROJECT_FILES_FILE_EDIT)){
          message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
          return false
        }
        this.props.updateDatas({
          copyOrMove: '1',
          openMoveDirectoryType: '3',
          moveToDirectoryVisiblie: true,
        })
        break
      case '5':
        if(!checkIsHasPermissionInBoard(PROJECT_FILES_FILE_DELETE)){
          message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
          return false
        }
        this.props.fileRemove({
          board_id,
          arrays: JSON.stringify([{type, id: file_id}])
        })
        breadcrumbList.splice(breadcrumbList.length - 1, 1)
        this.props.updateDatas({isInOpenFile: false})
        break
      default:
        break
    }
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
        if(!checkIsHasPermissionInBoard(PROJECT_FILES_FILE_UPDATE)){
          message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
          return false
        }
        if(e.size == 0) {
          message.error(`不能上传空文件`)
          return false
        }else if(e.size > UPLOAD_FILE_SIZE * 1024 * 1024) {
          message.error(`上传文件不能文件超过${UPLOAD_FILE_SIZE}MB`)
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
          setTimeout(function () {
            message.destroy()
          },2000)
        }
      },
    };
    const operationMenu = (data) => {
      return (
        <Menu onClick={this.operationMenuClick.bind(this, data)}>
          {/*<Menu.Item key="1">收藏</Menu.Item>*/}
          <Menu.Item key="2">下载</Menu.Item>
          <Menu.Item key="3">移动</Menu.Item>
          <Menu.Item key="4">复制</Menu.Item>
          <Menu.Item key="5" >移到回收站</Menu.Item>
        </Menu>
      )
    }

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
          <Button style={{height: 24, marginLeft:14}} onClick={this.fileDownload.bind(this, filePreviewCurrentId)}>
            <Icon type="download" />下载
          </Button>
          {/*<Button style={{height: 24, marginLeft:14}} >*/}
            {/*<Icon type="star" />收藏*/}
          {/*</Button>*/}
          <div style={{cursor: 'pointer'}}>
            <Dropdown overlay={operationMenu({ file_id: filePreviewCurrentId, type: '2' } )}>
              <Icon type="ellipsis"  style={{fontSize:20,marginLeft:14}}/>
            </Dropdown>
            <Icon type={!isExpandFrame? 'fullscreen':'fullscreen-exit'} style={{fontSize:20,marginLeft:14}} theme="outlined" onClick={this.zoomFrame.bind(this)} />
            <Icon type="close" onClick={this.closeFile.bind(this)} style={{fontSize:20,marginLeft:16}}/>
          </div>
        </div>
      </div>
    )
  }
}
