/* eslint-disable import/first,react/react-in-jsx-scope */
import React from 'react'
import { Form, Input, InputNumber, Radio, Switch, DatePicker, Upload, Modal, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
import indexStyles from './index.less'

const FormItem = Form.Item;
const TextArea = Input.TextArea
const RadioGroup = Radio.Group

class EditFormOne extends React.Component {

  state={
    ratioValue: 1
  }
  // 提交表单
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
      }
    });
  }
  ratioOnChange(e) {
    this.setState({
      ratioValue: e.target.value
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    // 表单样式设置
    const formItemLayout = {
      justify: 'space-between',
      labelCol: {
        xs: { span: 4 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 19 },
        sm: { span: 19 },
      },
    };

    return (
      <Form onSubmit={this.handleSubmit}>
        {/* 名称 */}
        <FormItem
          {...formItemLayout}
          style={{marginBottom: 0}}

          colon={false}
          label={(
            <div className={indexStyles.labelDiv} style={{width: 120}}>
              <span>名称</span><br/>
              <span style={{color: '#8c8c8c'}}>给步骤起个名称</span>
            </div>
          )}
        >
          {getFieldDecorator('title', {
            initialValue: '',
            rules: [{ required: false, message: '输入步骤名称', whitespace: false }],
          })(
            <Input style={{height: 38, width: 520, marginLeft: 10}} placeholder="输入步骤名称"/>
          )}
        </FormItem>
        {/*描述*/}
        <FormItem
          {...formItemLayout}
          style={{marginBottom: 0}}
          colon={false}
          label={(
            <div className={indexStyles.labelDiv} style={{width: 120}}>
              <span>描述</span><br/>
              <span style={{color: '#8c8c8c'}}>指引如何完成与<br/>明确标准</span>
            </div>
          )}
        >
          {getFieldDecorator('title', {
            initialValue: '',
            rules: [{ required: false, message: '输入步骤名称', whitespace: false }],
          })(
            <div>
              <TextArea style={{height: 60, padding: '8px 8px', boxSizing: 'content-box',width: 502, marginLeft: 10,resize: 'none'}} placeholder="输入描述"/>
            </div>
          )}
        </FormItem>
        {/* 完成期限 */}
        <FormItem
          {...formItemLayout}
          style={{marginBottom: 0}}

          colon={false}
          label={(
            <div className={indexStyles.labelDiv} style={{width: 120}}>
              <span>完成期限</span><br/>
              <span style={{color: '#8c8c8c'}}>从发起流程开始<br/>计算</span>
            </div>
          )}
        >
          {getFieldDecorator('title', {
            initialValue: '',
            rules: [{ required: false, message: '输入步骤名称', whitespace: false }],
          })(
           <div>
             <RadioGroup onChange={this.ratioOnChange.bind(this)} value={this.state.ratioValue}>
               <Radio className={indexStyles.ratio} value={1}>无限期</Radio>
               <Radio className={indexStyles.ratio}value={2}>启动流程时指定</Radio>
               <Radio className={indexStyles.ratio} value={3}>固定天数</Radio>
             </RadioGroup>
           </div>
          )}
        </FormItem>

        {/* 名称 */}
        <FormItem
          {...formItemLayout}
          style={{marginBottom: 0}}

          colon={false}
          label={(
            <div className={indexStyles.labelDiv} style={{width: 120}}>
              <span>名称</span><br/>
              <span style={{color: '#8c8c8c'}}>给步骤起个名称</span>
            </div>
          )}
        >
          {getFieldDecorator('title', {
            initialValue: '',
            rules: [{ required: false, message: '输入步骤名称', whitespace: false }],
          })(
            <div>
              <Input style={{height: 38, width: 520, marginLeft: 10}} placeholder="输入步骤名称"/>

            </div>
          )}
        </FormItem>
      </Form>
    );
  }
}

// const WrappedRegistrationForm = Form.create()(RegistrationForm);
export default Form.create()(EditFormOne)

