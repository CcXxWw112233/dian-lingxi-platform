import React from 'react'
import { Button, Input, Upload, message } from 'antd'
import indexStyles from './index.less'
import Cookies from 'js-cookie'
import {
  MESSAGE_DURATION_TIME,
  NOT_HAS_PERMISION_COMFIRN, ORG_UPMS_ORGANIZATION_EDIT,
  REQUEST_DOMAIN, UPLOAD_FILE_SIZE
} from "../../../../../globalset/js/constant";
import {checkIsHasPermission} from "../../../../../utils/businessFunction";
const TextArea = Input.TextArea

export default class BaseInfo extends React.Component {
  state = {
    templateHtml: '',
    name: '',
    description: '',
    logoUrl: ''
  }
  btnClick() {
    const that = this
    that.props.updateDatas({
      teamShowCertainOneShow: false
    })
    setTimeout(function () { //延迟获取
      const html = document.getElementById('editTeamShow').innerHTML
      console.log(html)
      that.setState({
        templateHtml: html
      })
    },200)

  }
  inputChange(e) {
    this.setState({
      name: e.target.value
    })
  }
  textAreaChange(e) {
    this.setState({
      description: e.target.value.replace(/\n/gim,'<br/>')
    })
  }
  styles () {
    const editTop = {
      display: 'flex',
      marginBottom: 40,
    }
    const editTop_left_div = {
      width: 240,
      height: 170,
      backgroundColor: '#ffffff',
      border: '1px solid rgba(217,217,217,1)',
      borderRadius: 4,
      cursor: 'pointer',
    }
    const editTop_right_div = {
      flex: 1,
      marginLeft: 20,
    }
    const editTop_right_div_input = {
      height: 40,
      width: '100%',
      fontSize: 16
    }
    const editTop_right_div_textArea = {
      height: 120,
      marginTop: 10,
      width: '100%',
      resize: 'none',
      fontSize: 12,
    }
    const detailInfoOut = {
      width: '100%',
      backgroundColor: '#ffffff',
      paddingBottom: 60,
      height: 'auto',
      clear: 'both'
    }
    const detailInfo = {
      marginTop: 20,
      backgroundColor: '#ffffff',
      width: 700,
      textAlign: 'center',
      margin: '0 auto',
      height: 'auto',
      padding: '60px 0'
    }
    const detailInfo_top = {
      width: 110,
      height: 70,
      border: '1px solid rgba(217,217,217,1)',
      margin: '0 auto',
      borderRadius: 4,
    }
    const detaiInfo_middle = {
      marginTop: 16,
      fontSize: 24
    }
    const detailInfo_bott = {
      marginTop: 20,
      fontSize: 14,
      textAlign: 'left',
    }
    const dangerouslySetInnerHTML = {
      backgroundColor: '#ffffff',
      height: 'auto',
      clear: 'both',
    }
    return {
      editTop,editTop_left_div, editTop_right_div,editTop_right_div_input,editTop_right_div_textArea,
      detailInfoOut,detailInfo,detailInfo_top,detaiInfo_middle,detailInfo_bott,dangerouslySetInnerHTML,

    }
  }
  showEdit() {
    this.props.updateDatas({
      editTeamShowPreview:false,
      editTeamShowSave: false
    })
  }
  render() {
    const that = this
    const { templateHtml } = this.props
    const { name, description, logoUrl } = this.state
    const { editTop, editTop_left_div, editTop_right_div, editTop_right_div_input, editTop_right_div_textArea,dangerouslySetInnerHTML,
      detailInfo,detailInfo_top,detaiInfo_middle,detailInfo_bott,detailInfoOut } = this.styles()
    const uploadProps = {
      name: 'file',
      withCredentials: true,
      action: `${REQUEST_DOMAIN}/organization/logo_upload`,
      headers: {
        Authorization: Cookies.get('Authorization'),
        refreshToken : Cookies.get('refreshToken'),
      },
      beforeUpload(e) {
        if(e.size == 0) {
          message.error(`不能上传空文件`)
          return false
        }else if(e.size > UPLOAD_FILE_SIZE * 1024 * 1024) {
          message.error(`上传文件不能文件超过${UPLOAD_FILE_SIZE}MB`)
          return false
        }
      },
      onChange({ file, fileList, event }) {
        console.log(file)
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
        if (file.status === 'done') {
          message.success(`上传成功。`);
          that.setState({
            uploading: false
          })
        } else if (file.status === 'error') {
          message.error(`上传失败。`);
          that.setState({
            uploading: false
          })
        }
        if (file.response && file.response.code === '0') {
          alert(1)
          that.setState({
            logoUrl: file.response.data.logo
          })
        }
      },
    };
    const {datas: { editTeamShowPreview, editTeamShowSave }} = this.props.model

    return (
      <div>
        <div style={{...editTop, color: '#262626'}}>
          <Upload {...uploadProps} showUploadList={false} accept={"image/jpg, image/jpeg,  image/png"}>
            {logoUrl?(
              <img src={logoUrl} style={{...editTop_left_div}}/>
            ) : (
              <div style={{...editTop_left_div}}></div>
            )}
          </Upload>
          <div  style={{...editTop_right_div}}>
            <Input onChange={this.inputChange.bind(this)} style={{...editTop_right_div_input}} placeholder={'输入团队名称'}/>
            <TextArea onChange={this.textAreaChange.bind(this)} style={{...editTop_right_div_textArea}} placeholder={'输入团队描述'} />
          </div>
        </div>
        <div style={{...detailInfoOut}} id={'editTeamShow'}>
          <div style={{...detailInfo}}>
            {logoUrl?(
              <img src={logoUrl} style={{...detailInfo_top}} />
            ) : (
              ''
            )}
            {/*<div style={{...detailInfo_top}}></div>*/}
            <div style={{...detaiInfo_middle}}>{name}</div>
            <div style={{...detailInfo_bott}} dangerouslySetInnerHTML={{__html: description}}></div>
          </div>

          {(editTeamShowPreview || editTeamShowSave )? (
            <div style={{...dangerouslySetInnerHTML}} dangerouslySetInnerHTML={{__html: templateHtml}} onClick={this.showEdit.bind(this)}></div>
          ) : ('')}
        </div>

      </div>
    )
  }
}


