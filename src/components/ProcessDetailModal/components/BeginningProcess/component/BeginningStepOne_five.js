import React, { Component } from 'react'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Upload, message } from 'antd'
import { connect } from 'dva'
import axios from 'axios'
import Cookies from 'js-cookie'
import {
  getSubfixName, setUploadHeaderBaseInfo, checkIsHasPermissionInBoard
} from "@/utils/businessFunction";
import {
  MESSAGE_DURATION_TIME, NOT_HAS_PERMISION_COMFIRN, PROJECT_TEAM_CARD_ATTACHMENT_UPLOAD, PROJECT_TEAM_BOARD_CONTENT_PRIVILEGE, PROJECT_FILES_FILE_INTERVIEW, UPLOAD_FILE_SIZE
} from "@/globalset/js/constant";
import _ from "lodash";

let uploadMaxFileSize = []
@connect(mapStateToProps)
export default class BeginningStepOne_five extends Component {

  constructor(props) {
    super(props)
    this.state = {
      fileList: []
    }
  }

  updateEdit = (data, key) => {
    const { itemKey, parentKey, processEditDatas = [] } = this.props
    const { forms = [] } = processEditDatas[parentKey]
    forms[itemKey][key] = data.value
    this.props.updateCorrespondingPrcodessStepWithNodeContent && this.props.updateCorrespondingPrcodessStepWithNodeContent('forms', forms)
  }

  onBeforeUpload = (file, fileList) => {
    const { board_id, limit_file_num } = this.props
    console.log(fileList.length,'sssssssssssssssssssssssssss_length')
    this.setState({
      uploading: true,
    });
    if (fileList.length > limit_file_num) {
      message.warn(`最多为${limit_file_num}个文件`)
      return false
    }
    // if (!checkIsHasPermissionInBoard(PROJECT_TEAM_CARD_ATTACHMENT_UPLOAD, board_id)) {
    //   message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
    //   return false
    // }
    const { size } = file
    uploadMaxFileSize.push(size)
    let sum = 0
    for (let i = 0; i < uploadMaxFileSize.length; i++) {
      sum += uploadMaxFileSize[i];
    }
    if (sum == 0) {
      message.error(`不能上传空文件`)
      uploadMaxFileSize = []
      return false
    } else if (sum > UPLOAD_FILE_SIZE * 1024 * 1024) {
      message.error(`上传文件不能超过${UPLOAD_FILE_SIZE}MB`)
      setTimeout(() => {
        uploadMaxFileSize = []
      }, 50)
      return false
    } else {
      let gold_item = fileList.find(item => item.status == 'error')
      if (gold_item && Object.keys(gold_item).length) {
        message.error((gold_item.response && gold_item.response.message) && gold_item.response.message || `上传失败。`);
        that.setState({
          uploading: false
        })
        return false
      } else {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
      }
    }
  }

  handleChange = ({ file, fileList, event }) => {
    let that = this
    // console.log(file, fileList,'ssssssssssssssssssssssssss_file')
    if (file.status === 'uploading') {
      that.setState({
        uploading: true
      })
    }
    if (file.status !== 'uploading') {
      that.setState({
        uploading: false
      })
    }
    let gold_item = fileList.find(item => item.status == 'error')
    // console.log(gold_item, 'ssssssssssssssssssss_gold_item')
    if (gold_item && Object.keys(gold_item).length) {
      message.error((gold_item.response && gold_item.response.message) && gold_item.response.message || `上传失败。`);
      that.setState({
        uploading: false
      })
      return false
    } else if (file.status === 'done' && file.response && file.response.code === '0') {
      const { itemKey, parentKey, processEditDatas = [] } = this.props
      const { forms = [] } = processEditDatas[parentKey]
      message.success(`上传成功。`);
      that.setState({
        uploading: false
      })
    }
    // if (file.status === 'error' || (file.response && file.response.code !== '0')) {
    //   message.error((file.response && file.response.message) && file.response.message || `上传失败。`);
    //   that.setState({
    //     uploading: false
    //   })
    //   return false
    // } else if (file.status === 'done'&& file.response && file.response.code === '0') {
    //   message.success(`上传成功。`);
    //   that.setState({
    //     uploading: false
    //   })
    // }
  }

  getUploadProps = () => {
    let $that = this;
    const { fileList } = this.state;
    const { processInfo = {}, itemValue, processEditDatas = [], parentKey } = this.props;
    const { id: flow_node_instance_id } = processEditDatas[parentKey]
    const { org_id, board_id, folder_id, id: flow_instance_id } = processInfo

    return {
      name: 'file',
      action: '/api/projects/v2/flow/task/upload',
      headers: {
        Authorization: Cookies.get('Authorization'),
        refreshToken: Cookies.get('refreshToken'),

        ...setUploadHeaderBaseInfo({ orgId: org_id, boardId: board_id, aboutBoardOrganizationId: org_id, contentDataType: "file" }),
      },
      method: 'post',
      data: {
        flow_instance_id,
        flow_node_instance_id
      },
      fileList: fileList,
      withCredentials: true,
      multiple: true,
      showUploadList: false,
      // beforeUpload: this.onBeforeUpload,
      // onChange: this.handleChange,
    };
  }

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
    arr.splice(-1, 1)
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

  renderFileList = (item) => {
    return (
      <div key={item.file_id} className={indexStyles.file_item}>
        <div style={{ display: 'flex', alignItems: 'center', flex: '1' }}>
          <span className={`${globalStyles.authTheme} ${indexStyles.file_theme_code}`}>&#xe64d;</span>
          <span className={indexStyles.file_name}><span style={{ maxWidth: '874px', display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{this.getEllipsisFileName(item.file_name)}</span>{getSubfixName(item.file_name)}</span>
        </div>
        <div style={{ flexShrink: 0 }}>
          <span className={indexStyles.del_name}>删除</span>
        </div>
      </div>
    )
  }

  render() {
    const { itemValue } = this.props
    const { title, limit_file_num, limit_file_type, limit_file_size, is_required, files: fileList = [] } = itemValue
    return (
      <div className={indexStyles.text_form}>
        <p>
          <span>{title}:&nbsp;&nbsp;{is_required == '1' && <span style={{ color: '#F5222D' }}>*</span>}</span>
        </p>
        <Upload {...this.getUploadProps()} className={indexStyles.upload_process_file}>
          <div className={indexStyles.upload_static}>
            <span style={{ color: '#1890FF', fontSize: '28px', marginTop: '-6px' }} className={`${globalStyles.authTheme}`}>&#xe692;</span>
            <div style={{ flex: 1, marginLeft: '12px' }}>
              <div className={indexStyles.file_drap_tips}>点击或拖拽文件到此开始上传</div>
              <div className={indexStyles.file_layout}>{limit_file_size == 0 ? `不限制大小` : `${limit_file_size}MB以内`}、{limit_file_num == 0 ? `不限制数量` : `最多${limit_file_num}个`}、 {this.renderFileTypeArrayText()}格式</div>
            </div>
          </div>
        </Upload>
        {
          fileList && fileList.map(item => {
            return this.renderFileList(item)
          })
        }
        {/* {
          this.state.fileList && this.state.fileList.map(item => {
            return this.renderFileList(item)
          })
        } */}
      </div>
    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { processEditDatas = [], processInfo = {} } }) {
  return { processEditDatas, processInfo }
}
