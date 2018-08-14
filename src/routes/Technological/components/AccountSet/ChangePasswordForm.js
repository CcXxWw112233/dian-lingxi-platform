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

class ChangePasswordForm extends React.Component {
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
        {/* 当前密码 */}
        <FormItem
          {...formItemLayout}
          label={(
            <span style={{fontSize: 16}}>
              当前密码
            </span>
          )}
        >
          {getFieldDecorator('currentPassword', {
            rules: [{ required: false, message: '请输入当前密码', whitespace: true }],
          })(
            <Input placeholder="请输入当前密码" className={indexStyle.personInfoInput} type={'password'}/>
          )}
        </FormItem>
        {/* 新密码 */}
        <FormItem
          {...formItemLayout}
          label={(
            <span style={{fontSize: 16}}>
              新密码
            </span>
          )}
        >
          {getFieldDecorator('newPassword', {
            rules: [{ required: false, message: '请输入新密码', whitespace: true }],
          })(
            <Input placeholder="密码（数字，字母，至少6位）" className={indexStyle.personInfoInput}/>
          )}
        </FormItem>
        {/* 再次输入 */}
        <FormItem
          {...formItemLayout}
          label={(
            <span style={{fontSize: 16}}>
              再次输入
            </span>
          )}
        >
          {getFieldDecorator('confirmPassword', {
            rules: [{ required: false, message: '确认输入新密码', whitespace: true }],
          })(
            <Input placeholder="确认输入新密码" className={indexStyle.personInfoInput}/>
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
export default Form.create()(ChangePasswordForm)

