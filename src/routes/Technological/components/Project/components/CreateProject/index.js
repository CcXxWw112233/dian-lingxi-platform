import React from 'react'
import { Modal, Form, Button, Input, message, Select } from 'antd'
import DragValidation from '../../../../../../components/DragValidation'
import indexStyles from './index.less'
import StepTwoListItem from './StepTwoListItem'
import { validateTel, validateEmail } from '../../../../../../utils/verify'
import {MESSAGE_DURATION_TIME, PROJECTS} from "../../../../../../globalset/js/constant";
import {currentNounPlanFilterName} from "../../../../../../utils/businessFunction";
import CustormModal from '../../../../../../components/CustormModal'
import InviteOthers from './../../../InviteOthers/index'
import { getProjectList } from '../../../../../../services/technological/workbench'
import {isApiResponseOk} from "../../../../../../utils/handleResponseData";
const FormItem = Form.Item
const TextArea = Input.TextArea
const { Option } = Select;

class CreateProject extends React.Component {
  state = {
    step: 2,
    step_2_type: 'copy', // normal / copy step = 2 时 默认类型/复制
    appsArray: [],
    stepOneContinueDisabled: true,
    stepTwoContinueDisabled: true,
    stepThreeContinueDisabled: true,
    completeValidation: false, //完成滑块验证
    users: [], //被邀请人
    projects: [], //带有app列表的项目列表
    project_apps: []
  }
  componentWillReceiveProps(nextProps) {
    const { datas = {}} = nextProps.model
    const { appsList = [] } = datas
    // this.setState({
    //   appsArray: new Array(appsList.length)
    // })

  }
  componentDidMount() {
    this.getProjectList()
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
  //上一步
  lastStep = (step) => {
    this.setState({
      step
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
    }, function () {
      let stepTwoContinueDisabled = true
      // console.log(this.state.appsArray)
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
        // if(this.state.users) {
        //   let users = this.state.users.replace(/\n/gim, ',') //替代换行符
        //   let usersArr = users.split(',') //转成数组
        //   let usersNewArr = []
        //   for(let val of usersArr) {
        //     if(val) {
        //       usersNewArr.push(val)
        //     }
        //   }
        //   users = usersNewArr.join(',')
        //   for(let val of usersNewArr ) {
        //     if(!validateTel(val) && !validateEmail(val)) {
        //       message.warn('请正确输入被邀请人的手机号或者邮箱。', MESSAGE_DURATION_TIME)
        //       return false
        //     }
        //   }
        //   values['users'] = users
        // }
        const {users} = this.state
        values['users'] = this.handleUsersToUsersStr(users)
        this.props.addNewProject ? this.props.addNewProject(values) : false
      }
    });
  }
  handleUsersToUsersStr = (users = []) => {
    return users.reduce((acc, curr) => {
    const isCurrentUserFromPlatform = () => curr.type === 'platform' && curr.id
    if(isCurrentUserFromPlatform()) {
      if(acc) {
        return acc + "," + curr.id
      }
      return curr.id
    } else {
      if(acc) {
        return acc + ',' + curr.user
      }
      return curr.user
    }
    }, '')
  }
  handleInviteMemberReturnResult = selectedMember => {
    this.setState({
      users: selectedMember
    })
  }

  //复制
  selectProjectChange = (board_id) => {
    const { projects = [] } = this.state
    const apps = (projects.find(item => board_id == item.board_id) || {}).apps
    this.setState({
      project_apps: apps
    })
  }
  getProjectList = () => {
    const that = this
    getProjectList().then(res => {
      if(isApiResponseOk(res)) {
        that.setState({
          projects: res.data
        })
      }else {
        message.warn(res.massage)
      }
    })
  }
  render() {
    const { step, stepOneContinueDisabled, stepTwoContinueDisabled, stepThreeContinueDisabled, step_2_type, projects = [], project_apps = [] } = this.state
    const { modal: { modalVisible }, model, handleCancel } = this.props;
    const { datas = { }} = model
    const { appsList = [] } = datas
    const { getFieldDecorator } = this.props.form;

    //编辑名称
    const step_1 = (
      <Form style={{margin: '0 auto', width: 336}}>
        <div style={{fontSize: 20, color: '#595959', marginTop: 28, marginBottom: 28}}>步骤一：给你的{currentNounPlanFilterName(PROJECTS)}起个名称</div>
        {/* 项目名称 */}
        <FormItem style={{width: 336}}>
          {getFieldDecorator('board_name', {
            // initialValue:
          })(
            <Input placeholder={`输入${currentNounPlanFilterName(PROJECTS)}名称`}
                   onChange={this.boardNameChange.bind(this)}
                   style={{height: 40}}/>
          )}
        </FormItem>
        {/* 项目描述 */}
        <FormItem style={{width: 336}}>
          {getFieldDecorator('description', {
            // rules: [{ required: false, message: '请输入姓名', whitespace: true }],
          })(
            <TextArea style={{height: 208, resize: 'none'}} placeholder={`${currentNounPlanFilterName(PROJECTS)}描述（选填)`}
                      onChange={this.descriptionChange.bind(this)}/>
          )}
        </FormItem>
        {/* 确认 */}
        <FormItem
        >
          <Button type="primary" disabled={stepOneContinueDisabled} onClick={this.nextStep} style={{width: 208, height: 40}}>下一步</Button>
        </FormItem>
      </Form>
    )

    //打开应用
    const step_2 = (
      <div style={{margin: '0 auto', width: 392, height: 'auto'}}>
        <div style={{fontSize: 20, color: '#595959', marginTop: 28, marginBottom: 28}}>步骤二：选择本{currentNounPlanFilterName(PROJECTS)}具备的功能</div>
        <div style={{margin: '0 auto', width: 392}}>
          {appsList.map((value, key) => {
            return (
              <StepTwoListItem itemValue={{...value, itemKey: key}} key={key} stepTwoButtonClick={this.stepTwoButtonClick.bind(this)}/>
            )
          })}
        </div>
        <div style={{color: '#1890ff',textDecoration: 'underline',marginTop: 28, textAlign: 'left', cursor: 'pointer'}}>从现有项目复制</div>
        <div style={{marginTop: 20, marginBottom: 40, }}>
          <Button onClick={this.lastStep.bind(this, 1)} style={{width: 100, height: 40, marginRight: 20}}>上一步</Button>
          <Button type="primary" disabled={stepTwoContinueDisabled} onClick={this.nextStep} style={{width: 100, height: 40}}>下一步</Button>
        </div>
      </div>
    )
   //复制应用
    const step_2_copy = (
      <div style={{margin: '0 auto', width: 392, height: 'auto'}}>
        <div style={{fontSize: 20, color: '#595959', marginTop: 28, marginBottom: 28}}>复制现有项目</div>
        <Select
          showSearch
          style={{ width: '100%' }}
          size={'large'}
          placeholder="选择项目"
          optionFilterProp="children"
          onChange={this.selectProjectChange}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {projects.map((value, key) => {
            const { board_id, board_name } = value
            return (
              <Option value={board_id} key={board_id}>{board_name}</Option>
            )
          })}
        </Select>
        <div style={{margin: '0 auto', width: 392}}>
          {project_apps.map((value, key) => {
            return (
              <StepTwoListItem itemValue={{...value, itemKey: key}} key={key} stepTwoButtonClick={this.stepTwoButtonClick.bind(this)}/>
            )
          })}
        </div>
        <div style={{color: '#1890ff',textDecoration: 'underline',marginTop: 28, textAlign: 'left', cursor: 'pointer'}}>从现有项目复制</div>
        <div style={{marginTop: 20, marginBottom: 40, }}>
          <Button onClick={this.lastStep.bind(this, 1)} style={{width: 100, height: 40, marginRight: 20}}>上一步</Button>
          <Button type="primary" disabled={stepTwoContinueDisabled} onClick={this.nextStep} style={{width: 100, height: 40}}>下一步</Button>
        </div>
      </div>
    )

    //邀请他人信息
    const step_3 = (
      <Form onSubmit={this.handleSubmit} style={{margin: '0 auto', width: 336}}>
        <div style={{fontSize: 20, color: '#595959', marginTop: 28, marginBottom: 28}}>步骤三：邀请他人一起参加{currentNounPlanFilterName(PROJECTS)}</div>
        {/* 他人信息 */}
        <InviteOthers isShowTitle={false} isShowSubmitBtn={false} handleInviteMemberReturnResult={this.handleInviteMemberReturnResult} />
          {/* 确认 */}
        <FormItem>
          <div style={{marginTop: 20, marginBottom: 40, }}>
            <Button onClick={this.lastStep.bind(this, 2)} style={{width: 100, height: 40, marginRight: 20}}>上一步</Button>
            <Button type="primary" htmlType={'submit'} onClick={this.nextStep} style={{width: 100, height: 40}}>完成创建</Button>
          </div>
        </FormItem>
      </Form>
    )

    return(
      <div>
        <CustormModal
          visible={true} //modalVisible
          maskClosable={false}
          width={472}
          footer={null}
          destroyOnClose
          style={{textAlign: 'center'}}
          onCancel={this.onCancel}
          overInner={( <div style={{height: step=== 2 ? 440: step === 3 ? 520 : 'auto' }}>
            <div style={{display: step === 1?'block': 'none'}}>
              {step_1}
            </div>
            <div style={{display: step === 2?'block': 'none'}}>
              {step_2_type == 'normal'? step_2 : step_2_copy}
            </div>
            <div style={{display: step === 3?'block': 'none'}}>
              {step_3}
            </div>
            <div className={indexStyles.circleOut}>
              <div className={step===1 ? indexStyles.chooseCircle : ''}></div>
              <div className={step===2 ? indexStyles.chooseCircle : ''}></div>
              <div className={step===3 ? indexStyles.chooseCircle : ''}></div>
            </div>
          </div>)}
        >
        </CustormModal>
      </div>
    )
  }
}
export default Form.create()(CreateProject)
