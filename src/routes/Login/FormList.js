/* eslint-disable react/react-in-jsx-scope */
import { Form, Input, InputNumber, Radio, Switch, DatePicker, Upload, Modal, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, message } from 'antd';
import React from 'react'
import indexStyle from './index.less'
import VerificationCodeTwo from  '../../components/VerificationCodeTwo'
import { validateTel, validateEmail, validatePassword } from '../../utils/verify'
import { MESSAGE_DURATION_TIME } from '../../globalset/js/constant'

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker

class FormList extends React.Component {

  state={
    accountType: 'phone',    //账户类型，默认手机号，可选email
    loginType: 'password', //登录方式,验证码登录
  }

  //  重置表单
  formReset = () => {
    this.setState({
      isReset: true,
    })
    this.props.form.resetFields()
  }

  //  提交表单
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(!validateTel(values['account']) && !validateEmail(values['account'])) { //输入既不满足手机号又不满足邮箱
          message.warn('请输入正确的手机号或邮箱', MESSAGE_DURATION_TIME)
          return false
        }
        if(this.state.loginType === 'password') {
          if(!validatePassword(values['password'])) {
            message.warn('密码至少为包含字母与数字的6位数字符串', MESSAGE_DURATION_TIME)
            return false
          }
        }else{
          if(!values['verifycode']){
            message.warn('请输入短信验证码', MESSAGE_DURATION_TIME)
            return false
          }
        }
        this.props.formSubmit ? this.props.formSubmit(values) : false
      }
    });
  }

  //验证账户,失去焦点
  verifyByBlur = (name) => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(name === 'account') { //输入框是账户
        if(!validateTel(values[name]) && !validateEmail(values[name])) { //输入既不满足手机号又不满足邮箱
          message.warn('请输入正确的手机号或邮箱', MESSAGE_DURATION_TIME)
        }
        if(validateTel(values[name])) { //如果用户输入的是手机号

        } else {

        }
      }else if(name === 'password') {

      }else if(name === 'verifycode') {

      } else {

      }
    });
  }
  //验证账户，输入过程
  verifyAccountByChange = (e,name) => {
    const value = e.target.value
    if(name === 'account') { //输入框是账户
      let accountType = ''
      if(!isNaN(value) && validateTel(value)) { //如果用户输入的是手机号,纯数字
        accountType = 'phone'
      } else {
        accountType = 'email'
      }
      this.setState({
        accountType
      })
    }
  }

  //获取验证码
  getVerifyCode = (calback) => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!validateTel(values['account'])) {
        message.warn('请输入正确的手机号', MESSAGE_DURATION_TIME)
        return false
      }
      this.setState({
        loginType: 'verifycode'
      })
      const obj = {
        mobile: values['account'],
        type: '2'
      }
      this.props.getVerificationcode ? this.props.getVerificationcode(obj, calback) : false
      // calback && typeof calback === 'function' ? calback() : ''
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loginType, accountType} = this.state

    return (
      <Form onSubmit={this.handleSubmit}  style={{margin: '0 auto',width:  272}}>
        {/* 输入账户 */}
        <FormItem >
          {getFieldDecorator('account', {
            rules: [{ required: false, message: '请输入账号', whitespace: true }],
          })(
            <Input
              style={{height: '40px',fontSize: 16}}
              prefix={<Icon type="user" style={{ color: '#8C8C8C', fontSize: 16 }} />}
              maxLength={40} placeholder="手机号/邮箱"
              onBlur = {this.verifyByBlur.bind(null, 'account')}
              onChange = {(e) => this.verifyAccountByChange(e, 'account')}
            />
          )}
        </FormItem>

        {/* 验证码 */}
        <div style={{position: 'relative', marginTop: 0}}>
          <FormItem >
            {getFieldDecorator(loginType, {
              rules: [{ required: false, message: '请输入验证码', whitespace: true }],
            })(
              <Input
                style={{height: '40px',fontSize: 16, color: '#8C8C8C'}}
                prefix={<Icon type="lock" style={{ color: '#8C8C8C', fontSize: 16 }} />}
                maxLength={6} placeholder={loginType === 'password'? '密码' : '验证码'}
                type={accountType === 'email' ? 'password' : (loginType === 'password'? 'password' : 'text')}
              />
            )}
          </FormItem>
          {accountType === 'phone'? (
            <div style={{position: 'absolute',top:0 ,right: 0, color: '#bfbfbf',height: '40px',lineHeight: '40px',padding: '0 16px 0 16px',cursor: 'pointer',display: 'flex'}}>
              <div style={{height: 20, marginTop: 10, width: 1, backgroundColor: '#bfbfbf',}}></div>
              {/*<div>获取验证码</div>*/}
              <VerificationCodeTwo getVerifyCode={this.getVerifyCode.bind(this)} style={{height: '40px',fontSize: 16,width: 100,textAlign: 'center'}} text={'获取验证码'}/>
            </div>
          ) : ('')}
        </div>

        {/* 确认 */}
        <FormItem>
          <Button type="primary" htmlType="submit" style={{width: '100%',height: 40, fontSize: 16}}>登录</Button>
        </FormItem>


      </Form>
    );
  }
}

// const WrappedRegistrationForm = Form.create()(RegistrationForm);
export default Form.create()(FormList)

