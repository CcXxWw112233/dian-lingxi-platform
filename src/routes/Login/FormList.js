/* eslint-disable react/react-in-jsx-scope */
import { Form, Input, InputNumber, Radio, Switch, DatePicker, Upload, Modal, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
import React from 'react'
import indexStyle from './index.less'
import VerificationCodeTwo from  '../../components/VerificationCodeTwo'

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker

class FormList extends React.Component {

  state={
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
      console.log(values)
      if (!err) {
        this.props.handleSubmit ? this.props.handleSubmit(values) : false
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    //  表单样式设置
    const formItemLayout = {
      labelCol: {
        xs: { span: 10 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 10 },
        sm: { span: 6 },
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

    return (
      <Form onSubmit={this.handleSubmit}  style={{margin: '0 auto',width:  272}}>
        {/* 输入账户 */}
        <FormItem>
          {getFieldDecorator('account', {
            rules: [{ required: true, message: '请输入账号', whitespace: true }],
          })(
            <Input
              style={{height: '40px',fontSize: 16}}
              prefix={<Icon type="user" style={{ color: '#8C8C8C', fontSize: 16 }} />}
              maxLength={40} placeholder="手机号/邮箱" />
          )}
        </FormItem>

        {/* 验证码 */}
        <div style={{position: 'relative', marginTop: -6}}>
          <FormItem >
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入验证码', whitespace: true }],
            })(
              <Input
                style={{height: '40px',fontSize: 16, color: '#8C8C8C'}}
                prefix={<Icon type="lock" style={{ color: '#8C8C8C', fontSize: 16 }} />}
                maxLength={6} placeholder="密码" />
            )}
          </FormItem>
          <div style={{position: 'absolute',top:0 ,right: 0, color: '#bfbfbf',height: '40px',lineHeight: '40px',padding: '0 16px 0 16px',cursor: 'pointer',display: 'flex'}}>
            <div style={{height: 20, marginTop: 10, width: 1, backgroundColor: '#bfbfbf',}}></div>
            {/*<div>获取验证码</div>*/}
            <VerificationCodeTwo  style={{height: '40px',fontSize: 16,width: 100,textAlign: 'center'}} text={'获取验证码'}/>
          </div>
        </div>

        {/* 确认 */}
        <FormItem>
          <Button type="primary" htmlType="submit" style={{width: '100%',height: 40}}>登陆</Button>
        </FormItem>


      </Form>
    );
  }
}

// const WrappedRegistrationForm = Form.create()(RegistrationForm);
export default Form.create()(FormList)

