import React from 'react'
import indexStyles from './index.less'
import { Input, Radio, Button, message, Upload, Icon } from 'antd'
import {REQUEST_DOMAIN, UPLOAD_FILE_SIZE} from "../../globalset/js/constant";
import Cookies from 'js-cookie'
const RadioGroup = Radio.Group;

export default class BaseInfo extends React.Component {
  state = {
    ratioValue: 1,
    uploading:false,
    logoUrl: ''
  }

  ratioOnChange = (e) => {
    this.setState({
      ratioValue: e.target.value,
    });
  }
  finallySave() {

  }
  deleteUpload() {
    this.setState({
      logoUrl: ''
    })
  }
  render() {
    const { logoUrl, uploading } = this.state

    const that = this
    const uploadProps = {
      name: 'file',
      withCredentials: true,
      action: `${REQUEST_DOMAIN}/user/upload`,
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
          if (file.response && file.response.data) {
            that.setState({
              logoUrl: file.response.data
            })
          }
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
        if (file.response && file.response.code === 0) {
          // const { accountSet = {} } = that.props
          // const { datas = {} } = accountSet
          // const { userInfo = {} } = datas
          // userInfo['avatar'] = file.response.data.avatar
          // that.props.updateDatas({
          //   userInfo
          // })
        }
      },
    };

    return (
      <div className={indexStyles.baseInfoOut}>
        <div className={indexStyles.baseInfo_title}>
          组织名称
        </div>
        <Input placeholder={'输入组织名称'} style={{marginTop: 8}}/>
        <div className={indexStyles.baseInfo_title_2}>
          组织LOGO
        </div>
        <div  className={indexStyles.baseInfo_des}>你的企业标识会一直显示在协作平台的左上方，为了达到更好的显示效果，上传尺寸请保持在64像素以上的正方形。</div>
        <div className={indexStyles.UploadOut}>
          {logoUrl? (
            <img src={logoUrl} />
          ) : (
            <div className={indexStyles.instepImg}></div>
          )}
          <div className={indexStyles.delete} onClick={this.deleteUpload.bind(this)}>删除</div>
          <Upload {...uploadProps} showUploadList={false} accept={"image/jpg, image/jpeg,  image/png"}>
            <Button>
              <Icon type="upload" /> Click to Upload
            </Button>
          </Upload>
          <div style={{width: 120}} >
            {uploading?(
              <span><Icon type="loading"  style={{fontSize:20,marginLeft:12}}/>'上传中...'</span>
            ):('')}
          </div>
        </div>

        <div className={indexStyles.baseInfo_title_2}>
          成员加入模式
        </div>
        <div  className={indexStyles.baseInfo_des}>设置新成员以何种方式加入或找到组织。</div>
        <RadioGroup onChange={this.ratioOnChange} value={this.state.ratioValue} style={{marginTop: 8}}>
          <Radio style={radioStyle} value={1}>仅能通过邀请加入</Radio>
          <Radio style={radioStyle} value={2}>申请加入者需通过许可</Radio>
          <Radio style={radioStyle} value={3}>任意满足一下邮箱后缀名并完成邮件认证的用户可自动加入。</Radio>
        </RadioGroup>
        <Input placeholder={'@examlpe.com'} style={{marginTop: 8}}/>
        <div  className={indexStyles.baseInfo_des} style={{color: '#BFBFBF'}}>请使用空格符号分隔多个后缀名</div>
        <div style={{margin: '0 auto',marginTop: 20, textAlign: 'center'}}>
          <Button type={'primary'}  onClick={this.finallySave.bind(this)}>保存</Button>
        </div>
      </div>
    )
  }
}
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};
