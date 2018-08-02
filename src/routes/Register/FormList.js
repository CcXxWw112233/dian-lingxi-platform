/* eslint-disable react/react-in-jsx-scope */
import { Form, Input, InputNumber, Radio, Switch, DatePicker, Upload, Modal, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
import React from 'react'
import indexStyle from './index.less'

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
        {/* 姓名 */}
        <FormItem>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入姓名', whitespace: true }],
          })(
            <Input
              style={{height: '40px',fontSize: 16}}
              maxLength={40} placeholder="姓名" />
          )}
        </FormItem>
        {/* 电话 */}
        <FormItem  style={{marginTop: -6}}>
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: '请输入手机号', whitespace: true }],
          })(
            <Input
              style={{height: '40px',fontSize: 16}}
              maxLength={40} placeholder="手机号" />
          )}
        </FormItem>
        {/*验证码*/}
        <FormItem
        >
          <Row gutter={8}>
            <Col span={14}>
              {getFieldDecorator('captcha', {
                rules: [{ required: true, message: '请输入验证码' }],
              })(
                <Input placeholder="验证码" style={{height: '40px',fontSize: 16,}}/>
              )}
            </Col>
            <Col span={10}>
              <Button style={{height: '40px',fontSize: 16,color: 'rgba(0,0,0,.65)', width: '100%'}}>获取验证码</Button>
            </Col>
          </Row>
        </FormItem>
        {/* 密码 */}
        <FormItem  style={{marginTop: -6}}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码', whitespace: true }],
          })(
            <Input
              style={{height: '40px',fontSize: 16}}
              maxLength={40} placeholder="密码" />
          )}
        </FormItem>
        {/* 邮箱 */}
        <FormItem  style={{marginTop: -6}}>
          {getFieldDecorator('Mailbox', {
            rules: [{ required: true, message: '请输入邮箱', whitespace: true }],
          })(
            <Input
              style={{height: '40px',fontSize: 16}}
              maxLength={40} placeholder="邮箱" />
          )}
        </FormItem>

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

