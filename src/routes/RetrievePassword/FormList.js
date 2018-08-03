/* eslint-disable react/react-in-jsx-scope */
import { Form, Input, InputNumber, Radio, Switch, DatePicker, Upload, Modal, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
import React from 'react'
import indexStyle from './index.less'
import DragValidation from '../../components/DragValidation'

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
      <Form onSubmit={this.handleSubmit}  style={{margin: '0 auto',width:  280}}>
        {/* 绑定的手机号或邮箱 */}
        <FormItem  style={{marginTop: -6}}>
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: '请输入绑定的手机号或邮箱', whitespace: true }],
          })(
            <Input
              style={{height: '40px',fontSize: 16}}
              maxLength={40} placeholder="绑定的手机号或邮箱" />
          )}
        </FormItem>

        <DragValidation />

        {/* 确认 */}
        <FormItem style={{marginTop: 20}}>
          <Button type="primary" htmlType="submit" style={{width: '100%',height: 40}}>确认修改</Button>
        </FormItem>


      </Form>
    );
  }
}

// const WrappedRegistrationForm = Form.create()(RegistrationForm);
export default Form.create()(FormList)

