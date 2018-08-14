/* eslint-disable import/first,react/react-in-jsx-scope */
import React from 'react'
import { Form, Input, InputNumber, Radio, Switch, DatePicker, Upload, Modal, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, message } from 'antd';
import moment from 'moment';
import indexStyle from './index.less'

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker

class PersonalInfoForm extends React.Component {
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
      if (!err) {
        this.props.handleSubmit ? this.props.handleSubmit(values) : false
      }
    });
  }

  render() {
    const that = this
    const { getFieldDecorator } = this.props.form;
    // 表单样式设置
    const formItemLayout = {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 },
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
    const { name, job, ognization, weixin, email, mobile, avatar } = {}
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
      <Form onSubmit={this.handleSubmit} style={{padding:'20px 0',width: 600}}>
        {/* 姓名 */}
        <FormItem
          {...formItemLayout}
          label={(
            <span style={{fontSize: 16}}>
              姓名
            </span>
          )}
        >
          {getFieldDecorator('title', {
            initialValue: name || undefined,
            rules: [{ required: false, message: '请输入姓名', whitespace: true }],
          })(
            <Input placeholder="" className={indexStyle.personInfoInput}/>
          )}
        </FormItem>
        {/* 职位 */}
        <FormItem
          {...formItemLayout}
          label={(
            <span style={{fontSize: 16}}>
              职位
            </span>
          )}
        >
          {getFieldDecorator('job', {
            initialValue: job || undefined,
            rules: [{ required: false, message: '请输入职位', whitespace: true }],
          })(
            <Input placeholder="" className={indexStyle.personInfoInput}/>
          )}
        </FormItem>
        {/* 组织 */}
        <FormItem
          {...formItemLayout}
          label={(
            <span style={{fontSize: 16}}>
              组织
            </span>
          )}
        >
          {getFieldDecorator('ognization', {
            initialValue: ognization || undefined,
            rules: [{ required: false, message: '请输入组织', whitespace: true }],
          })(
            <Input placeholder="" className={indexStyle.personInfoInput}/>
          )}
        </FormItem>
        {/* 头像 */}
        <FormItem
          {...formItemLayout}
          label={(
            <span style={{fontSize: 16}}>
              头像
            </span>
          )}
        >
          {getFieldDecorator('avatar', {
            initialValue: avatar || undefined,
          })(
            <div style={{display: 'flex'}}>
              <div className={indexStyle.avatar}>
                {avatarUrl?(
                  <img src={avatarUrl} style={{width:'100%',height: '100%',borderRadius: 40}}></img>
                ):(
                  <Icon type="user" style={{fontSize: 28, color: '#ffffff',display: 'inline-block',margin: '0 auto',marginTop:6}}/>
                )}

              </div>
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
          )}
        </FormItem>
        {/*邮箱*/}
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
            rules: [{ required: false, message: '请输入组织', whitespace: true }],
          })(
            <div style={{marginLeft: 12, fontSize: 16,color: '#262626' }}>{ email || '未绑定' } <Button style={{fontSize: 14, color:'rgba(0,0,0,.65)',marginLeft: 12 }}>修改</Button></div>
          )}
        </FormItem>
        {/*手机号*/}
        <FormItem
          {...formItemLayout}
          label={(
            <span style={{fontSize: 16}}>
              手机号
            </span>
          )}
        >
          {getFieldDecorator('mobile', {
            initialValue: mobile || undefined,
            rules: [{ required: false }],
          })(
            <div style={{marginLeft: 12, fontSize: 16 ,color: '#262626'}}>{ email || '未绑定' } <Button style={{fontSize: 14, color:'rgba(0,0,0,.65)',marginLeft: 12 }}>修改</Button></div>
          )}
        </FormItem>
        {/*  微信 */}
        <FormItem
          {...formItemLayout}
          label={(
            <span style={{fontSize: 16}}>
              微信
            </span>
          )}
        >
          {getFieldDecorator('weixin', {
            initialValue: weixin || undefined,
            rules: [{ required: false, message: '请输入组织', whitespace: true }],
          })(
            <Input placeholder="" className={indexStyle.personInfoInput}/>
          )}
        </FormItem>
        {/* 确认 */}
        <FormItem
          {...formItemLayout}
        >
          <Button type="primary" htmlType="submit" style={{marginLeft: 112,width: 80, height: 40,fontSize:16}}>确认</Button>
        </FormItem>
      </Form>
    );
  }
}

// const WrappedRegistrationForm = Form.create()(RegistrationForm);
export default Form.create()(PersonalInfoForm)

