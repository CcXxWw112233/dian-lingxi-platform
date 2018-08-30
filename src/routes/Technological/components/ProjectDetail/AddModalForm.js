import React from 'react'
import { Modal, Form, Button, Input } from 'antd'
import DragValidation from '../../../../components/DragValidation'
import AddModalFormStyles from './AddModalForm.less'
const FormItem = Form.Item
const TextArea = Input.TextArea
class AddModalForm extends React.Component {

  //监听是否完成验证
  listenCompleteValidation = (e) => {
    this.setState({
      completeValidation: e
    })
  }
  onCancel = () => {
    this.props.hideModal()
  }
  // 提交表单
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      values['board_id'] = this.props.board_id
      values['users'] = '15289744455,11098555@163.com'
      if (!err) {
        this.props.addMenbersInProject ? this.props.addMenbersInProject(values) : false
      }
    });
  }
  render() {
    const { modal: { modalVisible } } = this.props;
    const { getFieldDecorator } = this.props.form;

    const step_3 = (
      <Form onSubmit={this.handleSubmit} style={{margin: '0 auto',width: 336}}>
        <div style={{fontSize: 20,color: '#595959',marginTop: 28,marginBottom: 28}}>邀请他人一起参加项目</div>

        {/* 他人信息 */}
        <FormItem style={{width: 336}}>
          {getFieldDecorator('othersInfo', {
            rules: [{ required: false, message: '请输入姓名', whitespace: true }],
          })(
            <TextArea style={{height: 208}} placeholder="请输入被邀请人的手机号或邮箱，批量发送请使用换行间隔。（选填）"/>
          )}
        </FormItem>
        <div style={{marginTop :-10}}>
          <DragValidation  listenCompleteValidation={this.listenCompleteValidation.bind(this)}/>
        </div>
        {/* 确认 */}
        <FormItem
        >
          <Button type="primary" htmlType={'submit'} onClick={this.nextStep} style={{marginTop:20,width: 208, height: 40}}>创建项目</Button>
        </FormItem>
      </Form>
    )

    return(
      <div>
        <Modal
          visible={modalVisible}
          width={472}
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
export default Form.create()(AddModalForm)
