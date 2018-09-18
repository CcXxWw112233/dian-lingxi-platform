import React from 'react'
import { Modal, Form, Button, Input, message } from 'antd'
import DragValidation from '../../../../../../components/DragValidation'
import {validateEmail, validateTel} from "../../../../../../utils/verify";
import {MESSAGE_DURATION_TIME} from "../../../../../../globalset/js/constant";
const FormItem = Form.Item
const TextArea = Input.TextArea
class SaveTemplate extends React.Component {

  state = {
    stepContinueDisabled: true,
  }
  descriptionChange(e) {
    this.setState({
      users: e.target.value
    })
  }
  nameChange(e) {
    const value = e.target.value
    let flag = true
    if(value) {
      flag = false
    }
    this.setState({
      stepContinueDisabled: flag
    })
  }
  onCancel = () => {
    this.props.updateDatas({
      SaveTemplateModalVisible: false
    })
  }
  // 提交表单
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values['board_id'] = this.props.board_id
        this.props.updateDatas({
          SaveTemplateModalVisible: false
        })
        this.props.addMenbersInProject ? this.props.addMenbersInProject(values) : false
      }
    });
  }
  render() {
    const { datas :{SaveTemplateModalVisible } } = this.props.model;
    // const { SaveTemplateModalVisible } = datas
    const { getFieldDecorator } = this.props.form;
    const { stepContinueDisabled } = this.state

    const step_3 = (
      <Form onSubmit={this.handleSubmit} style={{margin: '0 auto',width: 336}}>
        <div style={{fontSize: 20,color: '#595959',marginTop: 28,marginBottom: 28}}>保存为模板</div>
        <FormItem style={{width: 336}}>
          {getFieldDecorator('name', {
            rules: [{ required: false, message: '请输入姓名', whitespace: true }],
          })(
            <Input  placeholder={'输入模板名称'} style={{height: 40}} onChange={this.nameChange.bind(this)}/>
          )}
        </FormItem>

        {/* 描述 */}
        <FormItem style={{width: 336}}>
          {getFieldDecorator('othersInfo', {
            rules: [{ required: false, message: '', whitespace: true }],
          })(
            <TextArea style={{height: 208, resize:'none'}}
                      onChange={this.descriptionChange.bind(this)}
                      placeholder="模板描述（选填）"/>
          )}
        </FormItem>
        {/* 确认 */}
        <FormItem>
          <Button type="primary" disabled={stepContinueDisabled} htmlType={'submit'} onClick={this.nextStep} style={{marginTop:20,width: 208, height: 40}}>发送邀请</Button>
        </FormItem>
      </Form>
    )

    return(
      <div>
        <Modal
          visible={SaveTemplateModalVisible} //SaveTemplateModalVisible
          width={472}
          zIndex={1006}
          footer={null}
          destroyOnClose
          style={{textAlign:'center'}}
          onCancel={this.onCancel}
        >
          {step_3}
        </Modal>
      </div>
    )
  }
}
export default Form.create()(SaveTemplate)
