import React from 'react'
import { Modal, Form, Button, Input, message } from 'antd'
import DragValidation from '../../../../../../components/DragValidation'
import {validateEmail, validateTel} from "../../../../../../utils/verify";
import {MESSAGE_DURATION_TIME} from "../../../../../../globalset/js/constant";
const FormItem = Form.Item
const TextArea = Input.TextArea
class OpinionModal extends React.Component {

  state = {
    stepContinueDisabled: true,
  }
  descriptionChange(e) {
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
    this.props.setOpinionModalVisible()
  }
  // 提交表单
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { itemValue } = this.props
        this.props.setOpinionModalVisible()
        //发送请求
        this.props.completeProcessTask ? this.props.completeProcessTask(values) : false
      }
    });
  }
  render() {
    const { opinionModalVisible } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { stepContinueDisabled } = this.state

    const step_3 = (
      <Form onSubmit={this.handleSubmit} style={{margin: '0 auto',width: 336}}>
        <div style={{fontSize: 20,color: '#595959',marginTop: 28,marginBottom: 28}}>填写意见</div>

        {/* 意见 */}
        <FormItem style={{width: 336}}>
          {getFieldDecorator('message', {
            rules: [{ required: false, message: '', whitespace: true }],
          })(
            <TextArea style={{height: 208, resize:'none'}}
                      onChange={this.descriptionChange.bind(this)}
                      placeholder="请输入意见" maxLength={1000}/>
          )}
        </FormItem>
        {/* 确认 */}
        <FormItem>
          <Button type="primary" disabled={stepContinueDisabled} htmlType={'submit'} onClick={this.nextStep} style={{marginTop:20,width: 208, height: 40}}>保存</Button>
        </FormItem>
      </Form>
    )

    return(
      <div>
        <Modal
          visible={opinionModalVisible} //
          width={472}
          zIndex={1006}
          footer={null}
          maskClosable={false}
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
export default Form.create()(OpinionModal)
