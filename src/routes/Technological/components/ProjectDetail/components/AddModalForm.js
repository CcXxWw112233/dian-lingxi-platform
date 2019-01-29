import React from 'react'
import { Modal, Form, Button, Input, message } from 'antd'
import DragValidation from '../../../../../components/DragValidation'
import AddModalFormStyles from './AddModalForm.less'
import StepTwoList from '../../Project/StepTwoList'
import { validateTel, validateEmail } from '../../../../../utils/verify'
import {MESSAGE_DURATION_TIME, PROJECTS} from "../../../../../globalset/js/constant";
import {currentNounPlanFilterName} from "../../../../../utils/businessFunction";
import CustormModal from '../../../../../components/CustormModal'

const FormItem = Form.Item
const TextArea = Input.TextArea


class AddModalForm extends React.Component {
  state = {
    appsArray: [],
    stepTwoContinueDisabled: true,
  }
  initialSet(){
    this.setState({
      appsArray: [],
      stepTwoContinueDisabled: true,
    })
  }

  componentWillReceiveProps(nextProps) {
    const { datas = {}} = nextProps.model
    const { appsList = [] } = datas
    // this.setState({
    //   appsArray: new Array(appsList.length)
    // })
  }
  //下一步
  nextStep = () => {
    this.setState({
      step: this.state.step < 3 ? ++this.state.step : 3
    })
  }

  onCancel = () => {
    this.initialSet()
    this.props.setAddModalFormVisibile()
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
    let appsString = ''
    for(let val of this.state.appsArray) {
      if(val && val !== 'itemIsNull') {
        appsString += val+','
      }
    }
    const { board_id, } = this.props
    const apps = appsString
    this.initialSet()
    this.props.setAddModalFormVisibile()
    this.props.addProjectApp ? this.props.addProjectApp({board_id, apps }) : false
  }
  render() {
    const { stepTwoContinueDisabled } = this.state

    const { model, modalVisible, } = this.props;
    const { datas = { }} = model
    const { appsList = [], projectDetailInfoData = {} } = datas
    const { app_data = [] } = projectDetailInfoData

    const step_2 = (
      <div style={{margin: '0 auto', width: 392, height: 'auto'}}>
        <div style={{fontSize: 20, color: '#595959', marginTop: 28, marginBottom: 28}}>项目功能</div>
        <div style={{margin: '0 auto', width: 392}}>
          {appsList.map((value, key) => {
            const { id } = value
            let flag = true //过滤当前项目没有的app
            for(let i = 0; i < app_data.length; i++) {
              if(app_data[i]['app_id'] == id) {
                flag = false
                break
              }
            }
            return flag && (
              <StepTwoList itemValue={{...value, itemKey: key}} key={key} stepTwoButtonClick={this.stepTwoButtonClick.bind(this)}/>
            )
          })}
        </div>
        <div style={{marginTop: 20, marginBottom: 40, }}>
          <Button type="primary" onClick={this.handleSubmit.bind(this)} disabled={stepTwoContinueDisabled} style={{width: 100, height: 40}}>确认</Button>
        </div>
      </div>
    )

    return(
      <div>
        <CustormModal
          visible={modalVisible} //modalVisible
          maskClosable={false}
          width={472}
          footer={null}
          destroyOnClose
          style={{textAlign: 'center'}}
          onCancel={this.onCancel}
          overInner={step_2}
        >
          {/*{step_2}*/}
        </CustormModal>
      </div>
    )
  }
}
export default Form.create()(AddModalForm)
