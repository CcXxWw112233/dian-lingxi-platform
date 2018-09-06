/* eslint-disable import/first,react/react-in-jsx-scope */
import React from 'react'
import { Form, Input, InputNumber, Radio, Switch, DatePicker, Upload, Modal, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, message } from 'antd';
import moment from 'moment';
import indexStyle from './index.less'
import {validateEmail, validatePassword, validateTel} from '../../../../utils/verify'
import {MESSAGE_DURATION_TIME} from "../../../../globalset/js/constant";

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

  // 提交表单
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(!values['old_password']) {
          message.warn('请输入当前密码。', MESSAGE_DURATION_TIME)
          return false
        }
        if(!validatePassword(values['new_password'])) {
          message.warn('新密码至少为包含字母与数字的6位数字符串。', MESSAGE_DURATION_TIME)
          return false
        }
        if(values['new_password'] !== values['confirmPassword']) {
          message.warn('输入新密码不一致。', MESSAGE_DURATION_TIME)
          return false
        }
        this.props.changePassWord ? this.props.changePassWord(values) : false
      }
    });
  }

  currentPasswordBlur(e) {

  }
  passwordBlur(e) {

  }
  comfirPasswordBlur(e) {

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
          {getFieldDecorator('old_password', {
            rules: [{ required: false, message: '请输入当前密码', whitespace: true }],
          })(
            <Input placeholder="请输入当前密码"
                   className={indexStyle.personInfoInput}
                   type={'password'}
                   onBlur={this.currentPasswordBlur.bind(this)}
            />
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
          {getFieldDecorator('new_password', {
            rules: [{ required: false, message: '请输入新密码', whitespace: true }],
          })(
            <Input placeholder="密码（数字，字母，至少6位）"
                   onBlur={this.passwordBlur.bind(this)}
                   className={indexStyle.personInfoInput} type={'password'} />
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
            <Input placeholder="确认输入新密码"
                   onBlur={this.comfirPasswordBlur.bind(this)}
                   className={indexStyle.personInfoInput} type={'password'} />
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

