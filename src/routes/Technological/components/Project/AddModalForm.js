import React from 'react'
import { Modal, Form, Button, Input } from 'antd'
import DragValidation from '../../../../components/DragValidation'
import AddModalFormStyles from './AddModalForm.less'
const FormItem = Form.Item
const TextArea = Input.TextArea
class AddModalForm extends React.Component {
  state = {
    step: 1
  }
  //表单输入时记录值
  boardNameChange(e){
    const value = e.target.value
    this.setState({
      board_name: value
    })
  }
  descriptionChange(e){
    this.setState({
      description: e.target.value
    })
  }
  usersChange(e) {
    this.setState({
      users: e.target.value
    })
    console.log(this.state.users)
  }
  //下一步
  nextStep = () => {
    this.setState({
      step: this.state.step < 3 ? ++this.state.step : 3
    })
  }
  //监听是否完成验证
  listenCompleteValidation = (e) => {
    this.setState({
      completeValidation: e
    })
  }
  onCancel = () => {
    this.setState({
      step: 1
    })
    this.props.hideModal()
  }
  // 提交表单
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values['board_name'] = this.state.board_name
        values['description'] = this.state.description
        values['users'] = '15289745555,15888880000'
        this.props.addNewProject ? this.props.addNewProject(values) : false
      }
    });
  }
  render() {
    const { step } = this.state
    const { modal: { modalVisible }, model, handleCancel } = this.props;
    const { getFieldDecorator } = this.props.form;

    const step_1 = (
      <Form  style={{margin: '0 auto',width: 336}}>
        <div style={{fontSize: 20,color: '#595959',marginTop: 28,marginBottom: 28}}>步骤一：给你的项目起个名称</div>
        {/* 项目名称 */}
        <FormItem style={{width: 336}}>
          {getFieldDecorator('board_name', {
            // rules: [{ required: false, message: '请输入姓名', whitespace: true }],
          })(
            <Input placeholder="输入项目名称"
                   onChange={this.boardNameChange.bind(this)}
                   style={{height: 40}}/>
          )}
        </FormItem>
        {/* 项目描述 */}
        <FormItem style={{width: 336}}>
          {getFieldDecorator('description', {
            // rules: [{ required: false, message: '请输入姓名', whitespace: true }],
          })(
            <TextArea style={{height: 208}} placeholder="项目描述（选填)"
                      onChange={this.descriptionChange.bind(this)}/>
          )}
        </FormItem>
        {/* 确认 */}
        <FormItem
        >
          <Button type="primary" onClick={this.nextStep} style={{width: 208, height: 40}}>下一步</Button>
        </FormItem>
      </Form>
    )
    const step_2 = (
      <div style={{margin: '0 auto',width: 392}}>
        <div style={{fontSize: 20,color: '#595959',marginTop: 28,marginBottom: 28}}>步骤二：选择本项目具备的功能</div>
        <Form  style={{margin: '0 auto',width: 392}}>
          <FormItem style={{width: 392}}>
            {getFieldDecorator('zhaobiao', {
            })(
              <div style={{display: 'flex',justifyContent: 'space-between',marginTop: 20}}>
                <div style={{textAlign: 'left',lineHeight: 1}}>
                  <span style={{fontSize: 16, color: '#000'}}>招标</span><br/>
                  <span style={{fontSize: 12, color: '#8c8c8c',display:'inline-block',marginTop: 4}}>将项目发布到平台，招募合作投资商、设计院或咨询机构。</span>
                </div>
                <div>
                  <Button disabled onClick={this.nextStep} style={{width: 80, height: 32}}>未开放</Button>
                </div>
              </div>
            )}
          </FormItem>
          <FormItem style={{width: 392}}>
            {getFieldDecorator('name', {
            })(
              <div style={{display: 'flex',justifyContent: 'space-between',}}>
                <div style={{textAlign: 'left',lineHeight: 1}}>
                  <span style={{fontSize: 16, color: '#000'}}>流程</span><br/>
                  <span style={{fontSize: 12, color: '#8c8c8c',display:'inline-block',marginTop: 4}}>把控项目进度，明确多方在合同上的交付、时间等要求。</span>
                </div>
                <div>
                  <Button disabled onClick={this.nextStep} style={{width: 80, height: 32}}>未开放</Button>
                </div>
              </div>
            )}
          </FormItem>
          <FormItem style={{width: 392}}>
            {getFieldDecorator('name', {
            })(
              <div style={{display: 'flex',justifyContent: 'space-between',}}>
                <div style={{textAlign: 'left',lineHeight: 1}}>
                  <span style={{fontSize: 16, color: '#000'}}>任务</span><br/>
                  <span style={{fontSize: 12, color: '#8c8c8c',display:'inline-block',marginTop: 4}}>分解任务与管理工作进度。</span>
                </div>
                <div>
                  <Button disabled onClick={this.nextStep} style={{width: 80, height: 32}}>未开放</Button>
                </div>
              </div>
            )}
          </FormItem>
          <FormItem style={{width: 392}}>
            {getFieldDecorator('name', {
              // rules: [{ required: false, message: '请输入姓名', whitespace: true }],
            })(
              <div style={{display: 'flex',justifyContent: 'space-between',}}>
                <div style={{textAlign: 'left',lineHeight: 1}}>
                  <span style={{fontSize: 16, color: '#000'}}>文档</span><br/>
                  <span style={{fontSize: 12, color: '#8c8c8c',display:'inline-block',marginTop: 4}}>项目内的共享资料，版本管理（加密传输，授权使用）。</span>
                </div>
                <div>
                  <Button disabled onClick={this.nextStep} style={{width: 80, height: 32}}>未开放</Button>
                </div>
              </div>
            )}
          </FormItem>

        </Form>


        <Button type="primary" onClick={this.nextStep} style={{width: 208,marginTop: 20, height: 40}}>跳过</Button>
      </div>
    )
    const step_3 = (
      <Form onSubmit={this.handleSubmit} style={{margin: '0 auto',width: 336}}>
        <div style={{fontSize: 20,color: '#595959',marginTop: 28,marginBottom: 28}}>步骤三：邀请他人一起参加项目</div>

        {/* 他人信息 */}
        <FormItem style={{width: 336}}>
          {getFieldDecorator('users', {
            // rules: [{ required: false, message: '请输入姓名', whitespace: true }],
          })(
            <TextArea style={{height: 208}} placeholder="请输入被邀请人的手机号或邮箱，批量发送请使用换行间隔。（选填）"
                       onChange={this.usersChange.bind(this)}/>
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
          <div style={{height: 440}}>
            {step === 1 ? (
              step_1
            ) : (
              step === 2 ? (step_2) : (step_3)
            )}
            <div className={AddModalFormStyles.circleOut}>
              <div className={step===1 ? AddModalFormStyles.chooseCircle : ''}></div>
              <div className={step===2 ? AddModalFormStyles.chooseCircle : ''}></div>
              <div className={step===3 ? AddModalFormStyles.chooseCircle : ''}></div>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}
export default Form.create()(AddModalForm)
