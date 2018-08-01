/* eslint-disable react/react-in-jsx-scope */
import { Form, Input, InputNumber, Radio, Switch, DatePicker, Upload, Modal, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
import React from 'react'

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
      <Form onSubmit={this.handleSubmit}>
        {/* 输入账户 */}
        <FormItem>
          {getFieldDecorator('account', {
            rules: [{ required: true, message: '请输入账号', whitespace: true }],
          })(
            <Input
              style={{height: '40px'}}
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.6)' }} />}
              maxLength={40} placeholder="手机号/邮箱" />
          )}
        </FormItem>

        {/* 验证码 */}
        <div style={{position: 'relative'}}>
          <FormItem >
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入账号', whitespace: true }],
          })(
            <Input
              style={{height: '40px'}}
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.6)' }} />}
              maxLength={40} placeholder="手机号/邮箱" />
          )}
         </FormItem>
          <div style={{position: 'absolute',top:0 ,right: 0, color: '#999999',height: '40px',lineHeight: '40px',padding: '0 16px 0 16px',cursor: 'pointer'}}>获取验证码</div>
        </div>

        {/* 确认 */}
        <FormItem>
          <Button type="primary" htmlType="submit">确认</Button>

        </FormItem>


      </Form>
    );
  }
}

// const WrappedRegistrationForm = Form.create()(RegistrationForm);
export default Form.create()(FormList)

