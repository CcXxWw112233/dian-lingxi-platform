import React, { Component } from 'react'
import headerStyles from './HeaderContent.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import VisitControl from '../../routes/Technological/components/VisitControl'
import InformRemind from '@/components/InformRemind'
import VersionSwitching from '@/components/VersionSwitching'
import { connect } from 'dva'
import { compareACoupleOfObjects } from '@/utils/util'
import { checkIsHasPermissionInBoard, getSubfixName, checkIsHasPermissionInVisitControl } from "@/utils/businessFunction";
import {
  MESSAGE_DURATION_TIME,
  NOT_HAS_PERMISION_COMFIRN, PROJECT_FILES_FILE_UPDATE, PROJECT_FILES_FILE_EDIT, UPLOAD_FILE_SIZE, REQUEST_DOMAIN_FILE
} from "@/globalset/js/constant";
import { setCurrentVersionFile, updateVersionFileDescription, fileVersionist } from '@/services/technological/file'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { message, Tooltip } from 'antd'
import Cookies from "js-cookie";
import { setUploadHeaderBaseInfo } from '@/utils/businessFunction'

@connect(({ projectDetail: { projectDetailInfoData = {} } }) => ({
  projectDetailInfoData
}))
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

  // 设为主版本回调
  setCurrentVersionFile = (data) => {
    let { id, set_major_version, version_id, file_name } = data
    setCurrentVersionFile({ id, set_major_version }).then(res => {
      if (isApiResponseOk(res)) {
        setTimeout(() => {
          message.success('设置主版本成功', MESSAGE_DURATION_TIME)
        }, 500)
        this.handleUploadPDForElesFilePreview({ file_name: file_name, id })
        this.props.updateStateDatas && this.props.updateStateDatas({ filePreviewCurrentFileId: id })
      } else {
        message.warn(res.message)
      }
    })
  }

  getFileVersionist = (data) => {
    fileVersionist({...data}).then(res => {
      if (isApiResponseOk(res)) {
        setTimeout(() => {
          message.success('更新版本成功', MESSAGE_DURATION_TIME)
        }, 500)
        this.props.updateStateDatas && this.props.updateStateDatas({ filePreviewCurrentFileId: data.file_id, filePreviewCurrentVersionList: res.data })
      } else {
        message.warn(res.message)
      }
    })
  }

  // pdf文件和普通文件区别时做不同地处理预览
  handleUploadPDForElesFilePreview = ({ file_name, id }) => {
    if (getSubfixName(file_name) == '.pdf') {
      this.props.getCurrentFilePreviewData && this.props.getCurrentFilePreviewData({ id }) // 需要先获取一遍详情
      this.props.getFilePDFInfo && this.props.getFilePDFInfo({ id })
      this.props.updateStateDatas && this.props.updateStateDatas({ fileType: getSubfixName(file_name) })
    } else {
      this.props.getCurrentFilePreviewData && this.props.getCurrentFilePreviewData({ id })
    }
  }

  // 修改编辑版本描述的方法
  chgVersionFileEdit({ list, file_id, file_name }) {
    const { new_filePreviewCurrentVersionList, editValue } = this.state
    let temp_val
    let temp_filePreviewCurrentVersionList = [...new_filePreviewCurrentVersionList]
    temp_filePreviewCurrentVersionList = temp_filePreviewCurrentVersionList.map(item => {
      let new_item = item
      if (new_item.file_id == file_id) {
        temp_val = new_item.remarks
        new_item = { ...item, is_edit: !item.is_edit }
      }
      return new_item
    })
    this.setState({
      new_filePreviewCurrentVersionList: temp_filePreviewCurrentVersionList,
      editValue: temp_val
    })
  }

  // 每一个menu菜单的item选项的切换 即点击切换预览文件版本
  handleVersionItem = (e) => {
    const { key } = e
    const { new_filePreviewCurrentVersionList } = this.state
    let temp_filePreviewCurrentVersionList = [...new_filePreviewCurrentVersionList]
    temp_filePreviewCurrentVersionList = temp_filePreviewCurrentVersionList.filter(item => {
      if (item.file_id == key) {
        return item
      }
    })
    const { file_id, file_resource_id, file_name } = temp_filePreviewCurrentVersionList[0]
    this.handleUploadPDForElesFilePreview({ file_name, id: file_id })
    this.props.updateStateDatas && this.props.updateStateDatas({ fileType: getSubfixName(file_name) })
  }

  // 每一个Item的点点点 事件
  getVersionItemMenuClick = ({ list, file_id, file_name }, e) => {
    e && e.domEvent && e.domEvent.stopPropagation()
    const { currentPreviewFileData = {} } = this.props
    const { board_id } = currentPreviewFileData
    if (!checkIsHasPermissionInBoard(PROJECT_FILES_FILE_UPDATE, board_id)) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    const key = e.key
    switch (key) {
      case '1': // 设置为主版本
        const { dispatch } = this.props
        let file_resource_id = ''
        let file_version_id = ''
        let file_name = ''
        for (let val of list) {
          if (file_id == val['file_id']) {
            file_resource_id = val['file_resource_id']
            file_version_id = val['version_id']
            file_name = val['file_name']
            break
          }
        }
        // console.log({file_resource_id, file_id}, 'sssss')
        this.setState({
          imgLoaded: false
        })
        //版本改变预览
        let data = { id: file_id, set_major_version: '1', version_id: file_version_id, file_name: file_name }
        this.setCurrentVersionFile(data)

        this.setState({
          imgLoaded: false,
          editMode: true,
          currentRect: { x: 0, y: 0, width: 0, height: 0 },
          isInAdding: false,
          isInEdditOperate: false,
          mentionFocus: false,
        })
        break
      case '2':
        break
      // 编辑版本信息
      case '3':
        this.setState({
          is_edit_version_description: true
        })
        this.chgVersionFileEdit({ list, file_id, file_name })
        break
      default:
        break
    }
  }

  // 改变编辑描述的value onChange事件
  handleFileVersionValue = (list, e) => {
    let val = e.target.value
    this.setState({
      editValue: val
    })
  }

  // 失去焦点 的版本修改描述信息
  handleFileVersionDecription = (list, key) => {
    const { dispatch, } = this.props
    const { editValue, is_edit_version_description } = this.state
    let new_list = [...list]
    let temp_list = [] // 定义一个空的数组列表用来保存之前编辑状态的哪一个元素
    temp_list = new_list && new_list.filter(item => {
      let new_item = item
      if (new_item.is_edit) {
        return new_item
      }
    })
    new_list = new_list.map(item => {
      let new_item = item
      if (new_item.is_edit) {
        new_item = { ...item, is_edit: false, remarks: editValue }
        return new_item
      } else {
        return new_item
      }
    })
    const { file_id, remarks } = temp_list[0]
    this.setState({
      is_edit_version_description: false,
      new_filePreviewCurrentVersionList: new_list
    })

    if (editValue != remarks) {
      updateVersionFileDescription({ id: file_id, version_info: editValue }).then(res => {
        if (isApiResponseOk(res)) {
          setTimeout(() => {
            message.success('编辑版本信息成功', MESSAGE_DURATION_TIME)
          }, 500)
        } else {
          message.warn(res.message)
        }
      })
      this.props.updateStateDatas && this.props.updateStateDatas({ filePreviewCurrentVersionList: new_list })
      this.setState({
        editValue: ''
      })
    }
  }

  // 关于版本信息的事件 E


  render() {
    const that = this
    const { currentPreviewFileData = {}, filePreviewCurrentFileId, filePreviewCurrentVersionId, projectDetailInfoData: { data = [], folder_id } } = this.props
    const { new_filePreviewCurrentVersionList = [], is_edit_version_description, editValue } = this.state
    const { board_id, is_privilege, privileges = [] } = currentPreviewFileData
    const params = {
      filePreviewCurrentFileId,
      new_filePreviewCurrentVersionList,
      is_edit_version_description,
      editValue
    }

    const uploadProps = {
      name: 'file',
      withCredentials: true,
      action: `${REQUEST_DOMAIN_FILE}/file/version_upload`,
      data: {
        board_id,
        folder_id: folder_id,
        file_version_id: filePreviewCurrentVersionId,
      },
      headers: {
        Authorization: Cookies.get('Authorization'),
        refreshToken: Cookies.get('refreshToken'),
        ...setUploadHeaderBaseInfo({}),
      },
      beforeUpload(e) {
        if (!checkIsHasPermissionInBoard(PROJECT_FILES_FILE_UPDATE, board_id)) {
          return false
        }
        if (e.size == 0) {
          message.error(`不能上传空文件`)
          return false
        } else if (e.size > UPLOAD_FILE_SIZE * 1024 * 1024) {
          message.error(`上传文件不能文件超过${UPLOAD_FILE_SIZE}MB`)
          return false
        }
      },
      onChange({ file, fileList, event }) {
        if (!checkIsHasPermissionInBoard(PROJECT_FILES_FILE_UPDATE, board_id)) {
          message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
          return false
        }
        if (file.status === 'uploading') {

        } else {
          message.destroy()
        }
        if (file.status === 'done' && file.response.code === '0') {
          message.success(`上传成功。`);
          if (file.response && file.response.code == '0') {
            that.getFileVersionist({ version_id: filePreviewCurrentVersionId, file_id: file.response.data.id })
          }
        } else if (file.status === 'error' || (file.response && file.response.code !== '0')) {
          message.error(file.response && file.response.message || '上传失败');
          setTimeout(function () {
            message.destroy()
          }, 2000)
        }
      },
    };

    return (
      <div className={headerStyles.header_rightMenuWrapper}>
        {/* 版本信息 */}
        <div className={headerStyles.margin_right10}>
          <VersionSwitching
            {...params}
            is_show={true}
            handleVersionItem={this.handleVersionItem}
            getVersionItemMenuClick={this.getVersionItemMenuClick}
            handleFileVersionDecription={this.handleFileVersionDecription}
            handleFileVersionValue={this.handleFileVersionValue}
            uploadProps={uploadProps}
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
        {
          checkIsHasPermissionInVisitControl('edit', privileges, is_privilege, [], checkIsHasPermissionInBoard(PROJECT_FILES_FILE_EDIT, board_id)) && (
            <div className={headerStyles.margin_right10} style={{ marginTop: '4px' }}>
              <InformRemind rela_id={filePreviewCurrentFileId} rela_type={'4'} user_remind_info={data} />
            </div>
          )
        }

        {/* 全屏 */}
        <div>

        </div>
      </div>
    )
  }
}

