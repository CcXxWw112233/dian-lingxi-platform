/* eslint-disable import/first,react/react-in-jsx-scope */
import React from 'react'
import { Form, Input, InputNumber, Radio, Switch, DatePicker, Upload, Modal, Tooltip, Icon, Alert, Select, Row, Col, Checkbox, Button, AutoComplete, message } from 'antd';
import moment from 'moment';
import indexStyle from './index.less'
import VerificationCodeTwo from '../../../../components/VerificationCodeTwo'
import globalStyles from '../../../../globalset/css/globalClassName.less'
import {validateTel} from "../../../../utils/verify";
import {MESSAGE_DURATION_TIME} from "../../../../globalset/js/constant";

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker

class BindAccountForm extends React.Component {
  state = {
    uploading: false, //是否正在上传
    avatarUrl: ''
  }
  // 设置表单，上传文件后设置{name：url}
  setFormUploadValue = (name, fileurl) => {
    this.props.form.setFieldsValue({
      image: fileurl
    })
  }
  // 提交表单
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values)
      if (!err) {
        this.props.handleSubmit ? this.props.handleSubmit(values) : false
      }
    });
  }
  //获取验证码
  getVerifyCode = (calback) => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values)
      if(!validateTel(values['mobile'])) {
        message.warn('请输入正确的手机号', MESSAGE_DURATION_TIME)
        return false
      }
      const obj = {
        mobile: values['mobile'],
        type: '3'
      }
      this.props.getVerificationcode ? this.props.getVerificationcode(obj, calback) : false
      // calback && typeof calback === 'function' ? calback() : ''
    })
  }
  render() {
    const that = this
    const { getFieldDecorator } = this.props.form;
    // 表单样式设置
    const formItemLayout = {
      labelCol: {
        xs: { span: 7 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 10 },
        sm: { span: 10 },
      },
    };
    const tailFormItemLayout = {
      labelCol: {
        xs: { span: 10 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: {
          span: 4,
          offset: 2,
        },
        sm: {
          span: 6,
          offset: 2,
        },
      },
    };
    const { email, mobile } = {}
    const { avatarUrl, uploading } = this.state
    const uploadProps = {
      name: 'file',
      action: '//jsonplaceholder.typicode.com/posts/',
      headers: {
        authorization: 'authorization-text',
      },
      onChange({ file, fileList, event }) {
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
              avatarUrl: file.response.data
            })
          }
        }
        if (file.status === 'done') {
          message.success(`头像上传成功。`);
          that.setState({
            uploading: false
          })
        } else if (file.status === 'error') {
          message.error(`头像上传失败。`);
          that.setState({
            uploading: false
          })
        }
      },
    };
    return (
      <div>
        {/*修改邮箱*/}
        <Form layout="inline" onSubmit={this.handleSubmit} style={{padding:'20px 0',width: 600, display: 'flex'}}>
          {/* 邮箱 */}
          <FormItem
            {...formItemLayout}
            label={(
              <span style={{fontSize: 16}}>
                邮箱
              </span>
            )}
          >
            {getFieldDecorator('email', {
              initialValue: email || undefined,
              rules: [{ required: false, message: '请输入邮箱', whitespace: true }],
            })(
              <Input placeholder="" className={indexStyle.personInfoInput}/>
            )}
          </FormItem>
          {/* 确认 */}
          <FormItem
          >
            <Button type="primary" htmlType="submit" style={{height: 40, marginLeft: 48}}>发送邮件验证</Button>
          </FormItem>
        </Form>
        <Alert
          message="更换邮箱绑定操作提示"
          description="输入新的邮箱地址，点击【发送邮件验证】按钮，在邮箱中点击修改完成确认按钮或链接即可完成修改。"
          type="info"
          showIcon
          closable
          style={{marginLeft: 106}}
        />
        {/*修改手机*/}
        <Form layout="inline" onSubmit={this.handleSubmit} style={{padding:'20px 0',width: 600, display:'flex'}}>
          {/* 手机 */}
          <FormItem
            {...formItemLayout}
            style={{marginLeft:12}}
            label={(
              <span style={{fontSize: 16}}>
                手机
              </span>
            )}
          >
            {getFieldDecorator('mobile', {
              initialValue: mobile || undefined,
              rules: [{ required: false, message: '请输入邮箱', whitespace: false }],
            })(
              <div className={indexStyle.personInfoInput}>
                <Input placeholder=""  style={{width: 160,height: 40}} />
              </div>
            )}
          </FormItem>

          {/* 验证码 */}
          <div style={{position: 'relative', marginTop: 0,marginLeft: -32, width: 240}}>
            <FormItem >
              {getFieldDecorator('code', {
                rules: [{ required: false, message: '请输入验证码', whitespace: true }],
              })(
                <Input
                  style={{height: '40px',fontSize: 16, color: '#8C8C8C',width: 240}}
                  maxLength={10}
                />
              )}
            </FormItem>
              <div style={{position: 'absolute',top:0 ,right: 0, color: '#bfbfbf',height: '40px',lineHeight: '40px',padding: '0 16px 0 16px',cursor: 'pointer',display: 'flex'}}>
                <div style={{height: 20, marginTop: 10, width: 1, backgroundColor: '#bfbfbf',}}></div>
                {/*<div>获取验证码</div>*/}
                <VerificationCodeTwo getVerifyCode={this.getVerifyCode.bind(this)} className={this.state.isMobile ? globalStyles.link_mouse : ''} style={{height: '40px',fontSize: 16,width: 100,textAlign: 'center'}} text={'获取验证码'}/>
              </div>
          </div>
          {/* 确认 */}
          <FormItem>
            <Button type="primary" htmlType="submit" style={{height: 40, marginLeft: 12,}}>修改</Button>
          </FormItem>
        </Form>
      </div>

    );
  }
}

// const WrappedRegistrationForm = Form.create()(RegistrationForm);
export default Form.create()(BindAccountForm)


