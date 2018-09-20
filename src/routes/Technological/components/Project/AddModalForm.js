import React from 'react'
import { Modal, Form, Button, Input, message } from 'antd'
import DragValidation from '../../../../components/DragValidation'
import AddModalFormStyles from './AddModalForm.less'
import StepTwoList from './StepTwoList'
import { validateTel, validateEmail } from '../../../../utils/verify'
import {MESSAGE_DURATION_TIME} from "../../../../globalset/js/constant";

const FormItem = Form.Item
const TextArea = Input.TextArea


class AddModalForm extends React.Component {
  state = {
    step: 1,
    appsArray: [],
    stepOneContinueDisabled: true,
    stepTwoContinueDisabled: true,
    stepThreeContinueDisabled: true,
    completeValidation: false, //完成滑块验证
  }
  componentWillReceiveProps(nextProps) {
    const { datas = {}} = nextProps.model
    const { appsList = [] } = datas
    // this.setState({
    //   appsArray: new Array(appsList.length)
    // })
  }
  //表单输入时记录值
  boardNameChange(e){
    const value = e.target.value
    this.setState({
      board_name: value,
      stepOneContinueDisabled: !e.target.value
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
  }
  //下一步
  nextStep = () => {
    this.setState({
      step: this.state.step < 3 ? ++this.state.step : 3
    })
  }
  //监听是否完成验证
  listenCompleteValidation = (e) => {
    // console.log(e)
    this.setState({
      completeValidation: e,
      stepThreeContinueDisabled: !e
    })
  }
  onCancel = () => {
    this.setState({
      step: 1
    })
    this.props.hideModal()
  }

  //step 2 表单单项button点击
  stepTwoButtonClick(data) {
    const { isAdd, id, itemKey } = data
    const appsArray = this.state.appsArray
    if(isAdd) {
      appsArray[itemKey] = id
    }else{
      appsArray[itemKey] = 'itemIsNull'
    }
    this.setState({
      appsArray
    },function () {
      let stepTwoContinueDisabled = true
      console.log(this.state.appsArray)
      for(let val of this.state.appsArray) {
        if(val && val !== 'itemIsNull') {
          stepTwoContinueDisabled = false
          break
        }
      }
      this.setState({
        stepTwoContinueDisabled
      })
    })
  }
  // 提交表单
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values['board_name'] = this.state.board_name
        values['description'] = this.state.description
        let appsString = ''
        for(let val of this.state.appsArray) {
          if(val && val !== 'itemIsNull') {
            appsString += val+','
          }
        }
        values['apps'] = appsString

        //参与人
        if(this.state.users) {
          let users = this.state.users.replace(/\n/gim,',') //替代换行符
          let usersArr = users.split(',')   //转成数组
          let usersNewArr = []
          for(let val of usersArr) {
            if(val) {
              usersNewArr.push(val)
            }
          }
          users = usersNewArr.join(',')
          for(let val of usersNewArr ) {
            if(!validateTel(val) && !validateEmail(val)) {
              message.warn('请正确输入被邀请人的手机号或者邮箱。',MESSAGE_DURATION_TIME)
              return false
            }
          }
          values['users'] = users
        }
        this.props.addNewProject ? this.props.addNewProject(values) : false
      }
    });
  }
  render() {
    const { step, stepOneContinueDisabled, stepTwoContinueDisabled, stepThreeContinueDisabled } = this.state
    const { modal: { modalVisible }, model, handleCancel } = this.props;
    const { datas = { }} = model
    const { appsList = [] } = datas
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
            <TextArea style={{height: 208,resize: 'none'}} placeholder="项目描述（选填)"
                      onChange={this.descriptionChange.bind(this)}/>
          )}
        </FormItem>
        {/* 确认 */}
        <FormItem
        >
          <Button type="primary" disabled={stepOneContinueDisabled}  onClick={this.nextStep} style={{width: 208, height: 40}}>下一步</Button>
        </FormItem>
      </Form>
    )

    const step_2 = (
      <div style={{margin: '0 auto',width: 392, height: 'auto'}}>
        <div style={{fontSize: 20,color: '#595959',marginTop: 28,marginBottom: 28}}>步骤二：选择本项目具备的功能</div>
        <div  style={{margin: '0 auto',width: 392}}>
          {appsList.map((value, key) => {
            return (
              <StepTwoList itemValue={{...value, itemKey: key}} key={key} stepTwoButtonClick={this.stepTwoButtonClick.bind(this)}/>
            )
          })}
        </div>
        <Button type="primary" disabled={stepTwoContinueDisabled} onClick={this.nextStep} style={{width: 208,marginTop: 20,marginBottom: 40, height: 40}}>下一步</Button>
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
            <TextArea style={{height: 208,resize: 'none'}} placeholder="请输入被邀请人的手机号或邮箱，批量发送请使用换行间隔。（选填）"
                       onChange={this.usersChange.bind(this)}/>
          )}
        </FormItem>
        <div style={{marginTop :-10}}>
          <DragValidation  listenCompleteValidation={this.listenCompleteValidation.bind(this)}/>
        </div>
        {/* 确认 */}
        <FormItem
        >
          <Button type="primary" htmlType={'submit'} disabled={stepThreeContinueDisabled} onClick={this.nextStep} style={{marginTop:20,width: 208, height: 40}}>完成创建</Button>
        </FormItem>
      </Form>
    )

    return(
      <div>
        <Modal
          visible={modalVisible} //modalVisible
          maskClosable={false}
          width={472}
          footer={null}
          destroyOnClose
          style={{textAlign:'center'}}
          onCancel={this.onCancel}
        >
          <div style={{height: step=== 2 ? 'auto':440}}>
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
